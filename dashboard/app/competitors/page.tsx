'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { NavShell } from '@/components/NavShell';

const COMPETITORS = [
  {
    id: 'crimeintel', name: 'CrimeIntel 7.0 Ω', origin: '🇮🇹 Italia', type: 'AI-Native',
    tagline: 'AI-Powered Forensic Investigation Platform',
    price: { label: '€425K - €1.58M/anno', value: 425000, tier: 'Competitivo' },
    deployment: ['On-Premise', 'Cloud', 'Hybrid', 'Offline Totale'],
    aiModules: 7, responseTime: 12, aiInference: 60, uptime: 99.97,
    scores: { ai: 98, speed: 96, price: 92, ux: 95, security: 97, deployment: 99, mobile: 100, integration: 90 },
    strengths: ['7 moduli AI nativi', 'HyperFusion multimodale', 'Offline totale su laptop', 'CrimeGraph Neo4j', 'Predictive Intelligence', 'Mobile React Native', 'GDPR + AI Act compliant', 'Deploy in 4h'],
    weaknesses: ['Brand awareness iniziale', 'Team ridotto (scalabile)'],
    verdict: 'LEADER',
  },
  {
    id: 'palantir', name: 'Palantir Gotham', origin: '🇺🇸 USA', type: 'Enterprise',
    tagline: 'Government Intelligence Platform',
    price: { label: '€2M - €10M+/anno', value: 2000000, tier: 'Premium' },
    deployment: ['Cloud', 'On-Premise (parziale)'],
    aiModules: 3, responseTime: 200, aiInference: 500, uptime: 99.9,
    scores: { ai: 75, speed: 60, price: 20, ux: 55, security: 90, deployment: 40, mobile: 30, integration: 85 },
    strengths: ['Brand riconosciuto', 'Scalabilità enterprise', 'Contratti governativi USA', 'Data integration massiva'],
    weaknesses: ['Costo proibitivo', 'Lock-in 3-5 anni', 'No AI vision nativa', 'No mobile app dedicata', 'Deploy 6-18 mesi', 'UX complessa', 'No offline mode', 'Dipendenza USA (CLOUD Act)'],
    verdict: 'OVERPRICED',
  },
  {
    id: 'cellebrite', name: 'Cellebrite UFED', origin: '🇮🇱 Israele', type: 'Device Forensics',
    tagline: 'Mobile Device Forensic Extraction',
    price: { label: '€150K - €800K/anno', value: 150000, tier: 'Medio' },
    deployment: ['On-Premise', 'Portable Device'],
    aiModules: 1, responseTime: 300, aiInference: 0, uptime: 99.5,
    scores: { ai: 35, speed: 45, price: 65, ux: 60, security: 80, deployment: 55, mobile: 20, integration: 40 },
    strengths: ['Leader estrazione mobile', 'Hardware dedicato', 'Ampio supporto device'],
    weaknesses: ['Solo forensica mobile', 'No AI vision/detection', 'No case management', 'No predictive intelligence', 'No graph analysis', 'No ricerca semantica', 'No fusion multimodale'],
    verdict: 'NICHE',
  },
  {
    id: 'ibmi2', name: 'IBM i2 Analyst', origin: '🇺🇸 USA', type: 'Link Analysis',
    tagline: 'Intelligence Analysis & Link Charts',
    price: { label: '€300K - €1.5M/anno', value: 300000, tier: 'Alto' },
    deployment: ['On-Premise', 'Cloud IBM'],
    aiModules: 1, responseTime: 180, aiInference: 0, uptime: 99.8,
    scores: { ai: 40, speed: 50, price: 45, ux: 50, security: 85, deployment: 45, mobile: 15, integration: 70 },
    strengths: ['Link analysis consolidata', 'Brand IBM', 'Integrazione con SPSS'],
    weaknesses: ['AI limitata a NLP base', 'No computer vision', 'UX datata (2010s)', 'No mobile', 'No real-time', 'No offline mode', 'Ecosistema IBM lock-in', 'No face/plate/thermal'],
    verdict: 'LEGACY',
  },
  {
    id: 'cognyte', name: 'Cognyte (Verint)', origin: '🇮🇱 Israele', type: 'SIGINT/OSINT',
    tagline: 'Security Intelligence Analytics',
    price: { label: '€500K - €3M/anno', value: 500000, tier: 'Alto' },
    deployment: ['Cloud', 'On-Premise'],
    aiModules: 2, responseTime: 250, aiInference: 200, uptime: 99.7,
    scores: { ai: 55, speed: 50, price: 35, ux: 45, security: 88, deployment: 50, mobile: 25, integration: 75 },
    strengths: ['SIGINT forte', 'OSINT web scraping', 'Intercettazioni'],
    weaknesses: ['No forensica visiva', 'No object detection', 'Costoso', 'UX complessa', 'No offline totale', 'No mobile app', 'No predictive nativo'],
    verdict: 'EXPENSIVE',
  },
  {
    id: 'axon', name: 'Axon Evidence', origin: '🇺🇸 USA', type: 'Body Cam / Evidence',
    tagline: 'Digital Evidence Management',
    price: { label: '€100K - €500K/anno', value: 100000, tier: 'Medio' },
    deployment: ['Cloud Only'],
    aiModules: 1, responseTime: 150, aiInference: 100, uptime: 99.9,
    scores: { ai: 30, speed: 65, price: 70, ux: 75, security: 82, deployment: 30, mobile: 60, integration: 50 },
    strengths: ['Leader body cam USA', 'Cloud scalabile', 'Buona UX'],
    weaknesses: ['Solo evidence storage', 'AI minima', 'No investigation tools', 'No graph/predictive', 'Cloud-only', 'Focus solo USA', 'No forensica avanzata'],
    verdict: 'LIMITED',
  },
];

const FEATURES = [
  { name: 'Object Detection (YOLOv8)', cat: 'AI Vision', ci: true, pa: false, ce: false, ib: false, co: false, ax: false },
  { name: 'Face Recognition (ONNX)', cat: 'AI Vision', ci: true, pa: false, ce: true, ib: false, co: false, ax: false },
  { name: 'License Plate Recognition', cat: 'AI Vision', ci: true, pa: false, ce: false, ib: false, co: false, ax: false },
  { name: 'Thermal Analysis', cat: 'AI Vision', ci: true, pa: false, ce: false, ib: false, co: false, ax: false },
  { name: 'Audio Forensics & Speaker ID', cat: 'AI Audio', ci: true, pa: false, ce: false, ib: false, co: true, ax: false },
  { name: 'Satellite/Drone Analysis', cat: 'AI Vision', ci: true, pa: true, ce: false, ib: false, co: false, ax: false },
  { name: 'Video Frame Extraction', cat: 'AI Video', ci: true, pa: false, ce: true, ib: false, co: false, ax: true },
  { name: 'HyperFusion (Multimodal AI)', cat: 'AI Core', ci: true, pa: false, ce: false, ib: false, co: false, ax: false },
  { name: 'NeuroSearch (Semantic Search)', cat: 'AI Core', ci: true, pa: true, ce: false, ib: false, co: false, ax: false },
  { name: 'CrimeGraph (Neo4j)', cat: 'Analysis', ci: true, pa: true, ce: false, ib: true, co: true, ax: false },
  { name: 'Predictive Intelligence', cat: 'AI Core', ci: true, pa: true, ce: false, ib: false, co: false, ax: false },
  { name: 'Case Management', cat: 'Core', ci: true, pa: true, ce: false, ib: true, co: true, ax: true },
  { name: 'Evidence Chain-of-Custody', cat: 'Security', ci: true, pa: false, ce: true, ib: false, co: false, ax: true },
  { name: 'Mobile App Nativa', cat: 'Platform', ci: true, pa: false, ce: false, ib: false, co: false, ax: true },
  { name: 'Offline Totale (Laptop)', cat: 'Platform', ci: true, pa: false, ce: true, ib: false, co: false, ax: false },
  { name: 'On-Premise Deploy', cat: 'Platform', ci: true, pa: true, ce: true, ib: true, co: true, ax: false },
  { name: 'GDPR Compliant', cat: 'Compliance', ci: true, pa: false, ce: true, ib: true, co: true, ax: false },
  { name: 'AI Act (EU) Compliant', cat: 'Compliance', ci: true, pa: false, ce: false, ib: false, co: false, ax: false },
  { name: 'Zero-Knowledge Proofs', cat: 'Security', ci: true, pa: false, ce: false, ib: false, co: false, ax: false },
  { name: 'CrimeMind AI Assistant', cat: 'AI Core', ci: true, pa: false, ce: false, ib: false, co: false, ax: false },
];

const BENCHMARKS = [
  { metric: 'API Response Time', unit: 'ms', vals: [12, 200, 300, 180, 250, 150], lower: true },
  { metric: 'AI Inference Total', unit: 'ms', vals: [60, 500, 0, 0, 200, 100], lower: true },
  { metric: 'Deploy Time', unit: 'ore', vals: [4, 4320, 48, 720, 480, 2], lower: true },
  { metric: 'Costo Anno 1 (min)', unit: 'K€', vals: [425, 2000, 150, 300, 500, 100], lower: true },
  { metric: 'Moduli AI Nativi', unit: '', vals: [7, 3, 1, 1, 2, 1], lower: false },
  { metric: 'Uptime', unit: '%', vals: [99.97, 99.9, 99.5, 99.8, 99.7, 99.9], lower: false },
];

const NAMES = ['CrimeIntel', 'Palantir', 'Cellebrite', 'IBM i2', 'Cognyte', 'Axon'];
const KEYS: ('ci' | 'pa' | 'ce' | 'ib' | 'co' | 'ax')[] = ['ci', 'pa', 'ce', 'ib', 'co', 'ax'];

export default function CompetitorsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'overview' | 'features' | 'benchmarks' | 'pricing'>('overview');

  useEffect(() => {
    const token = api.getToken();
    if (!token) { router.push('/login'); return; }
    setLoading(false);
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-pulse text-ci-accent">Loading...</div></div>;

  const ci = COMPETITORS[0];
  const others = COMPETITORS.slice(1);
  const ciFeatures = FEATURES.filter(f => f.ci).length;
  const categories = [...new Set(FEATURES.map(f => f.cat))];

  const verdictColor: Record<string, string> = {
    LEADER: 'bg-green-500/20 text-green-400', OVERPRICED: 'bg-red-500/20 text-red-400',
    NICHE: 'bg-yellow-500/20 text-yellow-400', LEGACY: 'bg-gray-500/20 text-gray-400',
    EXPENSIVE: 'bg-orange-500/20 text-orange-400', LIMITED: 'bg-blue-500/20 text-blue-400',
  };

  const scoreColor = (v: number) => v >= 90 ? 'text-green-400' : v >= 70 ? 'text-yellow-400' : v >= 50 ? 'text-orange-400' : 'text-red-400';
  const scoreBg = (v: number) => v >= 90 ? 'bg-green-500' : v >= 70 ? 'bg-yellow-500' : v >= 50 ? 'bg-orange-500' : 'bg-red-500';

  const featureCount = (idx: number) => FEATURES.filter(f => f[KEYS[idx]]).length;

  return (
    <NavShell current="/competitors">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl md:text-3xl font-bold">Competitive Intelligence</h1>
          <span className="text-[10px] md:text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold">CrimeIntel = #1</span>
        </div>
        <p className="text-ci-muted text-xs md:text-sm mb-5">Analisi comparativa vs 5 competitor globali</p>

        <div className="flex gap-1 mb-6 overflow-x-auto no-scrollbar">
          {([
            { id: 'overview' as const, label: '🏆 Overview' },
            { id: 'features' as const, label: '⚡ Features' },
            { id: 'benchmarks' as const, label: '📊 Benchmarks' },
            { id: 'pricing' as const, label: '💰 Pricing' },
          ]).map(t => (
            <button key={t.id} onClick={() => setView(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${view === t.id ? 'bg-ci-accent text-white' : 'bg-ci-card border border-ci-border text-ci-muted hover:text-ci-text'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {view === 'overview' && (
          <>
            <div className="bg-gradient-to-r from-ci-accent/10 to-purple-500/10 border border-ci-accent/30 rounded-xl p-5 md:p-8 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🔷</span>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-ci-accent">{ci.name}</h2>
                  <p className="text-xs text-ci-muted">{ci.tagline} • {ci.origin}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {Object.entries(ci.scores).map(([k, v]) => (
                  <div key={k} className="bg-ci-card/50 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-ci-muted uppercase">{k}</p>
                    <p className={`text-2xl font-black ${scoreColor(v)}`}>{v}</p>
                    <div className="h-1.5 bg-ci-bg rounded-full mt-1 overflow-hidden">
                      <div className={`h-full ${scoreBg(v)} rounded-full`} style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ci.strengths.map(s => (
                  <span key={s} className="text-[10px] px-2 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full">✅ {s}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {others.map((c, idx) => {
                const ts = Math.round(Object.values(c.scores).reduce((a, b) => a + b, 0) / 8);
                const ciTs = Math.round(Object.values(ci.scores).reduce((a, b) => a + b, 0) / 8);
                const fc = featureCount(idx + 1);
                return (
                  <div key={c.id} className="bg-ci-card border border-ci-border rounded-lg p-4 relative">
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${verdictColor[c.verdict]}`}>{c.verdict}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{c.origin.split(' ')[0]}</span>
                      <div>
                        <p className="font-bold text-sm">{c.name}</p>
                        <p className="text-[10px] text-ci-muted">{c.tagline}</p>
                      </div>
                    </div>
                    <div className="bg-ci-bg rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-ci-muted">Score Globale</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${scoreColor(ts)}`}>{ts}</span>
                          <span className="text-[10px] text-ci-muted">vs</span>
                          <span className="text-sm font-bold text-green-400">{ciTs}</span>
                        </div>
                      </div>
                      <div className="h-3 bg-ci-card rounded-full overflow-hidden relative">
                        <div className={`absolute h-full ${scoreBg(ts)} rounded-full opacity-40`} style={{ width: `${ts}%` }} />
                        <div className="absolute h-full bg-green-500 rounded-full" style={{ width: `${ciTs}%`, opacity: 0.8 }} />
                      </div>
                      <p className="text-[10px] text-green-400 font-bold mt-1 text-right">CrimeIntel +{ciTs - ts} punti</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                      <div className="bg-ci-bg rounded p-2">
                        <p className="text-[9px] text-ci-muted">AI</p>
                        <p className={`text-sm font-bold ${c.aiModules < ci.aiModules ? 'text-red-400' : ''}`}>{c.aiModules}</p>
                      </div>
                      <div className="bg-ci-bg rounded p-2">
                        <p className="text-[9px] text-ci-muted">Features</p>
                        <p className={`text-sm font-bold ${fc < ciFeatures ? 'text-red-400' : ''}`}>{fc}/{FEATURES.length}</p>
                      </div>
                      <div className="bg-ci-bg rounded p-2">
                        <p className="text-[9px] text-ci-muted">Prezzo</p>
                        <p className="text-[10px] font-bold text-orange-400">{c.price.label.split('-')[0]}</p>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      {c.weaknesses.slice(0, 4).map(w => (
                        <p key={w} className="text-[10px] text-red-400/80">❌ {w}</p>
                      ))}
                      {c.weaknesses.length > 4 && <p className="text-[10px] text-red-400/60">...e {c.weaknesses.length - 4} altre</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {view === 'features' && (
          <div className="bg-ci-card border border-ci-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ci-bg text-xs text-ci-muted">
                    <th className="px-4 py-3 text-left min-w-[200px]">Feature</th>
                    {NAMES.map((n, i) => (
                      <th key={n} className={`px-3 py-3 text-center min-w-[80px] ${i === 0 ? 'text-ci-accent font-bold' : ''}`}>{n}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <React.Fragment key={cat}>
                      <tr className="bg-ci-bg/50"><td colSpan={7} className="px-4 py-2 text-xs font-bold text-ci-muted uppercase tracking-wider">{cat}</td></tr>
                      {FEATURES.filter(f => f.cat === cat).map(f => (
                        <tr key={f.name} className="border-t border-ci-border/30 hover:bg-ci-bg/30">
                          <td className="px-4 py-2.5 text-xs">{f.name}</td>
                          {KEYS.map((k, i) => (
                            <td key={k} className="px-3 py-2.5 text-center">
                              {f[k] ? <span className={i === 0 ? 'text-green-400' : 'text-green-400/60'}>✅</span> : <span className="text-red-400/40">✗</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                  <tr className="bg-ci-bg border-t-2 border-ci-border font-bold">
                    <td className="px-4 py-3 text-xs">TOTALE</td>
                    {KEYS.map((_, i) => {
                      const c = featureCount(i);
                      return <td key={i} className={`px-3 py-3 text-center ${i === 0 ? 'text-green-400 text-lg' : 'text-red-400'}`}>{c}/{FEATURES.length}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-green-500/5 border-t border-green-500/20">
              <p className="text-sm text-green-400 font-bold text-center">
                🏆 CrimeIntel {ciFeatures}/{FEATURES.length} features ({Math.round(ciFeatures / FEATURES.length * 100)}%) — Miglior competitor: {Math.max(...COMPETITORS.slice(1).map((_, i) => featureCount(i + 1)))}
              </p>
            </div>
          </div>
        )}

        {view === 'benchmarks' && (
          <div className="space-y-4">
            {BENCHMARKS.map(b => {
              const max = Math.max(...b.vals.filter(v => v > 0));
              return (
                <div key={b.metric} className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
                  <h3 className="text-sm font-semibold mb-4">{b.metric} {b.unit && <span className="text-ci-muted font-normal">({b.unit})</span>}</h3>
                  <div className="space-y-2.5">
                    {b.vals.map((v, i) => {
                      const best = b.lower ? (v > 0 && v === Math.min(...b.vals.filter(x => x > 0))) : v === max;
                      return (
                        <div key={NAMES[i]} className="flex items-center gap-3">
                          <span className={`text-xs w-24 flex-shrink-0 ${i === 0 ? 'font-bold text-ci-accent' : 'text-ci-muted'}`}>{NAMES[i]}</span>
                          <div className="flex-1 h-6 bg-ci-bg rounded-full overflow-hidden relative">
                            {v > 0 ? (
                              <div className={`h-full rounded-full flex items-center justify-end pr-2 ${i === 0 ? 'bg-gradient-to-r from-ci-accent to-green-500' : best ? 'bg-green-500/40' : 'bg-ci-border'}`}
                                style={{ width: `${Math.max((v / max) * 100, 8)}%` }}>
                                <span className={`text-[10px] font-bold ${i === 0 ? 'text-white' : 'text-ci-text'}`}>{v.toLocaleString()}{b.unit}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-ci-muted absolute left-2 top-1/2 -translate-y-1/2">N/A</span>
                            )}
                          </div>
                          {best && v > 0 && <span className="text-xs">🏆</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === 'pricing' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
              {COMPETITORS.map((c, idx) => {
                const isCI = idx === 0;
                return (
                  <div key={c.id} className={`rounded-xl p-5 border-2 ${isCI ? 'bg-gradient-to-b from-ci-accent/10 to-purple-500/5 border-ci-accent shadow-lg shadow-ci-accent/10' : 'bg-ci-card border-ci-border'}`}>
                    {isCI && <p className="text-[10px] text-ci-accent font-bold uppercase tracking-wider mb-2">⭐ BEST VALUE</p>}
                    <div className="flex items-center gap-2 mb-2">
                      <span>{c.origin.split(' ')[0]}</span>
                      <h3 className={`font-bold ${isCI ? 'text-ci-accent' : ''}`}>{c.name}</h3>
                    </div>
                    <p className={`text-xl font-black mb-1 ${isCI ? 'text-green-400' : ''}`}>{c.price.label}</p>
                    <p className={`text-xs mb-4 ${isCI ? 'text-green-400/80' : 'text-ci-muted'}`}>Tier: {c.price.tier}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs"><span className="text-ci-muted">AI Modules</span><span className="font-bold">{c.aiModules}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-ci-muted">Features</span><span className="font-bold">{featureCount(idx)}/{FEATURES.length}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-ci-muted">Deploy</span><span className="font-bold">{c.deployment.length} modalità</span></div>
                      <div className="flex justify-between text-xs"><span className="text-ci-muted">Response</span><span className="font-bold">{c.responseTime}ms</span></div>
                    </div>
                    {isCI ? (
                      <div className="space-y-0.5">{c.strengths.slice(0, 5).map(s => <p key={s} className="text-[10px] text-green-400">✅ {s}</p>)}</div>
                    ) : (
                      <div className="space-y-0.5">{c.weaknesses.slice(0, 3).map(w => <p key={w} className="text-[10px] text-red-400/70">❌ {w}</p>)}</div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-ci-accent/10 border border-green-500/30 rounded-xl p-5 md:p-8 text-center">
              <h2 className="text-lg md:text-xl font-bold text-green-400 mb-2">💰 ROI: CrimeIntel vs Palantir Gotham</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-ci-card/50 rounded-lg p-4">
                  <p className="text-xs text-ci-muted mb-1">Risparmio Anno 1</p>
                  <p className="text-3xl font-black text-green-400">€1.58M</p>
                  <p className="text-[10px] text-ci-muted">vs €2M+ Palantir minimo</p>
                </div>
                <div className="bg-ci-card/50 rounded-lg p-4">
                  <p className="text-xs text-ci-muted mb-1">Features in Più</p>
                  <p className="text-3xl font-black text-ci-accent">+{ciFeatures - featureCount(1)}</p>
                  <p className="text-[10px] text-ci-muted">funzionalità esclusive</p>
                </div>
                <div className="bg-ci-card/50 rounded-lg p-4">
                  <p className="text-xs text-ci-muted mb-1">Deploy</p>
                  <p className="text-3xl font-black text-purple-400">1080x</p>
                  <p className="text-[10px] text-ci-muted">più veloce (4h vs 6 mesi)</p>
                </div>
              </div>
              <p className="text-sm text-green-400 font-bold mt-4">🏆 CrimeIntel: più funzionalità, più velocità, più flessibilità a una frazione del costo.</p>
            </div>
          </>
        )}
      </main>
    </NavShell>
  );
}
