'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { NavShell } from '@/components/NavShell';

export default function CaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fusionLoading, setFusionLoading] = useState(false);
  const [fusion, setFusion] = useState<any>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [evAnalysis, setEvAnalysis] = useState<Record<string, string>>({});
  const [evAiLoading, setEvAiLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    loadCase();
    loadFusion();
  }, [id]);

  const loadCase = async () => {
    setLoading(true);
    try {
      const res = await api.getCase(id);
      setCaseData(res.data);
    } catch {
      router.push('/cases');
    } finally {
      setLoading(false);
    }
  };

  const loadFusion = async () => {
    try {
      const res = await api.getFusion(id);
      setFusion(res.data);
    } catch {
      setFusion(null);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    try {
      await api.uploadEvidence(id, uploadFile);
      setUploadFile(null);
      loadCase();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Caricamento fallito');
    } finally {
      setUploading(false);
    }
  };

  const handleRunFusion = async () => {
    setFusionLoading(true);
    try {
      const res = await api.runFusion(id);
      setFusion(res.data);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Fusione fallita');
    } finally {
      setFusionLoading(false);
    }
  };

  const handleGenerateReport = async (type: string) => {
    try {
      const res = await api.generateReport(id, type);
      alert(`Report generato: ${res.data.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Generazione report fallita');
    }
  };

  const handleAiAnalysis = async () => {
    if (!caseData) return;
    setAiLoading(true);
    setAiAnalysis(null);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'case_analysis',
          data: {
            title: caseData.title,
            caseNumber: caseData.caseNumber,
            status: caseData.status,
            priority: caseData.priority,
            description: caseData.description,
            locationName: caseData.locationName,
            tags: caseData.tags,
            createdAt: caseData.createdAt,
            evidenceCount: caseData.evidence?.length || 0,
            evidenceTypes: [...new Set(caseData.evidence?.map((e: any) => e.type) || [])],
            evidence: caseData.evidence?.slice(0, 10),
            fusion: fusion,
          },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiAnalysis(data.analysis);
    } catch (err) {
      setAiAnalysis('⚠️ Errore nell\'analisi AI: ' + (err instanceof Error ? err.message : 'Riprova tra poco.'));
    } finally {
      setAiLoading(false);
    }
  };

  const handleEvAiAnalysis = async (ev: any) => {
    setEvAiLoading(ev.id);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'evidence_analysis',
          data: {
            fileName: ev.fileName,
            type: ev.type,
            fileSize: ev.fileSize,
            hash: ev.hash,
            aiStatus: ev.aiStatus,
            caseName: caseData?.title,
            createdAt: ev.createdAt,
            aiResults: ev.aiResults,
          },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setEvAnalysis(prev => ({ ...prev, [ev.id]: data.analysis }));
    } catch (err) {
      setEvAnalysis(prev => ({ ...prev, [ev.id]: '⚠️ Errore: ' + (err instanceof Error ? err.message : 'Riprova.') }));
    } finally {
      setEvAiLoading(null);
    }
  };

  const renderMd = (text: string) => {
    return text
      .replace(/## (.+)/g, '<h3 class="text-sm font-bold mt-3 mb-1 text-ci-text">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/- (.+)/g, '<div class="flex gap-1.5 ml-1"><span class="text-ci-accent">•</span><span>$1</span></div>')
      .replace(/\n/g, '<br/>');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen min-h-[100dvh]"><div className="text-ci-accent">Caricamento caso...</div></div>;
  }

  if (!caseData) {
    return <div className="flex items-center justify-center min-h-screen min-h-[100dvh]"><div className="text-ci-danger">Caso non trovato</div></div>;
  }

  const typeIcon: Record<string, string> = { IMAGE: 'img', VIDEO: 'vid', AUDIO: 'aud', DOCUMENT: 'doc', PLATE: 'lpr' };

  return (
    <NavShell current="/cases">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        {/* Back button — mobile */}
        <button onClick={() => router.push('/cases')} className="md:hidden flex items-center gap-1 text-ci-muted text-sm mb-3 active:text-ci-text">
          <span>←</span> Torna ai Casi
        </button>

        {/* Case header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5 md:mb-6">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold leading-tight">{caseData.title}</h1>
            {caseData.description && <p className="text-ci-muted text-sm mt-1 line-clamp-3 md:line-clamp-none">{caseData.description}</p>}
            <div className="flex flex-wrap gap-2 md:gap-3 mt-2 text-sm">
              <span className="text-ci-warning">{caseData.status}</span>
              <span className="text-ci-muted">Priorità: {caseData.priority}</span>
              {caseData.locationName && <span className="text-ci-muted truncate max-w-[200px] md:max-w-none">{caseData.locationName}</span>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            <button onClick={handleAiAnalysis} disabled={aiLoading} className="flex-1 md:flex-none px-3 md:px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded text-sm transition disabled:opacity-50 font-medium">
              {aiLoading ? '🧠 Analisi...' : '🧠 Analisi AI'}
            </button>
            <button onClick={handleRunFusion} disabled={fusionLoading} className="flex-1 md:flex-none px-3 md:px-4 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded text-sm transition disabled:opacity-50">
              {fusionLoading ? 'In corso...' : 'HyperFusion'}
            </button>
            <button onClick={() => handleGenerateReport('SUMMARY')} className="flex-1 md:flex-none px-3 md:px-4 py-2.5 bg-ci-card border border-ci-border rounded text-sm hover:bg-ci-border active:bg-gray-600 transition">
              Report
            </button>
          </div>
        </div>

        {/* AI Analysis Results */}
        {(aiAnalysis || aiLoading) && (
          <div className="bg-gradient-to-r from-green-500/5 to-emerald-500/5 border-2 border-green-500/30 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🧠</span>
              <h2 className="font-bold text-sm md:text-base text-green-400">Analisi AI del Caso</h2>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-bold">Opus 4.6</span>
            </div>
            {aiLoading ? (
              <div className="flex items-center gap-3 py-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-ci-muted">Analisi AI in corso... Opus 4.6 sta esaminando il caso</span>
              </div>
            ) : (
              <div className="text-sm leading-relaxed text-ci-text" dangerouslySetInnerHTML={{ __html: renderMd(aiAnalysis || '') }} />
            )}
          </div>
        )}

        {/* Evidence Upload */}
        <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-5 mb-4 md:mb-6">
          <h2 className="font-semibold mb-3 text-sm md:text-base">Carica Prove</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
            <input
              type="file"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="text-sm text-ci-muted file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-ci-accent file:text-white file:cursor-pointer w-full sm:w-auto"
            />
            <button
              onClick={handleUpload}
              disabled={!uploadFile || uploading}
              className="w-full sm:w-auto px-4 py-2.5 bg-ci-accent hover:bg-ci-accent-hover active:bg-blue-700 text-white rounded text-sm transition disabled:opacity-50"
            >
              {uploading ? 'Caricamento...' : 'Carica'}
            </button>
          </div>
        </div>

        {/* Evidence List */}
        <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-5 mb-4 md:mb-6">
          <h2 className="font-semibold mb-3 text-sm md:text-base">Prove ({caseData.evidence?.length || 0})</h2>
          {caseData.evidence?.length === 0 ? (
            <p className="text-ci-muted text-sm">Nessuna prova caricata</p>
          ) : (
            <div className="space-y-2">
              {caseData.evidence?.map((ev: any) => (
                <div key={ev.id}>
                  <div className="flex items-start sm:items-center justify-between gap-2 bg-ci-bg rounded p-3 border border-ci-border">
                    <div className="flex items-start sm:items-center gap-2 md:gap-3 min-w-0">
                      <span className="text-xs font-mono bg-ci-accent/20 text-ci-accent px-2 py-1 rounded flex-shrink-0">{typeIcon[ev.type] || '?'}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{ev.fileName}</p>
                        <p className="text-xs text-ci-muted">
                          {ev.fileSize > 1048576 ? `${(ev.fileSize / 1048576).toFixed(1)}MB` : `${(ev.fileSize / 1024).toFixed(1)}KB`}
                          <span className="hidden sm:inline"> · {ev.hash?.substring(0, 12)}...</span>
                          {' · AI: '}<span className={ev.aiStatus === 'COMPLETED' ? 'text-ci-success' : ev.aiStatus === 'PROCESSING' ? 'text-ci-warning' : 'text-ci-muted'}>{ev.aiStatus}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEvAiAnalysis(ev); }}
                        disabled={evAiLoading === ev.id}
                        className="text-[10px] px-2 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded transition disabled:opacity-50 whitespace-nowrap"
                      >
                        {evAiLoading === ev.id ? '...' : '🧠 AI'}
                      </button>
                      <span className="text-xs text-ci-muted whitespace-nowrap hidden sm:block">{new Date(ev.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  {evAnalysis[ev.id] && (
                    <div className="mt-2 p-3 bg-green-500/5 border border-green-500/20 rounded text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMd(evAnalysis[ev.id]) }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fusion Results */}
        {fusion && (
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-5 mb-4 md:mb-6">
            <h2 className="font-semibold mb-3 text-sm md:text-base">Risultati HyperFusion</h2>
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
              <div className="bg-ci-bg rounded p-2.5 md:p-3 text-center border border-ci-border">
                <p className="text-[10px] md:text-xs text-ci-muted">Punteggio</p>
                <p className="text-lg md:text-2xl font-bold text-purple-400">{(fusion.fusionScore * 100).toFixed(0)}%</p>
              </div>
              <div className="bg-ci-bg rounded p-2.5 md:p-3 text-center border border-ci-border">
                <p className="text-[10px] md:text-xs text-ci-muted">Confidenza</p>
                <p className="text-lg md:text-2xl font-bold text-ci-accent">{(fusion.confidence * 100).toFixed(0)}%</p>
              </div>
              <div className="bg-ci-bg rounded p-2.5 md:p-3 text-center border border-ci-border">
                <p className="text-[10px] md:text-xs text-ci-muted">Versione</p>
                <p className="text-lg md:text-2xl font-bold text-ci-text">{fusion.version}</p>
              </div>
            </div>
            <details className="text-sm">
              <summary className="cursor-pointer text-ci-muted hover:text-ci-text transition py-1">Visualizza Dati Fusione Grezzi</summary>
              <pre className="mt-2 bg-ci-bg rounded p-3 overflow-auto text-xs max-h-48 md:max-h-64 border border-ci-border">{JSON.stringify(fusion.fusionData, null, 2)}</pre>
            </details>
          </div>
        )}

        {/* Reports */}
        {caseData.reports?.length > 0 && (
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-5">
            <h2 className="font-semibold mb-3 text-sm md:text-base">Report ({caseData.reports.length})</h2>
            <div className="space-y-2">
              {caseData.reports.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between bg-ci-bg rounded p-3 border border-ci-border">
                  <div>
                    <p className="text-sm font-medium">Report {r.type}</p>
                    <p className="text-xs text-ci-muted">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>
                  <span className="text-xs font-mono text-ci-muted hidden sm:block">{r.id.substring(0, 8)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </NavShell>
  );
}
