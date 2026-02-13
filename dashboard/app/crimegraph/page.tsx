'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { NavShell } from '@/components/NavShell';
import { DEMO_CRIMEGRAPH } from '@/lib/mock-data';

export default function CrimeGraphPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const token = api.getToken();
    if (!token) { router.push('/login'); return; }
    setLoading(false);
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen min-h-[100dvh]"><div className="animate-pulse text-ci-accent">Loading...</div></div>;

  const { nodes, edges, stats } = DEMO_CRIMEGRAPH;
  const types = [...new Set(nodes.map(n => n.type))];

  const filteredNodes = filterType ? nodes.filter(n => n.type === filterType) : nodes;
  const filteredEdges = edges.filter(e => {
    const nodeIds = filteredNodes.map(n => n.id);
    return nodeIds.includes(e.from) && nodeIds.includes(e.to);
  });

  const sel = selectedNode ? nodes.find(n => n.id === selectedNode) : null;
  const selEdges = selectedNode ? edges.filter(e => e.from === selectedNode || e.to === selectedNode) : [];

  const typeIcon: Record<string, string> = {
    person: '👤', vehicle: '🚗', location: '📍', organization: '🏴', phone: '📱',
    crypto: '₿', digital: '💻', financial: '🏦',
  };
  const typeColor: Record<string, string> = {
    person: 'border-blue-500 bg-blue-500/10', vehicle: 'border-green-500 bg-green-500/10',
    location: 'border-yellow-500 bg-yellow-500/10', organization: 'border-red-500 bg-red-500/10',
    phone: 'border-purple-500 bg-purple-500/10', crypto: 'border-orange-500 bg-orange-500/10',
    digital: 'border-cyan-500 bg-cyan-500/10', financial: 'border-pink-500 bg-pink-500/10',
  };

  const riskColor = (r: number) => r >= 0.9 ? 'text-red-400' : r >= 0.7 ? 'text-orange-400' : r >= 0.5 ? 'text-yellow-400' : 'text-green-400';

  return (
    <NavShell current="/crimegraph">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <h1 className="text-xl md:text-3xl font-bold mb-1">CrimeGraph</h1>
        <p className="text-ci-muted text-xs md:text-sm mb-5">Grafo investigativo Neo4j — Entità, relazioni e community detection</p>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3 mb-5">
          {[
            { label: 'Nodi', value: stats.totalNodes, color: 'text-ci-accent' },
            { label: 'Relazioni', value: stats.totalEdges, color: 'text-purple-400' },
            { label: 'Community', value: stats.communities, color: 'text-green-400' },
            { label: 'Avg PageRank', value: stats.avgPageRank.toFixed(3), color: 'text-yellow-400' },
            { label: 'Alto Rischio', value: stats.highRiskEntities, color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-ci-card border border-ci-border rounded-lg p-3">
              <p className="text-[10px] text-ci-muted">{s.label}</p>
              <p className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button onClick={() => setFilterType('')} className={`px-3 py-1.5 rounded-full text-xs transition ${!filterType ? 'bg-ci-accent text-white' : 'bg-ci-card border border-ci-border text-ci-muted hover:text-ci-text'}`}>
            Tutti ({nodes.length})
          </button>
          {types.map(t => (
            <button key={t} onClick={() => setFilterType(filterType === t ? '' : t)}
              className={`px-3 py-1.5 rounded-full text-xs transition flex items-center gap-1 ${filterType === t ? 'bg-ci-accent text-white' : 'bg-ci-card border border-ci-border text-ci-muted hover:text-ci-text'}`}>
              {typeIcon[t]} {t} ({nodes.filter(n => n.type === t).length})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Graph visualization area */}
          <div className="lg:col-span-2 bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-sm font-semibold mb-4">Mappa Relazioni</h2>
            {/* CSS-based graph layout */}
            <div className="relative w-full" style={{ minHeight: '320px' }}>
              {/* Edges as SVG */}
              <svg className="absolute inset-0 w-full h-full" style={{ minHeight: '320px' }}>
                {filteredEdges.map((e, i) => {
                  const fromNode = filteredNodes.findIndex(n => n.id === e.from);
                  const toNode = filteredNodes.findIndex(n => n.id === e.to);
                  if (fromNode === -1 || toNode === -1) return null;
                  const cols = Math.min(filteredNodes.length, 5);
                  const fx = ((fromNode % cols) / (cols - 1 || 1)) * 85 + 7.5;
                  const fy = (Math.floor(fromNode / cols) / (Math.ceil(filteredNodes.length / cols) - 1 || 1)) * 80 + 10;
                  const tx = ((toNode % cols) / (cols - 1 || 1)) * 85 + 7.5;
                  const ty = (Math.floor(toNode / cols) / (Math.ceil(filteredNodes.length / cols) - 1 || 1)) * 80 + 10;
                  const isHighlighted = selectedNode && (e.from === selectedNode || e.to === selectedNode);
                  return (
                    <line key={i}
                      x1={`${fx}%`} y1={`${fy}%`} x2={`${tx}%`} y2={`${ty}%`}
                      stroke={isHighlighted ? '#3b82f6' : '#374151'} strokeWidth={isHighlighted ? 2 : 1}
                      opacity={selectedNode && !isHighlighted ? 0.15 : 0.6}
                    />
                  );
                })}
              </svg>
              {/* Nodes */}
              {filteredNodes.map((n, i) => {
                const cols = Math.min(filteredNodes.length, 5);
                const x = ((i % cols) / (cols - 1 || 1)) * 85 + 7.5;
                const y = (Math.floor(i / cols) / (Math.ceil(filteredNodes.length / cols) - 1 || 1)) * 80 + 10;
                const isSelected = selectedNode === n.id;
                const isConnected = selectedNode && selEdges.some(e => e.from === n.id || e.to === n.id);
                const dim = selectedNode && !isSelected && !isConnected;
                return (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNode(selectedNode === n.id ? null : n.id)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 border-2 rounded-xl px-2 py-1.5 text-center transition-all z-10 ${typeColor[n.type] || 'border-ci-border bg-ci-bg'} ${
                      isSelected ? 'scale-110 shadow-lg ring-2 ring-ci-accent/50' : 'hover:scale-105'
                    } ${dim ? 'opacity-20' : ''}`}
                    style={{ left: `${x}%`, top: `${y}%`, minWidth: '64px', maxWidth: '100px' }}
                  >
                    <span className="text-lg block">{typeIcon[n.type]}</span>
                    <p className="text-[10px] font-medium truncate max-w-[90px]">{n.label}</p>
                    <p className={`text-[9px] font-bold ${riskColor(n.risk)}`}>Risk: {(n.risk * 100).toFixed(0)}%</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            {/* Selected node detail */}
            {sel ? (
              <div className={`border-2 rounded-lg p-4 ${typeColor[sel.type]}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{typeIcon[sel.type]}</span>
                  <div>
                    <p className="font-bold">{sel.label}</p>
                    <p className="text-xs text-ci-muted capitalize">{sel.type}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-ci-bg/50 rounded p-2">
                    <p className="text-[10px] text-ci-muted">Risk Score</p>
                    <p className={`text-lg font-bold ${riskColor(sel.risk)}`}>{(sel.risk * 100).toFixed(0)}%</p>
                  </div>
                  <div className="bg-ci-bg/50 rounded p-2">
                    <p className="text-[10px] text-ci-muted">Casi Collegati</p>
                    <p className="text-lg font-bold text-ci-accent">{sel.cases.length}</p>
                  </div>
                </div>
                <p className="text-xs font-semibold mb-1.5">Relazioni ({selEdges.length})</p>
                <div className="space-y-1">
                  {selEdges.map((e, i) => {
                    const other = nodes.find(n => n.id === (e.from === sel.id ? e.to : e.from));
                    return (
                      <div key={i} className="flex items-center justify-between bg-ci-bg/50 rounded px-2 py-1.5 text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span>{typeIcon[other?.type || '']}</span>
                          <span className="truncate">{other?.label}</span>
                        </div>
                        <span className="text-ci-muted text-[10px] flex-shrink-0 ml-1">{e.relation}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold mb-1">Casi</p>
                  <div className="flex flex-wrap gap-1">
                    {sel.cases.map(c => (
                      <button key={c} onClick={() => router.push(`/cases/${c}`)}
                        className="text-[10px] px-2 py-1 bg-ci-accent/20 text-ci-accent rounded hover:bg-ci-accent/30 transition">
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-ci-card border border-ci-border rounded-lg p-4 text-center text-ci-muted text-sm">
                <p className="text-lg mb-2">🔍</p>
                <p>Seleziona un nodo per vedere i dettagli</p>
              </div>
            )}

            {/* High risk entities */}
            <div className="bg-ci-card border border-ci-border rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-3">🚨 Entità Alto Rischio</h3>
              <div className="space-y-2">
                {nodes.filter(n => n.risk >= 0.8).sort((a, b) => b.risk - a.risk).map(n => (
                  <button key={n.id} onClick={() => setSelectedNode(n.id)}
                    className={`w-full flex items-center justify-between bg-ci-bg rounded p-2.5 text-left transition hover:bg-ci-border/50 ${selectedNode === n.id ? 'ring-1 ring-ci-accent' : ''}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span>{typeIcon[n.type]}</span>
                      <span className="text-xs truncate">{n.label}</span>
                    </div>
                    <span className={`text-xs font-bold flex-shrink-0 ${riskColor(n.risk)}`}>{(n.risk * 100).toFixed(0)}%</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-ci-card border border-ci-border rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2">Legenda</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {types.map(t => (
                  <div key={t} className="flex items-center gap-1.5 text-xs">
                    <span>{typeIcon[t]}</span>
                    <span className="capitalize text-ci-muted">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </NavShell>
  );
}
