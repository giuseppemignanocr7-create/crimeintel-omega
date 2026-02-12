import {
  DEMO_USER, DEMO_TOKEN, DEMO_CASES, DEMO_STATS,
  getDemoCase, getDemoEvidence, DEMO_FUSION, demoSearch,
  DEMO_ACCOUNTS, setDemoUser, getDemoUser,
} from './mock-data';
import type { Profile, Case, CaseWithCounts, Evidence, FusionResult, SearchResults, CaseStats, PaginatedResponse } from './types';

interface AuthResponse { user: Profile; token: string }
interface ApiResponse<T> { data: T }

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private token: string | null = null;

  private get isDemo(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('ci_demo') === '1';
  }

  setDemo(on: boolean) {
    if (typeof window !== 'undefined') {
      if (on) localStorage.setItem('ci_demo', '1');
      else localStorage.removeItem('ci_demo');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ci_token', token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('ci_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ci_token');
      localStorage.removeItem('ci_demo');
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      this.clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return res.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<ApiResponse<AuthResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setDemo(false);
    this.setToken(data.data.token);
    return data.data;
  }

  async register(email: string, password: string, name?: string) {
    const data = await this.request<ApiResponse<AuthResponse>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    this.setDemo(false);
    this.setToken(data.data.token);
    return data.data;
  }

  async demoLogin() {
    // Try real backend first, fallback to offline demo
    try {
      const data = await this.request<ApiResponse<AuthResponse>>('/auth/demo', {
        method: 'POST',
      });
      this.setDemo(false);
      this.setToken(data.data.token);
      return data.data;
    } catch {
      // Backend unreachable — activate offline demo mode
      this.setDemo(true);
      this.setToken(DEMO_TOKEN);
      return { user: DEMO_USER, token: DEMO_TOKEN };
    }
  }

  async demoLoginAs(role: string) {
    const user = setDemoUser(role);
    this.setDemo(true);
    this.setToken(DEMO_TOKEN);
    return { user, token: DEMO_TOKEN };
  }

  getDemoAccounts() {
    return DEMO_ACCOUNTS;
  }

  getCurrentDemoUser() {
    return getDemoUser();
  }

  // Cases
  async getCases(params?: Record<string, string>) {
    if (this.isDemo) {
      let items = [...DEMO_CASES];
      const search = params?.search?.toLowerCase();
      if (search) {
        items = items.filter(c =>
          c.title.toLowerCase().includes(search) ||
          c.description.toLowerCase().includes(search) ||
          c.caseNumber.toLowerCase().includes(search)
        );
      }
      if (params?.status) items = items.filter(c => c.status === params.status);
      if (params?.priority) items = items.filter(c => c.priority === params.priority);
      const page = parseInt(params?.page || '1');
      const limit = parseInt(params?.limit || '20');
      const start = (page - 1) * limit;
      const paged = items.slice(start, start + limit);
      return { data: { items: paged, pagination: { page, limit, total: items.length, totalPages: Math.ceil(items.length / limit) } } };
    }
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<ApiResponse<PaginatedResponse<CaseWithCounts>>>(`/cases${query}`);
  }

  async getCase(id: string) {
    if (this.isDemo) {
      const c = getDemoCase(id);
      if (!c) throw new Error('Case not found');
      return { data: c };
    }
    return this.request<ApiResponse<Case>>(`/cases/${id}`);
  }

  async createCase(data: { title: string; description?: string; priority?: string }) {
    if (this.isDemo) {
      const num = DEMO_CASES.length + 1;
      const newCase = {
        id: `c${String(num).padStart(3, '0')}`,
        caseNumber: `CI-2026-${String(num).padStart(4, '0')}`,
        title: data.title,
        description: data.description || '',
        status: 'OPEN',
        priority: 'MEDIUM',
        userId: DEMO_USER.id,
        locationName: '',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { evidence: 0 },
      };
      DEMO_CASES.unshift(newCase);
      return { data: newCase };
    }
    return this.request<ApiResponse<Case>>('/cases', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCase(id: string, data: Partial<Case>) {
    if (this.isDemo) {
      const c = DEMO_CASES.find(x => x.id === id);
      if (c) Object.assign(c, data, { updatedAt: new Date().toISOString() });
      return { data: c };
    }
    return this.request<ApiResponse<Case>>(`/cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCase(id: string) {
    if (this.isDemo) {
      const idx = DEMO_CASES.findIndex(x => x.id === id);
      if (idx >= 0) DEMO_CASES.splice(idx, 1);
      return { data: { message: 'Case deleted' } };
    }
    return this.request<ApiResponse<{ message: string }>>(`/cases/${id}`, { method: 'DELETE' });
  }

  async getCaseStats() {
    if (this.isDemo) {
      return { data: DEMO_STATS };
    }
    return this.request<ApiResponse<CaseStats>>('/cases/stats');
  }

  // Evidence
  async uploadEvidence(caseId: string, file: File, metadata?: string) {
    if (this.isDemo) {
      const ev = {
        id: `ev-${Date.now()}`,
        caseId,
        type: file.type.startsWith('image') ? 'IMAGE' : file.type.startsWith('video') ? 'VIDEO' : 'DOCUMENT',
        fileName: file.name,
        fileSize: file.size,
        hash: `sha256-demo-${Date.now()}`,
        aiStatus: 'PROCESSING',
        createdAt: new Date().toISOString(),
      };
      return { data: ev };
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', caseId);
    if (metadata) formData.append('metadata', metadata);

    const token = this.getToken();
    const res = await fetch(`${API_URL}/evidence/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  }

  async getEvidence(caseId: string) {
    if (this.isDemo) return { data: getDemoEvidence(caseId) };
    return this.request<ApiResponse<Evidence[]>>(`/evidence/case/${caseId}`);
  }

  async getEvidenceDetail(id: string) {
    if (this.isDemo) return { data: { id, fileName: 'evidence.file', type: 'DOCUMENT' as const, aiStatus: 'COMPLETED' as const } };
    return this.request<ApiResponse<Evidence>>(`/evidence/${id}`);
  }

  async verifyEvidence(id: string) {
    if (this.isDemo) return { data: { verified: true, hash: `sha256-verified-${id}` } };
    return this.request<ApiResponse<{ verified: boolean; hash: string }>>(`/evidence/${id}/verify`);
  }

  // HyperFusion
  async runFusion(caseId: string) {
    if (this.isDemo) return { data: DEMO_FUSION(caseId) };
    return this.request<ApiResponse<FusionResult>>(`/hyperfusion/${caseId}/run`, { method: 'POST' });
  }

  async getFusion(caseId: string) {
    if (this.isDemo) return { data: DEMO_FUSION(caseId) };
    return this.request<ApiResponse<FusionResult>>(`/hyperfusion/${caseId}`);
  }

  // NeuroSearch
  async search(query: string, filters?: { caseId?: string; type?: string }) {
    if (this.isDemo) return { data: demoSearch(query) };
    const params = new URLSearchParams({ q: query });
    if (filters?.caseId) params.set('caseId', filters.caseId);
    if (filters?.type) params.set('type', filters.type);
    return this.request<ApiResponse<SearchResults>>(`/neurosearch?${params}`);
  }

  // Reports
  async generateReport(caseId: string, type?: string) {
    if (this.isDemo) {
      return { data: { id: `rep-demo-${Date.now()}`, type: type || 'SUMMARY', caseId, createdAt: new Date().toISOString() } };
    }
    const query = type ? `?type=${type}` : '';
    return this.request<ApiResponse<{ id: string; type: string; caseId: string; createdAt: string }>>(`/reports/${caseId}/generate${query}`, { method: 'POST' });
  }

  async getReports(caseId: string) {
    if (this.isDemo) {
      return { data: [
        { id: `rep-${caseId}-1`, type: 'SUMMARY', caseId, createdAt: new Date().toISOString() },
      ]};
    }
    return this.request<ApiResponse<{ id: string; type: string; caseId: string; createdAt: string }[]>>(`/reports/case/${caseId}`);
  }

  // Health
  async health() {
    if (this.isDemo) return { data: { status: 'ok', mode: 'demo-offline' } };
    return this.request<ApiResponse<{ status: string; mode: string }>>('/health');
  }
}

export const api = new ApiClient();
export default api;
