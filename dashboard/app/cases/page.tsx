'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function CasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const fetchCases = async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page) };
      if (search) params.search = search;
      const res = await api.getCases(params);
      setCases(res.data.items || []);
      setPagination(res.data.pagination);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCases(); }, []);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      await api.createCase({ title: newTitle, description: newDesc });
      setShowCreate(false);
      setNewTitle('');
      setNewDesc('');
      fetchCases();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const statusColor: Record<string, string> = {
    OPEN: 'text-ci-warning',
    ACTIVE: 'text-ci-success',
    CLOSED: 'text-ci-muted',
    ARCHIVED: 'text-gray-500',
  };

  const priorityBadge: Record<string, string> = {
    CRITICAL: 'bg-red-500/20 text-red-400',
    HIGH: 'bg-orange-500/20 text-orange-400',
    MEDIUM: 'bg-yellow-500/20 text-yellow-400',
    LOW: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <div className="min-h-screen">
      <nav className="border-b border-ci-border bg-ci-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-2xl font-bold text-ci-accent">CrimeIntel</button>
          <span className="text-xs bg-ci-accent/20 text-ci-accent px-2 py-0.5 rounded">7.0 Ω</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/search')} className="text-ci-muted hover:text-ci-text transition">NeuroSearch</button>
          <button onClick={() => { api.clearToken(); router.push('/login'); }} className="text-ci-danger hover:text-red-300 transition text-sm">Logout</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Cases</h1>
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-ci-accent hover:bg-ci-accent-hover text-white rounded transition text-sm font-medium">
            + New Case
          </button>
        </div>

        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Search cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCases()}
            className="flex-1 px-4 py-2 bg-ci-card border border-ci-border rounded focus:border-ci-accent focus:outline-none text-ci-text"
          />
          <button onClick={() => fetchCases()} className="px-4 py-2 bg-ci-card border border-ci-border rounded hover:bg-ci-border transition">Search</button>
        </div>

        {showCreate && (
          <div className="mb-6 bg-ci-card border border-ci-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Create New Case</h3>
            <input
              type="text"
              placeholder="Case title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full mb-3 px-4 py-2 bg-ci-bg border border-ci-border rounded focus:border-ci-accent focus:outline-none text-ci-text"
            />
            <textarea
              placeholder="Description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full mb-3 px-4 py-2 bg-ci-bg border border-ci-border rounded focus:border-ci-accent focus:outline-none text-ci-text h-20 resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleCreate} className="px-4 py-2 bg-ci-accent hover:bg-ci-accent-hover text-white rounded transition text-sm">Create</button>
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-ci-border hover:bg-gray-600 rounded transition text-sm">Cancel</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center text-ci-muted py-12">Loading cases...</div>
        ) : cases.length === 0 ? (
          <div className="text-center text-ci-muted py-12">No cases found</div>
        ) : (
          <div className="space-y-3">
            {cases.map((c: any) => (
              <div
                key={c.id}
                onClick={() => router.push(`/cases/${c.id}`)}
                className="bg-ci-card border border-ci-border rounded-lg p-5 hover:border-ci-accent/50 transition cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-ci-muted font-mono">{c.caseNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${priorityBadge[c.priority] || ''}`}>{c.priority}</span>
                    </div>
                    <h3 className="font-semibold text-lg">{c.title}</h3>
                    {c.description && <p className="text-ci-muted text-sm mt-1 line-clamp-2">{c.description}</p>}
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${statusColor[c.status] || ''}`}>{c.status}</span>
                    <p className="text-xs text-ci-muted mt-1">{c._count?.evidence || 0} evidence</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-4 text-xs text-ci-muted">
                  <span>Created: {new Date(c.createdAt).toLocaleDateString()}</span>
                  {c.locationName && <span>Location: {c.locationName}</span>}
                  {c.tags?.length > 0 && <span>Tags: {c.tags.join(', ')}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchCases(p)}
                className={`px-3 py-1 rounded text-sm ${p === pagination.page ? 'bg-ci-accent text-white' : 'bg-ci-card border border-ci-border hover:bg-ci-border'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
