'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';

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
    return <div className="flex items-center justify-center min-h-screen"><div className="text-ci-accent">Loading case...</div></div>;
  }

  if (!caseData) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-ci-danger">Case not found</div></div>;
  }

  const typeIcon: Record<string, string> = { IMAGE: 'img', VIDEO: 'vid', AUDIO: 'aud', DOCUMENT: 'doc', PLATE: 'lpr' };

  return (
    <div className="min-h-screen">
      <nav className="border-b border-ci-border bg-ci-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-2xl font-bold text-ci-accent">CrimeIntel</button>
          <span className="text-ci-muted">/</span>
          <button onClick={() => router.push('/cases')} className="text-ci-muted hover:text-ci-text transition">Cases</button>
          <span className="text-ci-muted">/</span>
          <span className="text-sm font-mono">{caseData.caseNumber}</span>
        </div>
        <button onClick={() => { api.clearToken(); router.push('/login'); }} className="text-ci-danger text-sm">Logout</button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{caseData.title}</h1>
            <p className="text-ci-muted mt-1">{caseData.description}</p>
            <div className="flex gap-3 mt-2 text-sm">
              <span className="text-ci-warning">{caseData.status}</span>
              <span className="text-ci-muted">Priority: {caseData.priority}</span>
              {caseData.locationName && <span className="text-ci-muted">{caseData.locationName}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleRunFusion} disabled={fusionLoading} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition disabled:opacity-50">
              {fusionLoading ? 'Running...' : 'Run HyperFusion'}
            </button>
            <button onClick={() => handleGenerateReport('SUMMARY')} className="px-4 py-2 bg-ci-card border border-ci-border rounded text-sm hover:bg-ci-border transition">
              Generate Report
            </button>
          </div>
        </div>

        {/* Evidence Upload */}
        <div className="bg-ci-card border border-ci-border rounded-lg p-5 mb-6">
          <h2 className="font-semibold mb-3">Upload Evidence</h2>
          <div className="flex gap-3 items-center">
            <input
              type="file"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="text-sm text-ci-muted file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-ci-accent file:text-white file:cursor-pointer"
            />
            <button
              onClick={handleUpload}
              disabled={!uploadFile || uploading}
              className="px-4 py-2 bg-ci-accent hover:bg-ci-accent-hover text-white rounded text-sm transition disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>

        {/* Evidence List */}
        <div className="bg-ci-card border border-ci-border rounded-lg p-5 mb-6">
          <h2 className="font-semibold mb-3">Evidence ({caseData.evidence?.length || 0})</h2>
          {caseData.evidence?.length === 0 ? (
            <p className="text-ci-muted text-sm">No evidence uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {caseData.evidence?.map((ev: any) => (
                <div key={ev.id} className="flex items-center justify-between bg-ci-bg rounded p-3 border border-ci-border">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono bg-ci-accent/20 text-ci-accent px-2 py-1 rounded">{typeIcon[ev.type] || '?'}</span>
                    <div>
                      <p className="text-sm font-medium">{ev.fileName}</p>
                      <p className="text-xs text-ci-muted">
                        {(ev.fileSize / 1024).toFixed(1)}KB &middot; {ev.hash?.substring(0, 12)}... &middot; AI: <span className={ev.aiStatus === 'COMPLETED' ? 'text-ci-success' : ev.aiStatus === 'PROCESSING' ? 'text-ci-warning' : 'text-ci-muted'}>{ev.aiStatus}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-ci-muted">{new Date(ev.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fusion Results */}
        {fusion && (
          <div className="bg-ci-card border border-ci-border rounded-lg p-5 mb-6">
            <h2 className="font-semibold mb-3">HyperFusion Results</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-ci-bg rounded p-3 text-center border border-ci-border">
                <p className="text-xs text-ci-muted">Fusion Score</p>
                <p className="text-2xl font-bold text-purple-400">{(fusion.fusionScore * 100).toFixed(0)}%</p>
              </div>
              <div className="bg-ci-bg rounded p-3 text-center border border-ci-border">
                <p className="text-xs text-ci-muted">Confidence</p>
                <p className="text-2xl font-bold text-ci-accent">{(fusion.confidence * 100).toFixed(0)}%</p>
              </div>
              <div className="bg-ci-bg rounded p-3 text-center border border-ci-border">
                <p className="text-xs text-ci-muted">Version</p>
                <p className="text-2xl font-bold text-ci-text">{fusion.version}</p>
              </div>
            </div>
            <details className="text-sm">
              <summary className="cursor-pointer text-ci-muted hover:text-ci-text transition">View Raw Fusion Data</summary>
              <pre className="mt-2 bg-ci-bg rounded p-3 overflow-auto text-xs max-h-64 border border-ci-border">{JSON.stringify(fusion.fusionData, null, 2)}</pre>
            </details>
          </div>
        )}

        {/* Reports */}
        {caseData.reports?.length > 0 && (
          <div className="bg-ci-card border border-ci-border rounded-lg p-5">
            <h2 className="font-semibold mb-3">Reports ({caseData.reports.length})</h2>
            <div className="space-y-2">
              {caseData.reports.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between bg-ci-bg rounded p-3 border border-ci-border">
                  <div>
                    <p className="text-sm font-medium">{r.type} Report</p>
                    <p className="text-xs text-ci-muted">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>
                  <span className="text-xs font-mono text-ci-muted">{r.id.substring(0, 8)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
