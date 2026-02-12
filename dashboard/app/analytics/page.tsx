'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { NavShell } from '@/components/NavShell';
import { DEMO_ANALYTICS, DEMO_CASES } from '@/lib/mock-data';

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    if (!token) { router.push('/login'); return; }
    setLoading(false);
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen min-h-[100dvh]"><div className="animate-pulse text-ci-accent">Loading...</div></div>;

  const a = DEMO_ANALYTICS;
  const maxMonth = Math.max(...a.casesPerMonth.map((m: any) => m.count));
  const maxEvType = Math.max(...a.evidencePerType.map((e: any) => e.count));
  const totalEv = a.evidencePerType.reduce((s: number, e: any) => s + e.count, 0);
  const totalCases = a.casesByStatus.reduce((s: number, e: any) => s + e.count, 0);

  const priorityColor: Record<string, string> = { CRITICAL: 'bg-red-500', HIGH: 'bg-orange-500', MEDIUM: 'bg-yellow-500', LOW: 'bg-blue-500' };
  const statusColor: Record<string, string> = { ACTIVE: 'bg-green-500', OPEN: 'bg-yellow-500', CLOSED: 'bg-gray-500', PENDING_REVIEW: 'bg-purple-500' };
  const evTypeIcon: Record<string, string> = { IMAGE: '🖼️', VIDEO: '🎥', DOCUMENT: '📄', AUDIO: '🎵', PLATE: '🚗' };

  // Location distribution
  const locations: Record<string, number> = {};
  DEMO_CASES.forEach(c => { if (c.locationName) { const city = c.locationName.split(',')[0]; locations[city] = (locations[city] || 0) + 1; } });
  const topLocations = Object.entries(locations).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxLoc = Math.max(...topLocations.map(l => l[1]));

  return (
    <NavShell current="/analytics">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <h1 className="text-xl md:text-3xl font-bold mb-1">Analytics Dashboard</h1>
        <p className="text-ci-muted text-xs md:text-sm mb-6">Panoramica statistiche e trend operativi</p>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Casi Totali', value: totalCases, color: 'text-ci-accent' },
            { label: 'Prove Totali', value: totalEv, color: 'text-purple-400' },
            { label: 'AI Completate', value: a.aiProcessing.completed, color: 'text-green-400' },
            { label: 'Tasso AI', value: `${Math.round(a.aiProcessing.completed / totalEv * 100)}%`, color: 'text-cyan-400' },
          ].map(k => (
            <div key={k.label} className="bg-ci-card border border-ci-border rounded-lg p-4">
              <p className="text-xs text-ci-muted">{k.label}</p>
              <p className={`text-2xl md:text-3xl font-bold mt-1 ${k.color}`}>{k.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Cases per month */}
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-4">Casi per Mese (ultimi 6 mesi)</h2>
            <div className="flex items-end gap-3 md:gap-6 h-40 md:h-48">
              {a.casesPerMonth.map((m: any) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-ci-accent font-bold">{m.count}</span>
                  <div className="w-full rounded-t relative" style={{ height: `${(m.count / maxMonth) * 100}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-ci-accent to-ci-accent/40 rounded-t" />
                  </div>
                  <span className="text-xs text-ci-muted">{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence per type */}
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-4">Prove per Tipo</h2>
            <div className="space-y-3">
              {a.evidencePerType.map((e: any) => (
                <div key={e.type}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <span>{evTypeIcon[e.type] || '📎'}</span>
                      <span>{e.type}</span>
                    </div>
                    <span className="font-bold">{e.count} <span className="text-ci-muted font-normal text-xs">({Math.round(e.count / totalEv * 100)}%)</span></span>
                  </div>
                  <div className="h-3 bg-ci-bg rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" style={{ width: `${(e.count / maxEvType) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          {/* Cases by Status */}
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-4">Distribuzione Status</h2>
            <div className="space-y-3">
              {a.casesByStatus.map((s: any) => (
                <div key={s.status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{s.status}</span>
                    <span className="font-bold">{s.count}</span>
                  </div>
                  <div className="h-2.5 bg-ci-bg rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${statusColor[s.status] || 'bg-gray-500'}`} style={{ width: `${(s.count / totalCases) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cases by Priority */}
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-4">Distribuzione Priorità</h2>
            <div className="space-y-3">
              {a.casesByPriority.map((p: any) => (
                <div key={p.priority}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${priorityColor[p.priority]}`} />
                      <span>{p.priority}</span>
                    </div>
                    <span className="font-bold">{p.count}</span>
                  </div>
                  <div className="h-2.5 bg-ci-bg rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${priorityColor[p.priority]}`} style={{ width: `${(p.count / totalCases) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Processing Pipeline */}
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-4">Pipeline AI</h2>
            <div className="space-y-4">
              {[
                { label: 'Completate', v: a.aiProcessing.completed, color: 'bg-green-500', emoji: '✅' },
                { label: 'In Elaborazione', v: a.aiProcessing.processing, color: 'bg-yellow-500', emoji: '⏳' },
                { label: 'In Coda', v: a.aiProcessing.pending, color: 'bg-blue-500', emoji: '📋' },
                { label: 'Errori', v: a.aiProcessing.failed, color: 'bg-red-500', emoji: '❌' },
              ].map(ai => (
                <div key={ai.label} className="flex items-center gap-3">
                  <span className="text-lg">{ai.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-ci-muted">{ai.label}</span>
                      <span className="font-bold">{ai.v}</span>
                    </div>
                    <div className="h-2 bg-ci-bg rounded-full overflow-hidden">
                      <div className={`h-full ${ai.color} rounded-full`} style={{ width: `${(ai.v / totalEv) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6 mb-6">
          <h2 className="text-sm md:text-base font-semibold mb-4">Distribuzione Geografica Casi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {topLocations.map(([city, count]) => (
              <div key={city} className="bg-ci-bg border border-ci-border rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{city}</span>
                  <span className="text-xs text-ci-accent font-bold">{count}</span>
                </div>
                <div className="h-1.5 bg-ci-card rounded-full overflow-hidden">
                  <div className="h-full bg-ci-accent rounded-full" style={{ width: `${(count / maxLoc) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags cloud */}
        <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
          <h2 className="text-sm md:text-base font-semibold mb-4">Tag Frequenti</h2>
          <div className="flex flex-wrap gap-2">
            {(() => {
              const tags: Record<string, number> = {};
              DEMO_CASES.forEach(c => c.tags.forEach(t => { tags[t] = (tags[t] || 0) + 1; }));
              return Object.entries(tags).sort((a, b) => b[1] - a[1]).map(([tag, count]) => (
                <span key={tag} className="px-3 py-1.5 bg-ci-bg border border-ci-border rounded-full text-xs hover:border-ci-accent/50 transition cursor-default">
                  {tag} <span className="text-ci-accent font-bold ml-1">{count}</span>
                </span>
              ));
            })()}
          </div>
        </div>
      </main>
    </NavShell>
  );
}
