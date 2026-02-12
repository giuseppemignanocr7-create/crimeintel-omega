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
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRunFusion = async () => {
    setFusionLoading(true);
    try {
      const res = await api.runFusion(id);
      setFusion(res.data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setFusionLoading(false);
    }
  };

  const handleGenerateReport = async (type: string) => {
    try {
      const res = await api.generateReport(id, type);
      alert(`Report generated: ${res.data.id}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen min-h-[100dvh]"><div className="text-ci-accent">Loading case...</div></div>;
  }

  if (!caseData) {
    return <div className="flex items-center justify-center min-h-screen min-h-[100dvh]"><div className="text-ci-danger">Case not found</div></div>;
  }

  const typeIcon: Record<string, string> = { IMAGE: 'img', VIDEO: 'vid', AUDIO: 'aud', DOCUMENT: 'doc', PLATE: 'lpr' };

  return (
    <NavShell current="/cases">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        {/* Back button — mobile */}
        <button onClick={() => router.push('/cases')} className="md:hidden flex items-center gap-1 text-ci-muted text-sm mb-3 active:text-ci-text">
          <span>←</span> Back to Cases
        </button>

        {/* Case header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5 md:mb-6">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold leading-tight">{caseData.title}</h1>
            {caseData.description && <p className="text-ci-muted text-sm mt-1 line-clamp-3 md:line-clamp-none">{caseData.description}</p>}
            <div className="flex flex-wrap gap-2 md:gap-3 mt-2 text-sm">
              <span className="text-ci-warning">{caseData.status}</span>
              <span className="text-ci-muted">Priority: {caseData.priority}</span>
              {caseData.locationName && <span className="text-ci-muted truncate max-w-[200px] md:max-w-none">{caseData.locationName}</span>}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={handleRunFusion} disabled={fusionLoading} className="flex-1 md:flex-none px-3 md:px-4 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded text-sm transition disabled:opacity-50">
              {fusionLoading ? 'Running...' : 'HyperFusion'}
            </button>
            <button onClick={() => handleGenerateReport('SUMMARY')} className="flex-1 md:flex-none px-3 md:px-4 py-2.5 bg-ci-card border border-ci-border rounded text-sm hover:bg-ci-border active:bg-gray-600 transition">
              Report
            </button>
          </div>
        </div>

        {/* Evidence Upload */}
        <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-5 mb-4 md:mb-6">
          <h2 className="font-semibold mb-3 text-sm md:text-base">Upload Evidence</h2>
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
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>

        {/* Evidence List */}
        <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-5 mb-4 md:mb-6">
          <h2 className="font-semibold mb-3 text-sm md:text-base">Evidence ({caseData.evidence?.length || 0})</h2>
          {caseData.evidence?.length === 0 ? (
            <p className="text-ci-muted text-sm">No evidence uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {caseData.evidence?.map((ev: any) => (
                <div key={ev.id} className="flex items-start sm:items-center justify-between gap-2 bg-ci-bg rounded p-3 border border-ci-border">
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
                  <span className="text-xs text-ci-muted whitespace-nowrap flex-shrink-0 hidden sm:block">{new Date(ev.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fusion Results */}
        {fusion && (
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-5 mb-4 md:mb-6">
            <h2 className="font-semibold mb-3 text-sm md:text-base">HyperFusion Results</h2>
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
              <div className="bg-ci-bg rounded p-2.5 md:p-3 text-center border border-ci-border">
                <p className="text-[10px] md:text-xs text-ci-muted">Score</p>
                <p className="text-lg md:text-2xl font-bold text-purple-400">{(fusion.fusionScore * 100).toFixed(0)}%</p>
              </div>
              <div className="bg-ci-bg rounded p-2.5 md:p-3 text-center border border-ci-border">
                <p className="text-[10px] md:text-xs text-ci-muted">Confidence</p>
                <p className="text-lg md:text-2xl font-bold text-ci-accent">{(fusion.confidence * 100).toFixed(0)}%</p>
              </div>
              <div className="bg-ci-bg rounded p-2.5 md:p-3 text-center border border-ci-border">
                <p className="text-[10px] md:text-xs text-ci-muted">Version</p>
                <p className="text-lg md:text-2xl font-bold text-ci-text">{fusion.version}</p>
              </div>
            </div>
            <details className="text-sm">
              <summary className="cursor-pointer text-ci-muted hover:text-ci-text transition py-1">View Raw Fusion Data</summary>
              <pre className="mt-2 bg-ci-bg rounded p-3 overflow-auto text-xs max-h-48 md:max-h-64 border border-ci-border">{JSON.stringify(fusion.fusionData, null, 2)}</pre>
            </details>
          </div>
        )}

        {/* Reports */}
        {caseData.reports?.length > 0 && (
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-5">
            <h2 className="font-semibold mb-3 text-sm md:text-base">Reports ({caseData.reports.length})</h2>
            <div className="space-y-2">
              {caseData.reports.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between bg-ci-bg rounded p-3 border border-ci-border">
                  <div>
                    <p className="text-sm font-medium">{r.type} Report</p>
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
