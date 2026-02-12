-- ============================================================
-- CRIMEINTEL 7.0 OMEGA — ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE fusion_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE graph_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE graph_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE graph_node_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE hot_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER: get current user role
-- ============================================================
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin_or_supervisor()
RETURNS boolean AS $$
  SELECT get_user_role() IN ('ADMIN', 'SUPERVISOR');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_select_admin" ON profiles FOR SELECT USING (is_admin_or_supervisor());
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "profiles_admin_all" ON profiles FOR ALL USING (get_user_role() = 'ADMIN');

-- ============================================================
-- CASES
-- ============================================================
CREATE POLICY "cases_select_own" ON cases FOR SELECT USING (
  user_id = auth.uid() OR is_admin_or_supervisor()
);
CREATE POLICY "cases_insert_auth" ON cases FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "cases_update_own" ON cases FOR UPDATE USING (
  user_id = auth.uid() OR is_admin_or_supervisor()
);
CREATE POLICY "cases_delete_admin" ON cases FOR DELETE USING (get_user_role() = 'ADMIN');

-- ============================================================
-- EVIDENCE
-- ============================================================
CREATE POLICY "evidence_select" ON evidence FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM cases c WHERE c.id = evidence.case_id
    AND (c.user_id = auth.uid() OR is_admin_or_supervisor())
  )
);
CREATE POLICY "evidence_insert" ON evidence FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "evidence_update" ON evidence FOR UPDATE USING (
  uploaded_by = auth.uid() OR is_admin_or_supervisor()
);
CREATE POLICY "evidence_delete_admin" ON evidence FOR DELETE USING (get_user_role() = 'ADMIN');

-- ============================================================
-- AI RESULTS
-- ============================================================
CREATE POLICY "ai_results_select" ON ai_results FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM cases c WHERE c.id = ai_results.case_id
    AND (c.user_id = auth.uid() OR is_admin_or_supervisor())
  )
);
CREATE POLICY "ai_results_insert_system" ON ai_results FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- FUSION RESULTS
-- ============================================================
CREATE POLICY "fusion_select" ON fusion_results FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM cases c WHERE c.id = fusion_results.case_id
    AND (c.user_id = auth.uid() OR is_admin_or_supervisor())
  )
);
CREATE POLICY "fusion_insert" ON fusion_results FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- REPORTS
-- ============================================================
CREATE POLICY "reports_select" ON reports FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM cases c WHERE c.id = reports.case_id
    AND (c.user_id = auth.uid() OR is_admin_or_supervisor())
  )
);
CREATE POLICY "reports_insert" ON reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- AUDIT LOG — only ADMIN and SUPERVISOR can read
-- ============================================================
CREATE POLICY "audit_select_admin" ON audit_log FOR SELECT USING (is_admin_or_supervisor());
CREATE POLICY "audit_insert_system" ON audit_log FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- GRAPH — all authenticated users can read
-- ============================================================
CREATE POLICY "graph_nodes_select" ON graph_nodes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "graph_nodes_modify_admin" ON graph_nodes FOR ALL USING (is_admin_or_supervisor());

CREATE POLICY "graph_edges_select" ON graph_edges FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "graph_edges_modify_admin" ON graph_edges FOR ALL USING (is_admin_or_supervisor());

CREATE POLICY "graph_node_cases_select" ON graph_node_cases FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "graph_node_cases_modify_admin" ON graph_node_cases FOR ALL USING (is_admin_or_supervisor());

-- ============================================================
-- PREDICTIVE — read for authenticated, modify for admin
-- ============================================================
CREATE POLICY "hot_zones_select" ON hot_zones FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "hot_zones_modify" ON hot_zones FOR ALL USING (is_admin_or_supervisor());

CREATE POLICY "predictions_select" ON predictions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "predictions_modify" ON predictions FOR ALL USING (is_admin_or_supervisor());

CREATE POLICY "patterns_select" ON patterns FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "patterns_modify" ON patterns FOR ALL USING (is_admin_or_supervisor());

-- ============================================================
-- CASE TIMELINE — follows case access
-- ============================================================
CREATE POLICY "timeline_select" ON case_timeline FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM cases c WHERE c.id = case_timeline.case_id
    AND (c.user_id = auth.uid() OR is_admin_or_supervisor())
  )
);
CREATE POLICY "timeline_insert" ON case_timeline FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- CASE LINKS
-- ============================================================
CREATE POLICY "case_links_select" ON case_links FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "case_links_modify" ON case_links FOR ALL USING (is_admin_or_supervisor());

-- ============================================================
-- SYSTEM SETTINGS — admin only
-- ============================================================
CREATE POLICY "settings_select_admin" ON system_settings FOR SELECT USING (is_admin_or_supervisor());
CREATE POLICY "settings_modify_admin" ON system_settings FOR ALL USING (get_user_role() = 'ADMIN');
