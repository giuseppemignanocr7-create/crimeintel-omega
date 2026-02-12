'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { NavShell } from '@/components/NavShell';
import { DEMO_AI_ENGINE } from '@/lib/mock-data';

export default function AIEnginePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const token = api.getToken();
    if (!token) { router.push('/login'); return; }
    setLoading(false);
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-pulse text-ci-accent">Loading...</div></div>;

  const { modules, globalStats } = DEMO_AI_ENGINE;
  const totalProcessed = modules.reduce((s, m) => s + m.totalProcessed, 0);
  const todayTotal = modules.reduce((s, m) => s + m.todayProcessed, 0);
  const selectedModule = selected ? modules.find(m => m.id === selected) : null;

  const moduleIcon: Record<string, string> = {
    yolov8: '👁️', facerec: '👤', lpr: '🚗', thermal: '🌡️', satellite: '🛰️', audio: '🎤', video: '🎬',
  };

  return (
    <NavShell current="/ai-engine">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <h1 className="text-xl md:text-3xl font-bold mb-1">AI Engine Dashboard</h1>
        <p className="text-ci-muted text-xs md:text-sm mb-5">7 moduli AI attivi — Monitoraggio in tempo reale</p>

        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Inferenze Totali', value: totalProcessed.toLocaleString(), color: 'text-ci-accent' },
            { label: 'Oggi', value: todayTotal.toLocaleString(), color: 'text-green-400' },
            { label: 'Latenza Media', value: `${globalStats.avgLatency}ms`, color: 'text-yellow-400' },
            { label: 'GPU Cluster', value: `${globalStats.gpuCluster.active}/${globalStats.gpuCluster.total}`, color: 'text-purple-400' },
            { label: 'Uptime', value: `${globalStats.uptime}%`, color: 'text-cyan-400' },
          ].map(s => (
            <div key={s.label} className="bg-ci-card border border-ci-border rounded-lg p-3 md:p-4">
              <p className="text-[10px] md:text-xs text-ci-muted">{s.label}</p>
              <p className={`text-lg md:text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
          {modules.map(m => (
            <button
              key={m.id}
              onClick={() => setSelected(selected === m.id ? null : m.id)}
              className={`text-left bg-ci-card border rounded-lg p-4 transition-all ${
                selected === m.id ? 'border-ci-accent shadow-lg shadow-ci-accent/10' : 'border-ci-border hover:border-ci-accent/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{moduleIcon[m.id]}</span>
                  <div>
                    <p className="text-sm font-semibold">{m.name}</p>
                    <p className="text-[10px] text-ci-muted">{m.engine} v{m.version}</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title={m.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-ci-bg rounded p-2">
                  <p className="text-ci-muted text-[10px]">Accuracy</p>
                  <p className="font-bold text-green-400">{(m.accuracy * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-ci-bg rounded p-2">
                  <p className="text-ci-muted text-[10px]">Inference</p>
                  <p className="font-bold text-yellow-400">{m.avgInference}ms</p>
                </div>
                <div className="bg-ci-bg rounded p-2">
                  <p className="text-ci-muted text-[10px]">FPS</p>
                  <p className="font-bold text-purple-400">{m.fps}</p>
                </div>
                <div className="bg-ci-bg rounded p-2">
                  <p className="text-ci-muted text-[10px]">GPU</p>
                  <p className="font-bold text-cyan-400">{m.gpuUsage}%</p>
                </div>
              </div>
              <div className="mt-3 flex justify-between text-[10px] text-ci-muted">
                <span>Totale: {m.totalProcessed.toLocaleString()}</span>
                <span>Oggi: {m.todayProcessed}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Module Detail */}
        {selectedModule && (
          <div className="bg-ci-card border border-ci-accent/30 rounded-lg p-4 md:p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{moduleIcon[selectedModule.id]}</span>
              <div>
                <h2 className="text-lg font-bold">{selectedModule.name}</h2>
                <p className="text-xs text-ci-muted">{selectedModule.engine} v{selectedModule.version}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Classes */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Classi / Funzionalità</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModule.classes.map(c => (
                    <span key={c} className="px-2 py-1 bg-ci-bg border border-ci-border rounded text-xs">{c}</span>
                  ))}
                </div>
              </div>

              {/* Performance bar */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Performance</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Accuracy', value: selectedModule.accuracy * 100, color: 'bg-green-500' },
                    { label: 'GPU Usage', value: selectedModule.gpuUsage, color: 'bg-purple-500' },
                    { label: 'Throughput', value: Math.min(selectedModule.fps / 10, 100), color: 'bg-cyan-500' },
                  ].map(p => (
                    <div key={p.label}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-ci-muted">{p.label}</span>
                        <span className="font-bold">{p.value.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-ci-bg rounded-full overflow-hidden">
                        <div className={`h-full ${p.color} rounded-full transition-all`} style={{ width: `${p.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent detections */}
            <h3 className="text-sm font-semibold mt-4 mb-2">Rilevamenti Recenti</h3>
            <div className="space-y-2">
              {selectedModule.recentDetections.map((d, i) => (
                <div key={i} className="flex items-center justify-between bg-ci-bg border border-ci-border rounded p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono bg-ci-accent/20 text-ci-accent px-2 py-1 rounded flex-shrink-0">{d.caseId}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{d.type}</p>
                      <p className="text-[10px] text-ci-muted">{d.image}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className={`text-xs font-bold ${d.confidence >= 0.9 ? 'text-green-400' : d.confidence >= 0.8 ? 'text-yellow-400' : 'text-orange-400'}`}>
                      {(d.confidence * 100).toFixed(1)}%
                    </span>
                    <p className="text-[10px] text-ci-muted">{new Date(d.time).toLocaleDateString('it-IT')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GPU Cluster */}
        <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
          <h2 className="text-sm md:text-base font-semibold mb-3">GPU Cluster Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: globalStats.gpuCluster.total }, (_, i) => (
              <div key={i} className="bg-ci-bg border border-ci-border rounded-lg p-3 text-center">
                <p className="text-xs text-ci-muted mb-1">GPU {i}</p>
                <p className="text-lg font-bold text-green-400">NVIDIA A100</p>
                <div className="h-2 bg-ci-card rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: `${55 + Math.random() * 35}%` }} />
                </div>
                <p className="text-[10px] text-ci-muted mt-1">80GB VRAM • Active</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-ci-muted mt-3 text-center">Uptime: {globalStats.uptime}% • Ultimo restart: {new Date(globalStats.lastRestart).toLocaleDateString('it-IT')}</p>
        </div>
      </main>
    </NavShell>
  );
}
