-- ============================================================
-- CRIMEINTEL 7.0 OMEGA — ADVANCED DATABASE FUNCTIONS
-- Full-Text Search, Notifications, Analytics, RPC Functions
-- Eseguire DOPO schema.sql e seed.sql
-- ============================================================

-- ============================================================
-- FULL-TEXT SEARCH (tsvector + GIN indexes)
-- ============================================================

-- Add tsvector columns for fast search
ALTER TABLE cases ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE evidence ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE graph_nodes ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- GIN indexes for FTS
CREATE INDEX IF NOT EXISTS idx_cases_fts ON cases USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_evidence_fts ON evidence USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_fts ON graph_nodes USING GIN(search_vector);

-- Auto-update tsvector on cases
CREATE OR REPLACE FUNCTION cases_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('italian', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('italian', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('italian', COALESCE(NEW.case_number, '')), 'A') ||
    setweight(to_tsvector('italian', COALESCE(NEW.location_name, '')), 'C') ||
    setweight(to_tsvector('italian', COALESCE(array_to_string(NEW.tags, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_cases_search_vector
  BEFORE INSERT OR UPDATE OF title, description, case_number, location_name, tags
  ON cases FOR EACH ROW
  EXECUTE FUNCTION cases_search_vector_update();

-- Auto-update tsvector on evidence
CREATE OR REPLACE FUNCTION evidence_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', COALESCE(NEW.file_name, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.file_type::text, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.mime_type, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_evidence_search_vector
  BEFORE INSERT OR UPDATE OF file_name, file_type, mime_type
  ON evidence FOR EACH ROW
  EXECUTE FUNCTION evidence_search_vector_update();

-- Auto-update tsvector on graph_nodes
CREATE OR REPLACE FUNCTION graph_nodes_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', COALESCE(NEW.label, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.node_type::text, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_graph_nodes_search_vector
  BEFORE INSERT OR UPDATE OF label, node_type
  ON graph_nodes FOR EACH ROW
  EXECUTE FUNCTION graph_nodes_search_vector_update();

-- Rebuild existing search vectors
UPDATE cases SET search_vector =
  setweight(to_tsvector('italian', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('italian', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('italian', COALESCE(case_number, '')), 'A') ||
  setweight(to_tsvector('italian', COALESCE(location_name, '')), 'C') ||
  setweight(to_tsvector('italian', COALESCE(array_to_string(tags, ' '), '')), 'B');

UPDATE evidence SET search_vector =
  setweight(to_tsvector('simple', COALESCE(file_name, '')), 'A') ||
  setweight(to_tsvector('simple', COALESCE(file_type::text, '')), 'B') ||
  setweight(to_tsvector('simple', COALESCE(mime_type, '')), 'C');

UPDATE graph_nodes SET search_vector =
  setweight(to_tsvector('simple', COALESCE(label, '')), 'A') ||
  setweight(to_tsvector('simple', COALESCE(node_type::text, '')), 'B');

-- ============================================================
-- RPC: Full-Text Search across all entities
-- ============================================================
CREATE OR REPLACE FUNCTION search_all(query_text TEXT, max_results INTEGER DEFAULT 50)
RETURNS TABLE (
  entity_type TEXT,
  entity_id UUID,
  title TEXT,
  description TEXT,
  relevance REAL,
  metadata JSONB
) AS $$
DECLARE
  ts_query tsquery;
BEGIN
  ts_query := plainto_tsquery('italian', query_text);

  RETURN QUERY
  -- Search cases
  SELECT
    'case'::TEXT,
    c.id,
    c.title,
    c.description,
    ts_rank(c.search_vector, ts_query)::REAL,
    jsonb_build_object('case_number', c.case_number, 'status', c.status, 'priority', c.priority)
  FROM cases c
  WHERE c.search_vector @@ ts_query AND c.deleted_at IS NULL

  UNION ALL

  -- Search evidence
  SELECT
    'evidence'::TEXT,
    e.id,
    e.file_name,
    e.file_type::TEXT,
    ts_rank(e.search_vector, plainto_tsquery('simple', query_text))::REAL,
    jsonb_build_object('case_id', e.case_id, 'ai_status', e.ai_status, 'file_size', e.file_size)
  FROM evidence e
  WHERE e.search_vector @@ plainto_tsquery('simple', query_text) AND e.deleted_at IS NULL

  UNION ALL

  -- Search graph nodes
  SELECT
    'graph_node'::TEXT,
    g.id,
    g.label,
    g.node_type::TEXT,
    ts_rank(g.search_vector, plainto_tsquery('simple', query_text))::REAL,
    jsonb_build_object('risk_score', g.risk_score, 'properties', g.properties)
  FROM graph_nodes g
  WHERE g.search_vector @@ plainto_tsquery('simple', query_text)

  ORDER BY relevance DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TYPE notification_type AS ENUM (
  'case_assigned', 'case_updated', 'case_critical',
  'evidence_uploaded', 'evidence_ai_completed',
  'fusion_completed', 'report_ready',
  'security_alert', 'system_announcement',
  'mention', 'deadline_approaching'
);

CREATE TYPE notification_priority AS ENUM ('low', 'normal', 'high', 'urgent');

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  priority notification_priority NOT NULL DEFAULT 'normal',
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  metadata JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "notifications_insert_system" ON notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "notifications_delete_own" ON notifications FOR DELETE USING (user_id = auth.uid());

-- ============================================================
-- RPC: Create notification (callable from triggers/edge functions)
-- ============================================================
CREATE OR REPLACE FUNCTION notify_user(
  p_user_id UUID,
  p_type notification_type,
  p_title TEXT,
  p_body TEXT DEFAULT NULL,
  p_link TEXT DEFAULT NULL,
  p_priority notification_priority DEFAULT 'normal',
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  notif_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, priority, title, body, link, metadata)
  VALUES (p_user_id, p_type, p_priority, p_title, p_body, p_link, p_metadata)
  RETURNING id INTO notif_id;

  RETURN notif_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- RPC: Notify all admins/supervisors
-- ============================================================
CREATE OR REPLACE FUNCTION notify_admins(
  p_type notification_type,
  p_title TEXT,
  p_body TEXT DEFAULT NULL,
  p_link TEXT DEFAULT NULL,
  p_priority notification_priority DEFAULT 'high'
)
RETURNS INTEGER AS $$
DECLARE
  count INTEGER := 0;
  admin_id UUID;
BEGIN
  FOR admin_id IN SELECT id FROM profiles WHERE role IN ('ADMIN', 'SUPERVISOR') AND is_active = true
  LOOP
    PERFORM notify_user(admin_id, p_type, p_title, p_body, p_link, p_priority);
    count := count + 1;
  END LOOP;
  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- AUTO-NOTIFY on critical case creation
-- ============================================================
CREATE OR REPLACE FUNCTION notify_on_critical_case()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.priority = 'CRITICAL' THEN
    PERFORM notify_admins(
      'case_critical',
      'Nuovo caso CRITICAL: ' || NEW.title,
      'Caso ' || NEW.case_number || ' creato con priorità CRITICAL. Richiede attenzione immediata.',
      '/cases/' || NEW.id,
      'urgent'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_notify_critical_case
  AFTER INSERT ON cases
  FOR EACH ROW
  WHEN (NEW.priority = 'CRITICAL')
  EXECUTE FUNCTION notify_on_critical_case();

-- ============================================================
-- AUTO-NOTIFY on evidence AI completed
-- ============================================================
CREATE OR REPLACE FUNCTION notify_on_ai_completed()
RETURNS TRIGGER AS $$
DECLARE
  case_owner UUID;
  case_num TEXT;
BEGIN
  IF OLD.ai_status != 'COMPLETED' AND NEW.ai_status = 'COMPLETED' THEN
    SELECT c.user_id, c.case_number INTO case_owner, case_num
    FROM cases c WHERE c.id = NEW.case_id;

    IF case_owner IS NOT NULL THEN
      PERFORM notify_user(
        case_owner,
        'evidence_ai_completed',
        'AI completata: ' || NEW.file_name,
        'Analisi AI completata per ' || NEW.file_name || ' (caso ' || case_num || ')',
        '/cases/' || NEW.case_id,
        'normal'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_notify_ai_completed
  AFTER UPDATE OF ai_status ON evidence
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_ai_completed();

-- ============================================================
-- MATERIALIZED VIEWS for dashboard analytics
-- ============================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_dashboard_analytics AS
SELECT
  -- Case stats
  (SELECT COUNT(*) FROM cases WHERE deleted_at IS NULL) as total_cases,
  (SELECT COUNT(*) FROM cases WHERE status = 'ACTIVE' AND deleted_at IS NULL) as active_cases,
  (SELECT COUNT(*) FROM cases WHERE status = 'OPEN' AND deleted_at IS NULL) as open_cases,
  (SELECT COUNT(*) FROM cases WHERE status = 'CLOSED' AND deleted_at IS NULL) as closed_cases,
  (SELECT COUNT(*) FROM cases WHERE priority = 'CRITICAL' AND deleted_at IS NULL) as critical_cases,
  -- Evidence stats
  (SELECT COUNT(*) FROM evidence WHERE deleted_at IS NULL) as total_evidence,
  (SELECT COUNT(*) FROM evidence WHERE ai_status = 'COMPLETED' AND deleted_at IS NULL) as ai_completed,
  (SELECT COUNT(*) FROM evidence WHERE ai_status = 'PROCESSING' AND deleted_at IS NULL) as ai_processing,
  (SELECT COUNT(*) FROM evidence WHERE ai_status = 'PENDING' AND deleted_at IS NULL) as ai_pending,
  (SELECT COUNT(*) FROM evidence WHERE ai_status = 'FAILED' AND deleted_at IS NULL) as ai_failed,
  -- User stats
  (SELECT COUNT(*) FROM profiles WHERE is_active = true) as active_users,
  -- Graph stats
  (SELECT COUNT(*) FROM graph_nodes) as graph_nodes,
  (SELECT COUNT(*) FROM graph_edges) as graph_edges,
  -- Report stats
  (SELECT COUNT(*) FROM reports WHERE status = 'COMPLETED') as completed_reports,
  -- Fusion stats
  (SELECT COUNT(*) FROM fusion_results) as total_fusions,
  (SELECT AVG(fusion_score) FROM fusion_results) as avg_fusion_score,
  -- Audit
  (SELECT COUNT(*) FROM audit_log WHERE created_at > now() - interval '24 hours') as audit_events_24h,
  -- Timestamp
  now() as refreshed_at;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_dashboard_singleton ON mv_dashboard_analytics (refreshed_at);

-- RPC to refresh analytics
CREATE OR REPLACE FUNCTION refresh_dashboard_analytics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_dashboard_analytics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- MATERIALIZED VIEW: Cases per month (last 12 months)
-- ============================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_cases_per_month AS
SELECT
  to_char(date_trunc('month', created_at), 'YYYY-MM') as month,
  to_char(date_trunc('month', created_at), 'Mon') as month_label,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE priority = 'CRITICAL') as critical_count,
  COUNT(*) FILTER (WHERE priority = 'HIGH') as high_count
FROM cases
WHERE deleted_at IS NULL
  AND created_at > now() - interval '12 months'
GROUP BY date_trunc('month', created_at)
ORDER BY date_trunc('month', created_at);

-- ============================================================
-- MATERIALIZED VIEW: Evidence per type
-- ============================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_evidence_per_type AS
SELECT
  file_type::TEXT as type,
  COUNT(*) as count,
  SUM(file_size) as total_size,
  COUNT(*) FILTER (WHERE ai_status = 'COMPLETED') as ai_completed,
  AVG(CASE WHEN ai_status = 'COMPLETED' THEN 1 ELSE 0 END) as ai_completion_rate
FROM evidence
WHERE deleted_at IS NULL
GROUP BY file_type
ORDER BY count DESC;

-- ============================================================
-- MATERIALIZED VIEW: Top risk graph nodes
-- ============================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_top_risk_nodes AS
SELECT
  gn.id,
  gn.label,
  gn.node_type,
  gn.risk_score,
  gn.properties,
  COUNT(DISTINCT gnc.case_id) as linked_cases,
  COUNT(DISTINCT ge_from.id) + COUNT(DISTINCT ge_to.id) as connections
FROM graph_nodes gn
LEFT JOIN graph_node_cases gnc ON gnc.node_id = gn.id
LEFT JOIN graph_edges ge_from ON ge_from.from_node = gn.id
LEFT JOIN graph_edges ge_to ON ge_to.to_node = gn.id
GROUP BY gn.id
ORDER BY gn.risk_score DESC
LIMIT 50;

-- ============================================================
-- RPC: Batch update case status
-- ============================================================
CREATE OR REPLACE FUNCTION batch_update_case_status(
  case_ids UUID[],
  new_status case_status,
  actor_id UUID DEFAULT auth.uid()
)
RETURNS INTEGER AS $$
DECLARE
  updated INTEGER;
BEGIN
  UPDATE cases SET status = new_status, updated_at = now()
  WHERE id = ANY(case_ids) AND deleted_at IS NULL;
  GET DIAGNOSTICS updated = ROW_COUNT;

  INSERT INTO audit_log (user_id, action, resource, target_id, details)
  SELECT actor_id, 'CASE_UPDATED', 'case', unnest(case_ids)::TEXT,
    jsonb_build_object('status', new_status, 'batch', true, 'count', updated);

  RETURN updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- RPC: Get case with full context (single query)
-- ============================================================
CREATE OR REPLACE FUNCTION get_case_full(p_case_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'case', row_to_json(c),
    'evidence', COALESCE((
      SELECT jsonb_agg(row_to_json(e) ORDER BY e.created_at DESC)
      FROM evidence e WHERE e.case_id = c.id AND e.deleted_at IS NULL
    ), '[]'::JSONB),
    'ai_results', COALESCE((
      SELECT jsonb_agg(row_to_json(ar) ORDER BY ar.created_at DESC)
      FROM ai_results ar WHERE ar.case_id = c.id
    ), '[]'::JSONB),
    'fusion', (
      SELECT row_to_json(fr)
      FROM fusion_results fr WHERE fr.case_id = c.id
      ORDER BY fr.created_at DESC LIMIT 1
    ),
    'reports', COALESCE((
      SELECT jsonb_agg(row_to_json(r) ORDER BY r.created_at DESC)
      FROM reports r WHERE r.case_id = c.id
    ), '[]'::JSONB),
    'timeline', COALESCE((
      SELECT jsonb_agg(row_to_json(ct) ORDER BY ct.created_at)
      FROM case_timeline ct WHERE ct.case_id = c.id
    ), '[]'::JSONB),
    'linked_cases', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', CASE WHEN cl.case_a = c.id THEN cl.case_b ELSE cl.case_a END,
        'link_type', cl.link_type,
        'strength', cl.strength,
        'title', lc.title,
        'case_number', lc.case_number
      ))
      FROM case_links cl
      LEFT JOIN cases lc ON lc.id = CASE WHEN cl.case_a = c.id THEN cl.case_b ELSE cl.case_a END
      WHERE cl.case_a = c.id OR cl.case_b = c.id
    ), '[]'::JSONB),
    'graph_nodes', COALESCE((
      SELECT jsonb_agg(row_to_json(gn))
      FROM graph_nodes gn
      INNER JOIN graph_node_cases gnc ON gnc.node_id = gn.id
      WHERE gnc.case_id = c.id
    ), '[]'::JSONB),
    'owner', (
      SELECT jsonb_build_object('name', p.name, 'email', p.email, 'role', p.role)
      FROM profiles p WHERE p.id = c.user_id
    )
  ) INTO result
  FROM cases c
  WHERE c.id = p_case_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- RPC: Dashboard stats (fast, from materialized view)
-- ============================================================
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSONB AS $$
BEGIN
  RETURN (
    SELECT row_to_json(mv)::JSONB
    FROM mv_dashboard_analytics mv
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- RPC: User activity summary
-- ============================================================
CREATE OR REPLACE FUNCTION get_user_activity(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS JSONB AS $$
BEGIN
  RETURN jsonb_build_object(
    'cases_created', (SELECT COUNT(*) FROM cases WHERE user_id = p_user_id AND created_at > now() - (p_days || ' days')::INTERVAL),
    'evidence_uploaded', (SELECT COUNT(*) FROM evidence WHERE uploaded_by = p_user_id AND created_at > now() - (p_days || ' days')::INTERVAL),
    'reports_generated', (SELECT COUNT(*) FROM reports WHERE created_by = p_user_id AND created_at > now() - (p_days || ' days')::INTERVAL),
    'audit_events', (SELECT COUNT(*) FROM audit_log WHERE user_id = p_user_id AND created_at > now() - (p_days || ' days')::INTERVAL),
    'last_login', (SELECT last_login FROM profiles WHERE id = p_user_id),
    'unread_notifications', (SELECT COUNT(*) FROM notifications WHERE user_id = p_user_id AND read_at IS NULL)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- RPC: Soft delete case with audit trail
-- ============================================================
CREATE OR REPLACE FUNCTION soft_delete_case(p_case_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  actor UUID := auth.uid();
BEGIN
  UPDATE cases SET deleted_at = now() WHERE id = p_case_id AND deleted_at IS NULL;
  UPDATE evidence SET deleted_at = now() WHERE case_id = p_case_id AND deleted_at IS NULL;

  INSERT INTO audit_log (user_id, action, resource, target_id, details)
  VALUES (actor, 'CASE_DELETED', 'case', p_case_id::TEXT, jsonb_build_object('soft_delete', true));

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- RPC: Mark notifications as read (batch)
-- ============================================================
CREATE OR REPLACE FUNCTION mark_notifications_read(notification_ids UUID[])
RETURNS INTEGER AS $$
DECLARE
  updated INTEGER;
BEGIN
  UPDATE notifications SET read_at = now()
  WHERE id = ANY(notification_ids) AND user_id = auth.uid() AND read_at IS NULL;
  GET DIAGNOSTICS updated = ROW_COUNT;
  RETURN updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- RPC: Evidence integrity check
-- ============================================================
CREATE OR REPLACE FUNCTION verify_evidence_integrity(p_evidence_id UUID)
RETURNS JSONB AS $$
DECLARE
  ev RECORD;
BEGIN
  SELECT * INTO ev FROM evidence WHERE id = p_evidence_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('verified', false, 'error', 'Evidence not found');
  END IF;

  RETURN jsonb_build_object(
    'verified', ev.hash_sha512 IS NOT NULL,
    'hash', ev.hash_sha512,
    'chain_of_custody', ev.chain_of_custody,
    'custody_entries', jsonb_array_length(COALESCE(ev.chain_of_custody, '[]'::JSONB)),
    'file_name', ev.file_name,
    'file_size', ev.file_size,
    'ai_status', ev.ai_status,
    'created_at', ev.created_at,
    'uploaded_by', ev.uploaded_by
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CRON-like: Auto cleanup old notifications (> 90 days)
-- Can be scheduled via pg_cron or Supabase scheduled functions
-- ============================================================
CREATE OR REPLACE FUNCTION cleanup_old_notifications(retention_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted INTEGER;
BEGIN
  DELETE FROM notifications WHERE created_at < now() - (retention_days || ' days')::INTERVAL AND read_at IS NOT NULL;
  GET DIAGNOSTICS deleted = ROW_COUNT;
  RETURN deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
