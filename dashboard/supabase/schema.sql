-- ============================================================
-- CRIMEINTEL 7.0 OMEGA — SUPABASE SCHEMA COMPLETO
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUM TYPES
-- ============================================================
CREATE TYPE user_role AS ENUM ('ADMIN', 'SUPERVISOR', 'INVESTIGATOR', 'ANALYST', 'VIEWER');
CREATE TYPE case_status AS ENUM ('OPEN', 'ACTIVE', 'PENDING_REVIEW', 'CLOSED', 'ARCHIVED');
CREATE TYPE case_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE evidence_type AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO', 'PLATE', 'THERMAL', 'SATELLITE', 'OTHER');
CREATE TYPE ai_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE report_type AS ENUM ('SUMMARY', 'FORENSIC', 'AI_ANALYSIS', 'TIMELINE', 'FUSION', 'FORENSIC_EXPORT');
CREATE TYPE report_status AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE audit_action AS ENUM (
  'USER_LOGIN', 'USER_REGISTERED', 'LOGIN_FAILED',
  'CASE_CREATED', 'CASE_UPDATED', 'CASE_DELETED',
  'EVIDENCE_UPLOADED', 'EVIDENCE_VERIFIED', 'EVIDENCE_DELETED',
  'FUSION_COMPLETED', 'REPORT_GENERATED',
  'AI_ANALYSIS_RUN', 'SEARCH_PERFORMED', 'SETTINGS_CHANGED'
);
CREATE TYPE node_type AS ENUM ('person', 'vehicle', 'location', 'organization', 'phone', 'crypto', 'digital', 'financial');
CREATE TYPE severity_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- ============================================================
-- 1. PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'VIEWER',
  is_active BOOLEAN NOT NULL DEFAULT true,
  avatar_url TEXT,
  phone TEXT,
  department TEXT,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. CASES
-- ============================================================
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status case_status NOT NULL DEFAULT 'OPEN',
  priority case_priority NOT NULL DEFAULT 'MEDIUM',
  user_id UUID NOT NULL REFERENCES profiles(id),
  location_name TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_priority ON cases(priority);
CREATE INDEX idx_cases_user_id ON cases(user_id);
CREATE INDEX idx_cases_created_at ON cases(created_at DESC);
CREATE INDEX idx_cases_tags ON cases USING GIN(tags);

-- ============================================================
-- 3. EVIDENCE
-- ============================================================
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type evidence_type NOT NULL DEFAULT 'OTHER',
  file_size BIGINT DEFAULT 0,
  file_url TEXT,
  mime_type TEXT,
  hash_sha512 TEXT,
  ai_status ai_status NOT NULL DEFAULT 'PENDING',
  ai_results JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  uploaded_by UUID REFERENCES profiles(id),
  chain_of_custody JSONB DEFAULT '[]',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_evidence_case_id ON evidence(case_id);
CREATE INDEX idx_evidence_ai_status ON evidence(ai_status);
CREATE INDEX idx_evidence_file_type ON evidence(file_type);

-- ============================================================
-- 4. AI ANALYSIS RESULTS
-- ============================================================
CREATE TABLE ai_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  module TEXT NOT NULL, -- yolov8, facerec, lpr, thermal, satellite, audio, video
  engine_version TEXT,
  inference_ms DOUBLE PRECISION,
  confidence DOUBLE PRECISION,
  result_type TEXT, -- detection label
  result_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_results_case ON ai_results(case_id);
CREATE INDEX idx_ai_results_module ON ai_results(module);
CREATE INDEX idx_ai_results_evidence ON ai_results(evidence_id);

-- ============================================================
-- 5. HYPERFUSION RESULTS
-- ============================================================
CREATE TABLE fusion_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  fusion_score DOUBLE PRECISION,
  summary TEXT,
  entities JSONB DEFAULT '[]',
  correlations JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  timeline JSONB DEFAULT '[]',
  risk_assessment JSONB DEFAULT '{}',
  processing_ms DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_fusion_case ON fusion_results(case_id);

-- ============================================================
-- 6. REPORTS
-- ============================================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type report_type NOT NULL DEFAULT 'SUMMARY',
  status report_status NOT NULL DEFAULT 'PROCESSING',
  content JSONB DEFAULT '{}',
  pages INTEGER DEFAULT 0,
  file_size BIGINT DEFAULT 0,
  file_url TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_case ON reports(case_id);
CREATE INDEX idx_reports_type ON reports(type);

-- ============================================================
-- 7. AUDIT LOG
-- ============================================================
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action audit_action NOT NULL,
  resource TEXT,
  target_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

-- ============================================================
-- 8. CRIME GRAPH — NODES
-- ============================================================
CREATE TABLE graph_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  node_type node_type NOT NULL,
  risk_score DOUBLE PRECISION DEFAULT 0,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_graph_nodes_type ON graph_nodes(node_type);
CREATE INDEX idx_graph_nodes_risk ON graph_nodes(risk_score DESC);

-- ============================================================
-- 9. CRIME GRAPH — EDGES
-- ============================================================
CREATE TABLE graph_edges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_node UUID NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
  to_node UUID NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
  relation TEXT NOT NULL,
  weight DOUBLE PRECISION DEFAULT 0.5,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_graph_edges_from ON graph_edges(from_node);
CREATE INDEX idx_graph_edges_to ON graph_edges(to_node);

-- ============================================================
-- 10. CRIME GRAPH — NODE ↔ CASE LINK
-- ============================================================
CREATE TABLE graph_node_cases (
  node_id UUID NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  PRIMARY KEY (node_id, case_id)
);

-- ============================================================
-- 11. PREDICTIVE — HOT ZONES
-- ============================================================
CREATE TABLE hot_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  area TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  risk_level DOUBLE PRECISION DEFAULT 0,
  active_cases INTEGER DEFAULT 0,
  prediction TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 12. PREDICTIVE — PREDICTIONS
-- ============================================================
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timeframe TEXT NOT NULL,
  event TEXT NOT NULL,
  probability DOUBLE PRECISION DEFAULT 0,
  severity severity_level NOT NULL DEFAULT 'MEDIUM',
  related_cases UUID[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 13. PREDICTIVE — PATTERNS
-- ============================================================
CREATE TABLE patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  confidence DOUBLE PRECISION DEFAULT 0,
  related_cases UUID[] DEFAULT '{}',
  pattern_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 14. CASE TIMELINE EVENTS
-- ============================================================
CREATE TABLE case_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  actor_id UUID REFERENCES profiles(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_timeline_case ON case_timeline(case_id);

-- ============================================================
-- 15. CASE LINKS (related/correlated cases)
-- ============================================================
CREATE TABLE case_links (
  case_a UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  case_b UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  link_type TEXT DEFAULT 'related',
  strength DOUBLE PRECISION DEFAULT 0.5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (case_a, case_b)
);

-- ============================================================
-- 16. SYSTEM SETTINGS
-- ============================================================
CREATE TABLE system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_cases_updated BEFORE UPDATE ON cases FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_evidence_updated BEFORE UPDATE ON evidence FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_graph_nodes_updated BEFORE UPDATE ON graph_nodes FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- AUTO CASE NUMBER
-- ============================================================
CREATE SEQUENCE case_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.case_number IS NULL OR NEW.case_number = '' THEN
    NEW.case_number = 'CI-' || EXTRACT(YEAR FROM now())::TEXT || '-' || LPAD(nextval('case_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_case_number BEFORE INSERT ON cases FOR EACH ROW EXECUTE FUNCTION generate_case_number();

-- ============================================================
-- VIEWS
-- ============================================================
CREATE OR REPLACE VIEW v_case_stats AS
SELECT
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'OPEN') as open,
  COUNT(*) FILTER (WHERE status = 'ACTIVE') as active,
  COUNT(*) FILTER (WHERE status = 'CLOSED') as closed,
  COUNT(*) FILTER (WHERE priority = 'CRITICAL') as critical,
  COUNT(*) FILTER (WHERE priority = 'HIGH') as high_priority
FROM cases WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW v_evidence_stats AS
SELECT
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE ai_status = 'COMPLETED') as ai_completed,
  COUNT(*) FILTER (WHERE ai_status = 'PROCESSING') as ai_processing,
  COUNT(*) FILTER (WHERE ai_status = 'PENDING') as ai_pending,
  COUNT(*) FILTER (WHERE ai_status = 'FAILED') as ai_failed
FROM evidence WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW v_cases_with_counts AS
SELECT
  c.*,
  COUNT(e.id) as evidence_count,
  COUNT(e.id) FILTER (WHERE e.ai_status = 'COMPLETED') as ai_completed_count,
  p.name as user_name,
  p.email as user_email
FROM cases c
LEFT JOIN evidence e ON e.case_id = c.id AND e.deleted_at IS NULL
LEFT JOIN profiles p ON p.id = c.user_id
WHERE c.deleted_at IS NULL
GROUP BY c.id, p.name, p.email;
