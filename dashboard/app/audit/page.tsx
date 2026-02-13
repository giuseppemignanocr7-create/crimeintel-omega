'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { NavShell } from '@/components/NavShell';
import { DEMO_AUDIT_LOG } from '@/lib/mock-data';

export default function AuditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    const token = api.getToken();
    if (!token) { router.push('/login'); return; }
    setLoading(false);
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen min-h-[100dvh]"><div className="animate-pulse text-ci-accent">Loading...</div></div>;

  const actions = [...new Set(DEMO_AUDIT_LOG.map(l => l.action))];

  let logs = [...DEMO_AUDIT_LOG];
  if (filter) {
    const q = filter.toLowerCase();
    logs = logs.filter(l =>
      l.user.name.toLowerCase().includes(q) ||
      l.user.email.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.resource.toLowerCase().includes(q) ||
      (l.targetId && l.targetId.toLowerCase().includes(q))
    );
  }
  if (actionFilter) {
    logs = logs.filter(l => l.action === actionFilter);
  }

  const actionColor: Record<string, string> = {
    USER_LOGIN: 'bg-green-500/20 text-green-400',
    USER_REGISTERED: 'bg-cyan-500/20 text-cyan-400',
    LOGIN_FAILED: 'bg-red-500/20 text-red-400',
    CASE_CREATED: 'bg-blue-500/20 text-blue-400',
    CASE_UPDATED: 'bg-yellow-500/20 text-yellow-400',
    EVIDENCE_UPLOADED: 'bg-purple-500/20 text-purple-400',
    EVIDENCE_VERIFIED: 'bg-emerald-500/20 text-emerald-400',
    FUSION_COMPLETED: 'bg-pink-500/20 text-pink-400',
    REPORT_GENERATED: 'bg-orange-500/20 text-orange-400',
  };

  const actionIcon: Record<string, string> = {
    USER_LOGIN: '🔑', USER_REGISTERED: '👤', LOGIN_FAILED: '🚫',
    CASE_CREATED: '📂', CASE_UPDATED: '✏️', EVIDENCE_UPLOADED: '📎',
    EVIDENCE_VERIFIED: '✅', FUSION_COMPLETED: '🧠', REPORT_GENERATED: '📄',
  };

  return (
    <NavShell current="/audit">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <h1 className="text-xl md:text-3xl font-bold mb-1">Audit Log</h1>
        <p className="text-ci-muted text-xs md:text-sm mb-5">Tracciamento completo di tutte le operazioni sulla piattaforma</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Totale Eventi', value: DEMO_AUDIT_LOG.length, color: 'text-ci-accent' },
            { label: 'Oggi', value: DEMO_AUDIT_LOG.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length, color: 'text-ci-success' },
            { label: 'Login Falliti', value: DEMO_AUDIT_LOG.filter(l => l.action === 'LOGIN_FAILED').length, color: 'text-red-400' },
            { label: 'Utenti Attivi', value: new Set(DEMO_AUDIT_LOG.map(l => l.userId)).size, color: 'text-purple-400' },
          ].map(s => (
            <div key={s.label} className="bg-ci-card border border-ci-border rounded-lg p-3 md:p-4">
              <p className="text-xs text-ci-muted">{s.label}</p>
              <p className={`text-xl md:text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Cerca utente, azione, risorsa..."
            className="flex-1 px-3 py-2.5 bg-ci-card border border-ci-border rounded focus:border-ci-accent focus:outline-none text-ci-text text-sm"
          />
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="px-3 py-2.5 bg-ci-card border border-ci-border rounded focus:border-ci-accent focus:outline-none text-ci-text text-sm"
          >
            <option value="">Tutte le azioni</option>
            {actions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* Log entries — Desktop table */}
        <div className="hidden md:block bg-ci-card border border-ci-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ci-muted bg-ci-bg">
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Utente</th>
                  <th className="px-4 py-3">Azione</th>
                  <th className="px-4 py-3">Risorsa</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Dettagli</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(l => (
                  <tr key={l.id} className="border-t border-ci-border/50 hover:bg-ci-bg/50 transition">
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-ci-muted">
                      {new Date(l.createdAt).toLocaleDateString('it-IT')}<br />
                      <span className="text-[10px]">{new Date(l.createdAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">{l.user.name}</p>
                      <p className="text-xs text-ci-muted">{l.user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${actionColor[l.action] || 'bg-ci-border text-ci-text'}`}>
                        <span>{actionIcon[l.action] || '📌'}</span>
                        {l.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-ci-muted font-mono">{l.resource}{l.targetId ? ` / ${l.targetId.substring(0, 8)}` : ''}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-ci-muted max-w-[200px] truncate">
                      {l.details ? JSON.stringify(l.details).substring(0, 60) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {logs.length === 0 && (
            <div className="text-center py-8 text-ci-muted text-sm">Nessun risultato per i filtri selezionati</div>
          )}
        </div>

        {/* Log entries — Mobile cards */}
        <div className="md:hidden space-y-2">
          {logs.map(l => (
            <div key={l.id} className="bg-ci-card border border-ci-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${actionColor[l.action] || 'bg-ci-border text-ci-text'}`}>
                  <span>{actionIcon[l.action] || '📌'}</span>
                  {l.action}
                </span>
                <span className="text-[10px] text-ci-muted">{new Date(l.createdAt).toLocaleDateString('it-IT')} {new Date(l.createdAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-ci-accent/20 flex items-center justify-center text-ci-accent font-bold text-[10px] flex-shrink-0">{l.user.name.charAt(0)}</div>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{l.user.name}</p>
                  <p className="text-[10px] text-ci-muted truncate">{l.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-ci-muted">
                <span className="font-mono">{l.resource}{l.targetId ? ` / ${l.targetId.substring(0, 8)}` : ''}</span>
                {l.details && <span className="truncate max-w-[150px]">{JSON.stringify(l.details).substring(0, 40)}</span>}
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-center py-8 text-ci-muted text-sm">Nessun risultato per i filtri selezionati</div>
          )}
        </div>

        <p className="text-xs text-ci-muted mt-4 text-center">{logs.length} eventi trovati su {DEMO_AUDIT_LOG.length} totali</p>
      </main>
    </NavShell>
  );
}
