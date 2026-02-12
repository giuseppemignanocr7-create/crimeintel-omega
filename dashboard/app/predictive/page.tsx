'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { NavShell } from '@/components/NavShell';
import { DEMO_PREDICTIVE } from '@/lib/mock-data';

export default function PredictivePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    if (!token) { router.push('/login'); return; }
    setLoading(false);
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-pulse text-ci-accent">Loading...</div></div>;

  const { hotZones, riskScoring, patterns, predictions } = DEMO_PREDICTIVE;
  const sevColor: Record<string, string> = { CRITICAL: 'bg-red-500/20 text-red-400', HIGH: 'bg-orange-500/20 text-orange-400', MEDIUM: 'bg-yellow-500/20 text-yellow-400', LOW: 'bg-blue-500/20 text-blue-400' };
  const trendIcon: Record<string, string> = { rising: '📈', stable: '➡️', declining: '📉' };
  const riskColor = (r: number) => r >= 0.9 ? 'text-red-400' : r >= 0.7 ? 'text-orange-400' : r >= 0.5 ? 'text-yellow-400' : 'text-green-400';
  const riskBg = (r: number) => r >= 0.9 ? 'bg-red-500' : r >= 0.7 ? 'bg-orange-500' : r >= 0.5 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <NavShell current="/predictive">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <h1 className="text-xl md:text-3xl font-bold mb-1">Predictive Intelligence</h1>
        <p className="text-ci-muted text-xs md:text-sm mb-5">Risk scoring, hot zones, pattern recognition e previsioni operative</p>

        {/* Predictions Alert Banner */}
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <h2 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">⚡ Previsioni Attive</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {predictions.map((p, i) => (
              <div key={i} className="bg-ci-card/50 border border-ci-border rounded-lg p-3 flex items-start gap-3">
                <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold ${sevColor[p.severity]}`}>{p.severity}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{p.event}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-ci-muted">
                    <span>⏱ {p.timeframe}</span>
                    <span>Prob: <span className={`font-bold ${riskColor(p.probability)}`}>{(p.probability * 100).toFixed(0)}%</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Hot Zones */}
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-4 flex items-center gap-2">🗺️ Hot Zones</h2>
            <div className="space-y-3">
              {hotZones.map(hz => (
                <div key={hz.id} className="bg-ci-bg border border-ci-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📍</span>
                      <span className="font-medium text-sm">{hz.area}</span>
                    </div>
                    <span className={`text-sm font-bold ${riskColor(hz.riskLevel)}`}>{(hz.riskLevel * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-ci-card rounded-full overflow-hidden mb-2">
                    <div className={`h-full ${riskBg(hz.riskLevel)} rounded-full`} style={{ width: `${hz.riskLevel * 100}%` }} />
                  </div>
                  <p className="text-xs text-ci-muted">{hz.prediction}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-ci-muted">
                    <span>Casi attivi: {hz.activeCases}</span>
                    <span>Lat: {hz.lat.toFixed(2)} Lng: {hz.lng.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Scoring */}
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-4 flex items-center gap-2">⚠️ Risk Scoring Entità</h2>
            <div className="space-y-3">
              {riskScoring.map(rs => (
                <div key={rs.entityId} className="bg-ci-bg border border-ci-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${riskColor(rs.score)}`}>{(rs.score * 100).toFixed(0)}</span>
                      <div>
                        <p className="font-medium text-sm">{rs.name}</p>
                        <p className="text-[10px] text-ci-muted flex items-center gap-1">{trendIcon[rs.trend]} Trend: {rs.trend}</p>
                      </div>
                    </div>
                    <button onClick={() => router.push('/crimegraph')} className="text-[10px] text-ci-accent hover:underline">Vedi Grafo →</button>
                  </div>
                  <div className="h-1.5 bg-ci-card rounded-full overflow-hidden mb-2">
                    <div className={`h-full ${riskBg(rs.score)} rounded-full`} style={{ width: `${rs.score * 100}%` }} />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {rs.factors.map((f, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-ci-card border border-ci-border rounded-full text-ci-muted">{f}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patterns */}
        <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
          <h2 className="text-sm md:text-base font-semibold mb-4 flex items-center gap-2">🔄 Pattern Riconosciuti</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {patterns.map(p => (
              <div key={p.id} className="bg-ci-bg border border-ci-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{p.name}</h3>
                  <span className={`text-xs font-bold ${riskColor(p.confidence)}`}>{(p.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="text-xs text-ci-muted mb-3">{p.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-ci-muted">Casi correlati:</span>
                  <div className="flex gap-1">
                    {p.relatedCases.map(c => (
                      <button key={c} onClick={() => router.push(`/cases/${c}`)}
                        className="text-[10px] px-2 py-0.5 bg-ci-accent/20 text-ci-accent rounded hover:bg-ci-accent/30 transition">{c}</button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </NavShell>
  );
}
