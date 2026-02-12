-- ============================================================
-- CRIMEINTEL 7.0 Ω — ADVANCED SECURITY FUNCTIONS
-- ============================================================

-- ── AUDIT TRIGGER AUTOMATICO ──
-- Inserisce automaticamente un log nell'audit_log per ogni modifica
CREATE OR REPLACE FUNCTION fn_audit_trigger()
RETURNS TRIGGER AS $$
DECLARE
  _action audit_action;
  _details JSONB;
BEGIN
  IF TG_OP = 'INSERT' THEN
    _action := (TG_ARGV[0] || '_CREATED')::audit_action;
    _details := jsonb_build_object('new', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    _action := (TG_ARGV[0] || '_UPDATED')::audit_action;
    _details := jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    _action := (TG_ARGV[0] || '_DELETED')::audit_action;
    _details := jsonb_build_object('old', to_jsonb(OLD));
  END IF;

  INSERT INTO audit_log (user_id, action, resource, target_id, details)
  VALUES (
    auth.uid(),
    _action,
    TG_TABLE_NAME,
    CASE WHEN TG_OP = 'DELETE' THEN OLD.id::text ELSE NEW.id::text END,
    _details
  );

  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_cases_audit
  AFTER INSERT OR UPDATE OR DELETE ON cases
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger('CASE');

CREATE TRIGGER tr_evidence_audit
  AFTER INSERT OR DELETE ON evidence
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger('EVIDENCE');

-- ── CHAIN OF CUSTODY TRIGGER ──
-- Auto-inserisce un record nella chain_of_custody di ogni evidence
CREATE OR REPLACE FUNCTION fn_evidence_chain_of_custody()
RETURNS TRIGGER AS $$
DECLARE
  _chain JSONB;
  _prev_hash TEXT;
  _new_hash TEXT;
  _actor_name TEXT;
  _entry JSONB;
BEGIN
  _chain := COALESCE(NEW.chain_of_custody, '[]'::JSONB);

  IF jsonb_array_length(_chain) > 0 THEN
    _prev_hash := _chain->(-1)->>'hash';
  ELSE
    _prev_hash := repeat('0', 64);
  END IF;

  SELECT name INTO _actor_name FROM profiles WHERE id = auth.uid();

  _new_hash := encode(
    digest(
      NEW.id::text || '|' || now()::text || '|' || COALESCE(auth.uid()::text, 'system') || '|' || _prev_hash,
      'sha256'
    ),
    'hex'
  );

  _entry := jsonb_build_object(
    'action', CASE WHEN TG_OP = 'INSERT' THEN 'UPLOADED' ELSE 'MODIFIED' END,
    'actor_id', COALESCE(auth.uid()::text, 'system'),
    'actor_name', COALESCE(_actor_name, 'System'),
    'timestamp', now()::text,
    'hash', _new_hash,
    'prev_hash', _prev_hash,
    'details', CASE WHEN TG_OP = 'INSERT' THEN 'Evidence uploaded: ' || NEW.file_name ELSE 'Evidence modified' END
  );

  NEW.chain_of_custody := _chain || _entry;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_evidence_custody
  BEFORE INSERT OR UPDATE ON evidence
  FOR EACH ROW EXECUTE FUNCTION fn_evidence_chain_of_custody();

-- ── SOFT DELETE FUNCTION ──
CREATE OR REPLACE FUNCTION fn_soft_delete_case(case_id UUID)
RETURNS VOID AS $$
BEGIN
  IF NOT is_admin_or_supervisor() THEN
    RAISE EXCEPTION 'Insufficient permissions for case deletion';
  END IF;

  UPDATE cases SET deleted_at = now() WHERE id = case_id AND deleted_at IS NULL;
  UPDATE evidence SET deleted_at = now() WHERE case_id = fn_soft_delete_case.case_id AND deleted_at IS NULL;

  INSERT INTO audit_log (user_id, action, resource, target_id, details)
  VALUES (auth.uid(), 'CASE_DELETED', 'case', case_id::text, jsonb_build_object('soft_delete', true));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── FAILED LOGIN TRACKING ──
CREATE TABLE IF NOT EXISTS failed_logins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  attempt_count INTEGER DEFAULT 1,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_failed_logins_email ON failed_logins(email);

CREATE OR REPLACE FUNCTION fn_record_failed_login(
  _email TEXT,
  _ip INET DEFAULT NULL,
  _ua TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  _record RECORD;
  _max_attempts INT := 5;
  _lockout_minutes INT := 15;
BEGIN
  SELECT * INTO _record FROM failed_logins
    WHERE email = _email AND created_at > now() - interval '1 hour'
    ORDER BY created_at DESC LIMIT 1;

  IF _record IS NOT NULL THEN
    UPDATE failed_logins
    SET attempt_count = _record.attempt_count + 1,
        updated_at = now(),
        locked_until = CASE
          WHEN _record.attempt_count + 1 >= _max_attempts
          THEN now() + (_lockout_minutes * interval '1 minute')
          ELSE NULL
        END
    WHERE id = _record.id;

    IF _record.attempt_count + 1 >= _max_attempts THEN
      INSERT INTO audit_log (action, resource, details)
      VALUES ('LOGIN_FAILED', 'auth', jsonb_build_object(
        'email', _email,
        'locked', true,
        'attempts', _record.attempt_count + 1,
        'locked_until', now() + (_lockout_minutes * interval '1 minute')
      ));
      RETURN jsonb_build_object('locked', true, 'locked_until', now() + (_lockout_minutes * interval '1 minute'));
    END IF;

    RETURN jsonb_build_object('locked', false, 'attempts', _record.attempt_count + 1);
  ELSE
    INSERT INTO failed_logins (email, ip_address, user_agent)
    VALUES (_email, _ip, _ua);
    RETURN jsonb_build_object('locked', false, 'attempts', 1);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION fn_check_account_locked(_email TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM failed_logins
    WHERE email = _email
      AND locked_until IS NOT NULL
      AND locked_until > now()
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION fn_clear_failed_logins(_email TEXT)
RETURNS VOID AS $$
  DELETE FROM failed_logins WHERE email = _email;
$$ LANGUAGE sql SECURITY DEFINER;

-- ── DATA RETENTION POLICY ──
CREATE OR REPLACE FUNCTION fn_cleanup_old_audit_logs(retention_days INT DEFAULT 365)
RETURNS INT AS $$
DECLARE
  _deleted INT;
BEGIN
  IF NOT (SELECT get_user_role() = 'ADMIN') THEN
    RAISE EXCEPTION 'Only admins can run cleanup';
  END IF;

  DELETE FROM audit_log WHERE created_at < now() - (retention_days * interval '1 day');
  GET DIAGNOSTICS _deleted = ROW_COUNT;

  INSERT INTO audit_log (user_id, action, resource, details)
  VALUES (auth.uid(), 'SETTINGS_CHANGED', 'audit_log', jsonb_build_object(
    'action', 'cleanup', 'deleted_records', _deleted, 'retention_days', retention_days
  ));

  RETURN _deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── EVIDENCE INTEGRITY CHECK ──
CREATE OR REPLACE FUNCTION fn_verify_evidence_integrity(evidence_id UUID)
RETURNS JSONB AS $$
DECLARE
  _evidence RECORD;
  _chain JSONB;
  _valid BOOLEAN := true;
  _broken_at INT := -1;
  _prev_hash TEXT;
  _i INT;
BEGIN
  SELECT * INTO _evidence FROM evidence WHERE id = evidence_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Evidence not found');
  END IF;

  _chain := COALESCE(_evidence.chain_of_custody, '[]'::JSONB);

  FOR _i IN 1..jsonb_array_length(_chain) - 1 LOOP
    _prev_hash := _chain->(_i - 1)->>'hash';
    IF _chain->_i->>'prev_hash' != _prev_hash THEN
      _valid := false;
      _broken_at := _i;
      EXIT;
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'evidence_id', evidence_id,
    'chain_length', jsonb_array_length(_chain),
    'integrity_valid', _valid,
    'broken_at', CASE WHEN _valid THEN NULL ELSE _broken_at END,
    'hash_sha512', _evidence.hash_sha512,
    'verified_at', now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── STORAGE BUCKET POLICIES ──
-- Run in Supabase Dashboard > Storage > Policies
-- Evidence bucket: authenticated users only, max 500MB per file
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evidence',
  'evidence',
  false,
  524288000, -- 500MB
  ARRAY[
    'image/jpeg', 'image/png', 'image/tiff', 'image/webp',
    'video/mp4', 'video/avi', 'video/quicktime', 'video/webm',
    'audio/wav', 'audio/mpeg', 'audio/ogg', 'audio/flac',
    'application/pdf', 'application/json', 'text/csv'
  ]
) ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS: Only authenticated users can upload, only case owners / admins can read
CREATE POLICY "evidence_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'evidence' AND auth.uid() IS NOT NULL);

CREATE POLICY "evidence_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'evidence' AND auth.uid() IS NOT NULL);

CREATE POLICY "evidence_delete_admin" ON storage.objects FOR DELETE
  USING (bucket_id = 'evidence' AND is_admin_or_supervisor());

-- ── SECURITY DASHBOARD VIEW ──
CREATE OR REPLACE VIEW v_security_overview AS
SELECT
  (SELECT COUNT(*) FROM profiles WHERE is_active = true) as active_users,
  (SELECT COUNT(*) FROM profiles WHERE is_active = false) as inactive_users,
  (SELECT COUNT(*) FROM audit_log WHERE created_at > now() - interval '24 hours') as audit_events_24h,
  (SELECT COUNT(*) FROM audit_log WHERE action = 'LOGIN_FAILED' AND created_at > now() - interval '24 hours') as failed_logins_24h,
  (SELECT COUNT(*) FROM failed_logins WHERE locked_until > now()) as locked_accounts,
  (SELECT COUNT(*) FROM evidence WHERE hash_sha512 IS NOT NULL) as hashed_evidence,
  (SELECT COUNT(*) FROM evidence WHERE hash_sha512 IS NULL) as unhashed_evidence,
  (SELECT COUNT(*) FROM evidence WHERE chain_of_custody != '[]'::JSONB) as evidence_with_custody,
  (SELECT COUNT(*) FROM cases WHERE deleted_at IS NOT NULL) as soft_deleted_cases;
