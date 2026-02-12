import { supabase, isSupabaseConfigured } from './supabase';

// ============================================================
// CRIMEINTEL 7.0 Ω — SUPABASE API SERVICE
// Usa Supabase se configurato, altrimenti fallback a mock data
// ============================================================

export const supa = {
  get enabled() { return isSupabaseConfigured() && !!supabase; },

  // ── AUTH ──
  async signUp(email: string, password: string, name: string, role = 'VIEWER') {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, email, name, role });
    }
    return data;
  },

  async signIn(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  },

  async getSession() {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async getProfile() {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return data;
  },

  // ── CASES ──
  async getCases(filters?: { status?: string; priority?: string; search?: string; page?: number; limit?: number }) {
    if (!supabase) return null;
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const from = (page - 1) * limit;

    let query = supabase
      .from('v_cases_with_counts')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('updated_at', { ascending: false })
      .range(from, from + limit - 1);

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.priority) query = query.eq('priority', filters.priority);
    if (filters?.search) query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,case_number.ilike.%${filters.search}%`);

    const { data, count, error } = await query;
    if (error) throw error;
    return { items: data || [], pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) } };
  },

  async getCase(id: string) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('cases')
      .select(`*, evidence(*), fusion_results(*), reports(*), profiles!cases_user_id_fkey(name, email)`)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createCase(caseData: { title: string; description?: string; priority?: string; location_name?: string; tags?: string[] }) {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.from('cases').insert({
      ...caseData,
      user_id: user.id,
      status: 'OPEN',
    }).select().single();
    if (error) throw error;

    await supabase.from('audit_log').insert({ user_id: user.id, action: 'CASE_CREATED', resource: 'case', target_id: data.id, details: { title: caseData.title } });
    return data;
  },

  async updateCase(id: string, updates: Record<string, unknown>) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('cases').update(updates).eq('id', id).select().single();
    if (error) throw error;

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('audit_log').insert({ user_id: user.id, action: 'CASE_UPDATED', resource: 'case', target_id: id, details: updates });
    }
    return data;
  },

  async getCaseStats() {
    if (!supabase) return null;
    const { data, error } = await supabase.from('v_case_stats').select('*').single();
    if (error) throw error;
    return data;
  },

  // ── EVIDENCE ──
  async getEvidence(caseId: string) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('evidence').select('*').eq('case_id', caseId).is('deleted_at', null).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async uploadEvidence(caseId: string, file: File) {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const filePath = `evidence/${caseId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('evidence').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('evidence').getPublicUrl(filePath);

    const fileType = file.type.startsWith('image/') ? 'IMAGE' : file.type.startsWith('video/') ? 'VIDEO' : file.type.startsWith('audio/') ? 'AUDIO' : 'DOCUMENT';

    const { data, error } = await supabase.from('evidence').insert({
      case_id: caseId,
      file_name: file.name,
      file_type: fileType,
      file_size: file.size,
      file_url: urlData.publicUrl,
      mime_type: file.type,
      uploaded_by: user.id,
      ai_status: 'PENDING',
    }).select().single();
    if (error) throw error;

    await supabase.from('audit_log').insert({ user_id: user.id, action: 'EVIDENCE_UPLOADED', resource: 'evidence', target_id: data.id, details: { fileName: file.name, type: fileType } });
    return data;
  },

  // ── AI RESULTS ──
  async getAIResults(caseId: string) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('ai_results').select('*').eq('case_id', caseId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // ── FUSION ──
  async getFusion(caseId: string) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('fusion_results').select('*').eq('case_id', caseId).order('created_at', { ascending: false }).limit(1).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // ── REPORTS ──
  async getReports(filters?: { type?: string; search?: string }) {
    if (!supabase) return null;
    let query = supabase.from('reports').select(`*, cases!reports_case_id_fkey(case_number), profiles!reports_created_by_fkey(name)`).order('created_at', { ascending: false });
    if (filters?.type) query = query.eq('type', filters.type);
    if (filters?.search) query = query.ilike('title', `%${filters.search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // ── AUDIT LOG ──
  async getAuditLog(filters?: { action?: string; search?: string }) {
    if (!supabase) return null;
    let query = supabase.from('audit_log').select(`*, profiles!audit_log_user_id_fkey(name, email)`).order('created_at', { ascending: false }).limit(100);
    if (filters?.action) query = query.eq('action', filters.action);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // ── USERS ──
  async getUsers() {
    if (!supabase) return null;
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // ── GRAPH ──
  async getGraphNodes() {
    if (!supabase) return null;
    const { data, error } = await supabase.from('graph_nodes').select(`*, graph_node_cases(case_id)`).order('risk_score', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getGraphEdges() {
    if (!supabase) return null;
    const { data, error } = await supabase.from('graph_edges').select('*');
    if (error) throw error;
    return data;
  },

  // ── PREDICTIVE ──
  async getHotZones() {
    if (!supabase) return null;
    const { data, error } = await supabase.from('hot_zones').select('*').order('risk_level', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getPredictions() {
    if (!supabase) return null;
    const { data, error } = await supabase.from('predictions').select('*').eq('is_active', true).order('probability', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getPatterns() {
    if (!supabase) return null;
    const { data, error } = await supabase.from('patterns').select('*').order('confidence', { ascending: false });
    if (error) throw error;
    return data;
  },

  // ── SEARCH (basic, NeuroSearch uses vectors in production) ──
  async search(query: string) {
    if (!supabase) return null;
    const q = `%${query}%`;
    const [casesRes, evidenceRes] = await Promise.all([
      supabase.from('cases').select('*').is('deleted_at', null).or(`title.ilike.${q},description.ilike.${q},case_number.ilike.${q}`).limit(20),
      supabase.from('evidence').select(`*, cases!evidence_case_id_fkey(id, case_number)`).is('deleted_at', null).ilike('file_name', q).limit(10),
    ]);
    return {
      totalResults: (casesRes.data?.length || 0) + (evidenceRes.data?.length || 0),
      engineVersion: 'NeuroSearch v3.1-supabase',
      results: { cases: casesRes.data || [], evidence: evidenceRes.data || [] },
    };
  },

  // ── SYSTEM SETTINGS ──
  async getSettings() {
    if (!supabase) return null;
    const { data, error } = await supabase.from('system_settings').select('*');
    if (error) throw error;
    const settings: Record<string, unknown> = {};
    data?.forEach(row => { settings[row.key] = row.value; });
    return settings;
  },
};
