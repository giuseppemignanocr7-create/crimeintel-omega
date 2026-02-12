'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { NavShell } from '@/components/NavShell';

export default function CasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchCases = async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page) };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
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
    PENDING_REVIEW: 'text-purple-400',
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
    <NavShell current="/cases">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Gestione Casi</h1>
            <p className="text-ci-muted text-xs mt-0.5">{pagination?.total || cases.length} casi totali</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="px-3 md:px-4 py-2 bg-ci-accent hover:bg-ci-accent-hover active:bg-blue-700 text-white rounded transition text-sm font-medium">
            + Nuovo Caso
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4 md:mb-6 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Cerca casi per titolo, numero, descrizione..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCases()}
            className="flex-1 px-3 md:px-4 py-2.5 bg-ci-card border border-ci-border rounded focus:border-ci-accent focus:outline-none text-ci-text text-sm"
          />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); }} className="px-3 py-2.5 bg-ci-card border border-ci-border rounded text-ci-text text-sm focus:border-ci-accent focus:outline-none">
            <option value="">Tutti gli status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="OPEN">OPEN</option>
            <option value="PENDING_REVIEW">PENDING_REVIEW</option>
            <option value="CLOSED">CLOSED</option>
          </select>
          <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); }} className="px-3 py-2.5 bg-ci-card border border-ci-border rounded text-ci-text text-sm focus:border-ci-accent focus:outline-none">
            <option value="">Tutte le priorità</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
          <button onClick={() => fetchCases()} className="px-4 py-2.5 bg-ci-card border border-ci-border rounded hover:bg-ci-border active:bg-gray-600 transition text-sm">Cerca</button>
        </div>

        {showCreate && (
          <div className="mb-4 md:mb-6 bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h3 className="font-semibold mb-3 md:mb-4">Create New Case</h3>
            <input
              type="text"
              placeholder="Case title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full mb-3 px-3 md:px-4 py-2.5 bg-ci-bg border border-ci-border rounded focus:border-ci-accent focus:outline-none text-ci-text"
            />
            <textarea
              placeholder="Description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full mb-3 px-3 md:px-4 py-2.5 bg-ci-bg border border-ci-border rounded focus:border-ci-accent focus:outline-none text-ci-text h-20 resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleCreate} className="flex-1 md:flex-none px-4 py-2.5 bg-ci-accent hover:bg-ci-accent-hover text-white rounded transition text-sm">Create</button>
              <button onClick={() => setShowCreate(false)} className="flex-1 md:flex-none px-4 py-2.5 bg-ci-border hover:bg-gray-600 rounded transition text-sm">Cancel</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center text-ci-muted py-12">Loading cases...</div>
        ) : cases.length === 0 ? (
          <div className="text-center text-ci-muted py-12">No cases found</div>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {cases.map((c: any) => (
              <div
                key={c.id}
                onClick={() => router.push(`/cases/${c.id}`)}
                className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-5 hover:border-ci-accent/50 active:bg-ci-border/30 transition cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs text-ci-muted font-mono">{c.caseNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${priorityBadge[c.priority] || ''}`}>{c.priority}</span>
                    </div>
                    <h3 className="font-semibold text-base md:text-lg leading-tight">{c.title}</h3>
                    {c.description && <p className="text-ci-muted text-sm mt-1 line-clamp-2">{c.description}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs md:text-sm font-medium ${statusColor[c.status] || ''}`}>{c.status}</span>
                    <p className="text-xs text-ci-muted mt-1">{c._count?.evidence || 0} ev.</p>
                  </div>
                </div>
                <div className="mt-2 md:mt-3 flex gap-2 md:gap-4 text-xs text-ci-muted overflow-x-auto no-scrollbar">
                  <span className="whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString()}</span>
                  {c.locationName && <span className="whitespace-nowrap truncate max-w-[150px] md:max-w-none">{c.locationName}</span>}
                  {c.tags?.length > 0 && <span className="whitespace-nowrap truncate max-w-[120px] md:max-w-none">{c.tags.slice(0, 3).join(', ')}{c.tags.length > 3 ? ` +${c.tags.length - 3}` : ''}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-1.5 md:gap-2 mt-6 md:mt-8 overflow-x-auto no-scrollbar py-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchCases(p)}
                className={`min-w-[36px] px-3 py-1.5 rounded text-sm ${p === pagination.page ? 'bg-ci-accent text-white' : 'bg-ci-card border border-ci-border hover:bg-ci-border active:bg-gray-600'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </main>
    </NavShell>
  );
}
