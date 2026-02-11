import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api/v1';

class MobileApiClient {
  private token: string | null = null;

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('ci_token', token);
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('ci_token');
    }
    return this.token;
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem('ci_token');
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, { ...options, headers });

    if (res.status === 401) {
      await this.clearToken();
      throw new Error('Unauthorized');
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message || `HTTP ${res.status}`);
    }
    return res.json();
  }

  async login(email: string, password: string) {
    const data = await this.request<{ data: { user: any; token: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await this.setToken(data.data.token);
    return data.data;
  }

  async getCases(page = 1) {
    return this.request<{ data: any }>(`/cases?page=${page}`);
  }

  async getCase(id: string) {
    return this.request<{ data: any }>(`/cases/${id}`);
  }

  async getCaseStats() {
    return this.request<{ data: any }>('/cases/stats');
  }

  async uploadEvidence(caseId: string, fileUri: string, fileName: string, mimeType: string) {
    const token = await this.getToken();
    const formData = new FormData();
    formData.append('file', { uri: fileUri, name: fileName, type: mimeType } as any);
    formData.append('caseId', caseId);

    const res = await fetch(`${API_URL}/evidence/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  }

  async search(query: string) {
    return this.request<{ data: any }>(`/neurosearch?q=${encodeURIComponent(query)}`);
  }
}

export const mobileApi = new MobileApiClient();
export default mobileApi;
