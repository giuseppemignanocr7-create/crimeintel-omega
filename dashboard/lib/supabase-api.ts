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

  async updateSetting(key: string, value: unknown) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('system_settings').upsert({ key, value, updated_at: new Date().toISOString() }).select().single();
    if (error) throw error;
    return data;
  },

  // ── CASE TIMELINE ──
  async getTimeline(caseId: string) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('case_timeline').select(`*, profiles!case_timeline_actor_id_fkey(name, email)`).eq('case_id', caseId).order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  async addTimelineEvent(caseId: string, event: { event_type: string; title: string; description?: string; metadata?: Record<string, unknown> }) {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase.from('case_timeline').insert({ ...event, case_id: caseId, actor_id: user.id }).select().single();
    if (error) throw error;
    return data;
  },

  // ── CASE LINKS ──
  async getCaseLinks(caseId: string) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('case_links').select('*').or(`case_a.eq.${caseId},case_b.eq.${caseId}`);
    if (error) throw error;
    if (!data) return [];
    const linkedIds = data.map(l => l.case_a === caseId ? l.case_b : l.case_a);
    const { data: linkedCases } = await supabase.from('cases').select('id, case_number, title, status, priority').in('id', linkedIds);
    return data.map(link => ({
      ...link,
      linked_case: linkedCases?.find(c => c.id === (link.case_a === caseId ? link.case_b : link.case_a)),
    }));
  },

  async linkCases(caseA: string, caseB: string, linkType = 'related', strength = 0.5) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('case_links').insert({ case_a: caseA, case_b: caseB, link_type: linkType, strength }).select().single();
    if (error) throw error;
    return data;
  },

  async unlinkCases(caseA: string, caseB: string) {
    if (!supabase) return null;
    const { error } = await supabase.from('case_links').delete().match({ case_a: caseA, case_b: caseB });
    if (error) throw error;
    return true;
  },

  // ── NOTIFICATIONS ──
  async getNotifications(unreadOnly = false) {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    let query = supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50);
    if (unreadOnly) query = query.is('read_at', null);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getUnreadCount() {
    if (!supabase) return 0;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;
    const { count, error } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).is('read_at', null);
    if (error) return 0;
    return count || 0;
  },

  async markNotificationsRead(ids: string[]) {
    if (!supabase) return 0;
    const { data, error } = await supabase.rpc('mark_notifications_read', { notification_ids: ids });
    if (error) throw error;
    return data as number;
  },

  async markAllNotificationsRead() {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { error } = await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('user_id', user.id).is('read_at', null);
    if (error) throw error;
    return true;
  },

  async dismissNotification(id: string) {
    if (!supabase) return null;
    const { error } = await supabase.from('notifications').update({ dismissed_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    return true;
  },

  // ── SOFT DELETE CASE ──
  async softDeleteCase(id: string) {
    if (!supabase) return null;
    const { data, error } = await supabase.rpc('soft_delete_case', { p_case_id: id });
    if (error) throw error;
    return data;
  },

  // ── BATCH OPERATIONS ──
  async batchUpdateCaseStatus(caseIds: string[], status: string) {
    if (!supabase) return null;
    const { data, error } = await supabase.rpc('batch_update_case_status', { case_ids: caseIds, new_status: status });
    if (error) throw error;
    return data as number;
  },

  // ── FULL-TEXT SEARCH (advanced, uses RPC) ──
  async searchAll(query: string, maxResults = 50) {
    if (!supabase) return null;
    const { data, error } = await supabase.rpc('search_all', { query_text: query, max_results: maxResults });
    if (error) throw error;
    return data;
  },

  // ── CASE FULL CONTEXT (single RPC call) ──
  async getCaseFull(caseId: string) {
    if (!supabase) return null;
    const { data, error } = await supabase.rpc('get_case_full', { p_case_id: caseId });
    if (error) throw error;
    return data;
  },

  // ── DASHBOARD STATS (from materialized view) ──
  async getDashboardStats() {
    if (!supabase) return null;
    const { data, error } = await supabase.rpc('get_dashboard_stats');
    if (error) throw error;
    return data;
  },

  // ── USER ACTIVITY ──
  async getUserActivity(userId: string, days = 30) {
    if (!supabase) return null;
    const { data, error } = await supabase.rpc('get_user_activity', { p_user_id: userId, p_days: days });
    if (error) throw error;
    return data;
  },

  // ── EVIDENCE INTEGRITY ──
  async verifyEvidenceIntegrity(evidenceId: string) {
    if (!supabase) return null;
    const { data, error } = await supabase.rpc('verify_evidence_integrity', { p_evidence_id: evidenceId });
    if (error) throw error;
    return data;
  },

  // ── STORAGE MANAGEMENT ──
  async listStorageFiles(caseId: string) {
    if (!supabase) return null;
    const { data, error } = await supabase.storage.from('evidence').list(`evidence/${caseId}`);
    if (error) throw error;
    return data;
  },

  async deleteStorageFile(filePath: string) {
    if (!supabase) return null;
    const { error } = await supabase.storage.from('evidence').remove([filePath]);
    if (error) throw error;
    return true;
  },

  async getSignedUrl(filePath: string, expiresIn = 3600) {
    if (!supabase) return null;
    const { data, error } = await supabase.storage.from('evidence').createSignedUrl(filePath, expiresIn);
    if (error) throw error;
    return data.signedUrl;
  },

  // ── UPDATE PROFILE ──
  async updateProfile(updates: { name?: string; phone?: string; department?: string; avatar_url?: string }) {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single();
    if (error) throw error;
    return data;
  },

  // ── REALTIME SUBSCRIPTIONS ──
  subscribeToCases(callback: (payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => void) {
    if (!supabase) return null;
    return supabase.channel('cases-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cases' },
        (payload) => callback({ eventType: payload.eventType, new: payload.new as Record<string, unknown>, old: payload.old as Record<string, unknown> })
      )
      .subscribe();
  },

  subscribeToEvidence(caseId: string, callback: (payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => void) {
    if (!supabase) return null;
    return supabase.channel(`evidence-${caseId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'evidence', filter: `case_id=eq.${caseId}` },
        (payload) => callback({ eventType: payload.eventType, new: payload.new as Record<string, unknown>, old: payload.old as Record<string, unknown> })
      )
      .subscribe();
  },

  subscribeToNotifications(userId: string, callback: (payload: { eventType: string; new: Record<string, unknown> }) => void) {
    if (!supabase) return null;
    return supabase.channel(`notifications-${userId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => callback({ eventType: payload.eventType, new: payload.new as Record<string, unknown> })
      )
      .subscribe();
  },

  subscribeToAuditLog(callback: (payload: { eventType: string; new: Record<string, unknown> }) => void) {
    if (!supabase) return null;
    return supabase.channel('audit-log-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_log' },
        (payload) => callback({ eventType: payload.eventType, new: payload.new as Record<string, unknown> })
      )
      .subscribe();
  },

  unsubscribe(channel: { unsubscribe: () => void } | null) {
    if (channel) channel.unsubscribe();
  },

  // ── PRESENCE (online users) ──
  trackPresence(userId: string, userData: { name: string; role: string }) {
    if (!supabase) return null;
    const channel = supabase.channel('online-users', { config: { presence: { key: userId } } });
    channel.subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ user_id: userId, ...userData, online_at: new Date().toISOString() });
      }
    });
    return channel;
  },

  // ── REFRESH ANALYTICS ──
  async refreshAnalytics() {
    if (!supabase) return null;
    const { error } = await supabase.rpc('refresh_dashboard_analytics');
    if (error) throw error;
    return true;
  },
};
