'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { DEMO_CASES, DEMO_ANALYTICS } from '@/lib/mock-data';
import { NavShell } from '@/components/NavShell';

export default function HomePage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    if (!token) { router.push('/login'); return; }
    Promise.all([
      api.getCaseStats().then(r => setStats(r.data)),
      api.getCases({ limit: '50' }).then(r => setCases(r.data.items || [])),
    ]).catch(() => router.push('/login')).finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen min-h-[100dvh]"><div className="animate-pulse text-ci-accent text-xl">Loading CrimeIntel...</div></div>;
  }

  const analytics = DEMO_ANALYTICS;
  const criticalCases = cases.filter(c => c.priority === 'CRITICAL' && c.status !== 'CLOSED').slice(0, 5);
  const recentCases = [...cases].sort((a, b) => new Date(b.updatedAt as string).getTime() - new Date(a.updatedAt as string).getTime()).slice(0, 5);

  const statCards = [
    { label: 'Casi Totali', value: stats?.total || 0, color: 'text-ci-accent', icon: '📁' },
    { label: 'Aperti', value: stats?.open || 0, color: 'text-ci-warning', icon: '🔓' },
    { label: 'Attivi', value: stats?.active || 0, color: 'text-ci-success', icon: '⚡' },
    { label: 'Prove', value: stats?.evidence || 0, color: 'text-purple-400', icon: '🔍' },
    { label: 'AI Analizzate', value: stats?.aiAnalyzed || 0, color: 'text-cyan-400', icon: '🤖' },
  ];

  const priorityColor: Record<string, string> = { CRITICAL: 'bg-red-500', HIGH: 'bg-orange-500', MEDIUM: 'bg-yellow-500', LOW: 'bg-blue-500' };
  const statusColor: Record<string, string> = { ACTIVE: 'text-ci-success', OPEN: 'text-ci-warning', PENDING_REVIEW: 'text-purple-400', CLOSED: 'text-ci-muted' };
  const activityIcon: Record<string, string> = { fusion: '🧠', evidence: '📎', case: '📂', report: '📄', ai: '🤖', verify: '✅', user: '👤' };

  const maxBar = Math.max(...analytics.casesPerMonth.map(m => m.count));

  return (
    <NavShell current="/">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <div className="flex items-center justify-between mb-5 md:mb-8">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Command Center</h1>
            <p className="text-ci-muted text-xs md:text-sm mt-1">CrimeIntel 7.0 Omega — Forensic Intelligence Platform</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => router.push('/cases')} className="px-4 py-2 bg-ci-accent hover:bg-ci-accent-hover text-white rounded text-sm transition">+ Nuovo Caso</button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-6 md:mb-8 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
          {statCards.map((s) => (
            <div key={s.label} className="flex-shrink-0 w-36 md:w-auto bg-ci-card border border-ci-border rounded-lg p-4 md:p-5 ci-glow">
              <div className="flex items-center justify-between">
                <p className="text-ci-muted text-xs md:text-sm whitespace-nowrap">{s.label}</p>
                <span className="text-lg">{s.icon}</span>
              </div>
              <p className={`text-2xl md:text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          {/* Cases per month chart */}
          <div className="lg:col-span-2 bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-4">Casi per Mese</h2>
            <div className="flex items-end gap-2 md:gap-4 h-32 md:h-40">
              {analytics.casesPerMonth.map(m => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-ci-accent font-medium">{m.count}</span>
                  <div className="w-full bg-ci-accent/20 rounded-t relative" style={{ height: `${(m.count / maxBar) * 100}%` }}>
                    <div className="absolute inset-0 bg-ci-accent/60 rounded-t" />
                  </div>
                  <span className="text-[10px] md:text-xs text-ci-muted">{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Processing */}
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-4">AI Engine Status</h2>
            <div className="space-y-3">
              {[
                { label: 'Completate', v: analytics.aiProcessing.completed, color: 'bg-green-500', total: 156 },
                { label: 'In Corso', v: analytics.aiProcessing.processing, color: 'bg-yellow-500', total: 156 },
                { label: 'In Attesa', v: analytics.aiProcessing.pending, color: 'bg-blue-500', total: 156 },
                { label: 'Fallite', v: analytics.aiProcessing.failed, color: 'bg-red-500', total: 156 },
              ].map(a => (
                <div key={a.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ci-muted">{a.label}</span>
                    <span>{a.v}</span>
                  </div>
                  <div className="h-2 bg-ci-bg rounded-full overflow-hidden">
                    <div className={`h-full ${a.color} rounded-full transition-all`} style={{ width: `${(a.v / a.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Critical Cases */}
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-sm md:text-base font-semibold">Casi Critici</h2>
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">{criticalCases.length}</span>
            </div>
            <div className="space-y-2">
              {criticalCases.map(c => (
                <button key={c.id} onClick={() => router.push(`/cases/${c.id}`)}
                  className="w-full text-left p-3 bg-ci-bg rounded border border-ci-border hover:border-red-500/50 active:bg-ci-border/30 transition">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColor[c.priority]}`} />
                    <span className="text-xs font-mono text-ci-muted">{c.caseNumber}</span>
                    <span className={`text-xs ${statusColor[c.status]}`}>{c.status}</span>
                  </div>
                  <p className="text-sm font-medium mt-1 truncate">{c.title}</p>
                </button>
              ))}
              {criticalCases.length === 0 && <p className="text-ci-muted text-sm">Nessun caso critico attivo</p>}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-3 md:mb-4">Attività Recenti</h2>
            <div className="space-y-2.5">
              {analytics.recentActivity.map((a, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-base flex-shrink-0 mt-0.5">{activityIcon[a.type] || '📌'}</span>
                  <div className="min-w-0">
                    <p className="text-sm leading-tight">{a.event}</p>
                    <p className="text-xs text-ci-muted mt-0.5">{new Date(a.time).toLocaleDateString('it-IT')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          {/* Cases by Priority */}
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-4">Per Priorità</h2>
            <div className="space-y-3">
              {analytics.casesByPriority.map(p => (
                <div key={p.priority} className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 ${priorityColor[p.priority]}`} />
                  <span className="text-sm flex-1">{p.priority}</span>
                  <span className="text-sm font-bold">{p.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cases by Status */}
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-4">Per Status</h2>
            <div className="space-y-3">
              {analytics.casesByStatus.map(s => (
                <div key={s.status} className="flex items-center gap-3">
                  <span className={`text-sm flex-1 ${statusColor[s.status] || ''}`}>{s.status}</span>
                  <span className="text-sm font-bold">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence by Type */}
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-4">Prove per Tipo</h2>
            <div className="space-y-3">
              {analytics.evidencePerType.map(e => {
                const icons: Record<string, string> = { IMAGE: '🖼️', VIDEO: '🎥', DOCUMENT: '📄', AUDIO: '🎵', PLATE: '🚗' };
                return (
                  <div key={e.type} className="flex items-center gap-3">
                    <span className="text-base">{icons[e.type] || '📎'}</span>
                    <span className="text-sm flex-1">{e.type}</span>
                    <span className="text-sm font-bold">{e.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Cases */}
        <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-sm md:text-base font-semibold">Ultimi Casi Aggiornati</h2>
            <button onClick={() => router.push('/cases')} className="text-xs text-ci-accent hover:underline">Vedi Tutti →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ci-muted border-b border-ci-border">
                  <th className="pb-2 pr-4">Caso</th>
                  <th className="pb-2 pr-4">Titolo</th>
                  <th className="pb-2 pr-4 hidden sm:table-cell">Status</th>
                  <th className="pb-2 pr-4 hidden md:table-cell">Priorità</th>
                  <th className="pb-2 hidden md:table-cell">Prove</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map(c => (
                  <tr key={c.id} onClick={() => router.push(`/cases/${c.id}`)} className="border-b border-ci-border/50 hover:bg-ci-bg/50 cursor-pointer transition">
                    <td className="py-2.5 pr-4 font-mono text-xs text-ci-muted">{c.caseNumber}</td>
                    <td className="py-2.5 pr-4 font-medium truncate max-w-[200px]">{c.title}</td>
                    <td className={`py-2.5 pr-4 hidden sm:table-cell text-xs ${statusColor[c.status] || ''}`}>{c.status}</td>
                    <td className="py-2.5 pr-4 hidden md:table-cell">
                      <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${priorityColor[c.priority]}`} /><span className="text-xs">{c.priority}</span>
                    </td>
                    <td className="py-2.5 hidden md:table-cell text-xs text-ci-muted">{c._count?.evidence || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { href: '/cases', label: 'Gestione Casi', desc: '25 casi attivi', icon: '📁' },
            { href: '/search', label: 'NeuroSearch', desc: 'Ricerca AI', icon: '🔍' },
            { href: '/analytics', label: 'Analytics', desc: 'Grafici e trend', icon: '📊' },
            { href: '/audit', label: 'Audit Log', desc: 'Tracciamento', icon: '📋' },
          ].map(q => (
            <button key={q.href} onClick={() => router.push(q.href)}
              className="bg-ci-card border border-ci-border rounded-lg p-4 text-left hover:border-ci-accent/50 active:bg-ci-border/30 transition">
              <span className="text-2xl">{q.icon}</span>
              <p className="text-sm font-medium mt-2">{q.label}</p>
              <p className="text-xs text-ci-muted mt-0.5">{q.desc}</p>
            </button>
          ))}
        </div>

        {/* System Status Footer */}
        <div className="mt-6 bg-ci-card border border-ci-border rounded-lg p-4 md:p-5">
          <div className="flex flex-wrap gap-4 md:gap-8 text-xs md:text-sm">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /><span className="text-ci-muted">API</span><span className="text-ci-success">Online</span></div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /><span className="text-ci-muted">Database</span><span className="text-ci-success">Connesso</span></div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500" /><span className="text-ci-muted">AI Engine</span><span className="text-ci-warning">Demo Mode</span></div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500" /><span className="text-ci-muted">HyperFusion</span><span className="text-cyan-400">v3.0</span></div>
            <div className="flex items-center gap-2"><span className="text-ci-muted">Versione</span><span>7.0.0 Omega</span></div>
          </div>
        </div>
      </main>
    </NavShell>
  );
}
