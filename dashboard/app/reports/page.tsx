'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { NavShell } from '@/components/NavShell';
import { DEMO_REPORTS } from '@/lib/mock-data';

export default function ReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = api.getToken();
    if (!token) { router.push('/login'); return; }
    setLoading(false);
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-pulse text-ci-accent">Loading...</div></div>;

  const types = [...new Set(DEMO_REPORTS.map(r => r.type))];
  let reports = [...DEMO_REPORTS];
  if (typeFilter) reports = reports.filter(r => r.type === typeFilter);
  if (search) {
    const q = search.toLowerCase();
    reports = reports.filter(r => r.title.toLowerCase().includes(q) || r.caseNumber.toLowerCase().includes(q) || r.createdBy.toLowerCase().includes(q));
  }

  const completed = DEMO_REPORTS.filter(r => r.status === 'COMPLETED').length;
  const totalPages = DEMO_REPORTS.reduce((s, r) => s + r.pages, 0);
  const totalSize = DEMO_REPORTS.reduce((s, r) => s + r.fileSize, 0);

  const typeIcon: Record<string, string> = {
    SUMMARY: '📄', FORENSIC: '🔬', AI_ANALYSIS: '🤖', TIMELINE: '📅', FUSION: '🧠', FORENSIC_EXPORT: '📦',
  };
  const typeColor: Record<string, string> = {
    SUMMARY: 'bg-blue-500/20 text-blue-400', FORENSIC: 'bg-purple-500/20 text-purple-400',
    AI_ANALYSIS: 'bg-cyan-500/20 text-cyan-400', TIMELINE: 'bg-yellow-500/20 text-yellow-400',
    FUSION: 'bg-pink-500/20 text-pink-400', FORENSIC_EXPORT: 'bg-green-500/20 text-green-400',
  };

  const fmtSize = (b: number) => b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`;

  return (
    <NavShell current="/reports">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <h1 className="text-xl md:text-3xl font-bold mb-1">Report Center</h1>
        <p className="text-ci-muted text-xs md:text-sm mb-5">Report generati, export forensi e analisi AI</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Report Totali', value: DEMO_REPORTS.length, color: 'text-ci-accent' },
            { label: 'Completati', value: completed, color: 'text-green-400' },
            { label: 'Pagine Totali', value: totalPages, color: 'text-purple-400' },
            { label: 'Dimensione', value: fmtSize(totalSize), color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="bg-ci-card border border-ci-border rounded-lg p-3 md:p-4">
              <p className="text-[10px] md:text-xs text-ci-muted">{s.label}</p>
              <p className={`text-xl md:text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca report per titolo, caso, autore..."
            className="flex-1 px-3 py-2.5 bg-ci-card border border-ci-border rounded focus:border-ci-accent focus:outline-none text-ci-text text-sm" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 bg-ci-card border border-ci-border rounded focus:border-ci-accent focus:outline-none text-ci-text text-sm">
            <option value="">Tutti i tipi</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Reports list */}
        <div className="space-y-2">
          {reports.map(r => (
            <div key={r.id} className="bg-ci-card border border-ci-border rounded-lg p-4 hover:border-ci-accent/40 transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-xl flex-shrink-0 mt-0.5">{typeIcon[r.type] || '📄'}</span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm md:text-base">{r.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${typeColor[r.type] || 'bg-ci-border text-ci-text'}`}>{r.type}</span>
                      <button onClick={() => router.push(`/cases/${r.caseId}`)} className="text-[10px] text-ci-accent hover:underline">{r.caseNumber}</button>
                      <span className="text-[10px] text-ci-muted">di {r.createdBy}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-xs font-medium ${r.status === 'COMPLETED' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {r.status === 'COMPLETED' ? '✅' : '⏳'} {r.status}
                  </span>
                  <p className="text-[10px] text-ci-muted mt-1">{new Date(r.createdAt).toLocaleDateString('it-IT')}</p>
                </div>
              </div>
              {r.status === 'COMPLETED' && (
                <div className="flex items-center gap-4 mt-3 text-xs text-ci-muted">
                  <span>{r.pages} pagine</span>
                  <span>{fmtSize(r.fileSize)}</span>
                  <button className="text-ci-accent hover:underline ml-auto">Scarica PDF</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {reports.length === 0 && (
          <div className="text-center text-ci-muted py-8 text-sm">Nessun report trovato per i filtri selezionati</div>
        )}

        <p className="text-xs text-ci-muted mt-4 text-center">{reports.length} report mostrati su {DEMO_REPORTS.length} totali</p>
      </main>
    </NavShell>
  );
}
