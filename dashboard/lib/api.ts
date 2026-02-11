const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private token: string | null = null;

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
    const data = await this.request<{ data: { user: any; token: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.data.token);
    return data.data;
  }

  async register(email: string, password: string, name?: string) {
    const data = await this.request<{ data: { user: any; token: string } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    this.setToken(data.data.token);
    return data.data;
  }

  // Cases
  async getCases(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<{ data: any }>(`/cases${query}`);
  }

  async getCase(id: string) {
    return this.request<{ data: any }>(`/cases/${id}`);
  }

  async createCase(data: any) {
    return this.request<{ data: any }>('/cases', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCase(id: string, data: any) {
    return this.request<{ data: any }>(`/cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCase(id: string) {
    return this.request<{ data: any }>(`/cases/${id}`, { method: 'DELETE' });
  }

  async getCaseStats() {
    return this.request<{ data: any }>('/cases/stats');
  }

  // Evidence
  async uploadEvidence(caseId: string, file: File, metadata?: string) {
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
    return this.request<{ data: any }>(`/evidence/case/${caseId}`);
  }

  async getEvidenceDetail(id: string) {
    return this.request<{ data: any }>(`/evidence/${id}`);
  }

  async verifyEvidence(id: string) {
    return this.request<{ data: any }>(`/evidence/${id}/verify`);
  }

  // HyperFusion
  async runFusion(caseId: string) {
    return this.request<{ data: any }>(`/hyperfusion/${caseId}/run`, { method: 'POST' });
  }

  async getFusion(caseId: string) {
    return this.request<{ data: any }>(`/hyperfusion/${caseId}`);
  }

  // NeuroSearch
  async search(query: string, filters?: { caseId?: string; type?: string }) {
    const params = new URLSearchParams({ q: query });
    if (filters?.caseId) params.set('caseId', filters.caseId);
    if (filters?.type) params.set('type', filters.type);
    return this.request<{ data: any }>(`/neurosearch?${params}`);
  }

  // Reports
  async generateReport(caseId: string, type?: string) {
    const query = type ? `?type=${type}` : '';
    return this.request<{ data: any }>(`/reports/${caseId}/generate${query}`, { method: 'POST' });
  }

  async getReports(caseId: string) {
    return this.request<{ data: any }>(`/reports/case/${caseId}`);
  }

  // Health
  async health() {
    return this.request<{ data: any }>('/health');
  }
}

export const api = new ApiClient();
export default api;
