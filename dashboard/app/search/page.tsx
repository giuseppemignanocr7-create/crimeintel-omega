'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.search(query);
      setResults(res.data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="border-b border-ci-border bg-ci-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-2xl font-bold text-ci-accent">CrimeIntel</button>
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">NeuroSearch</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/cases')} className="text-ci-muted hover:text-ci-text transition">Cases</button>
          <button onClick={() => { api.clearToken(); router.push('/login'); }} className="text-ci-danger text-sm">Logout</button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-2">NeuroSearch</h1>
        <p className="text-ci-muted text-sm mb-6">Search across all evidence, AI results, cases, and metadata</p>

        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for persons, plates, keywords, locations..."
            className="flex-1 px-4 py-3 bg-ci-card border border-ci-border rounded-lg focus:border-purple-500 focus:outline-none text-ci-text text-lg"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {results && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-ci-muted">{results.totalResults} results found</span>
              <span className="text-xs text-ci-muted">Engine: {results.engineVersion}</span>
            </div>

            {results.results?.cases?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Cases ({results.results.cases.length})</h2>
                <div className="space-y-2">
                  {results.results.cases.map((c: any) => (
                    <div
                      key={c.id}
                      onClick={() => router.push(`/cases/${c.id}`)}
                      className="bg-ci-card border border-ci-border rounded-lg p-4 hover:border-purple-500/50 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-ci-muted">{c.caseNumber}</span>
                        <span className="text-xs bg-ci-accent/20 text-ci-accent px-1.5 py-0.5 rounded">{c.status}</span>
                      </div>
                      <h3 className="font-medium">{c.title}</h3>
                      {c.description && <p className="text-sm text-ci-muted mt-1 line-clamp-1">{c.description}</p>}
                      <span className="text-xs text-ci-muted mt-1">{c._count?.evidence || 0} evidence items</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.results?.evidence?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Evidence ({results.results.evidence.length})</h2>
                <div className="space-y-2">
                  {results.results.evidence.map((ev: any) => (
                    <div key={ev.id} className="bg-ci-card border border-ci-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">{ev.type}</span>
                            <span className="text-xs text-ci-muted">{ev.case?.caseNumber}</span>
                          </div>
                          <p className="font-medium text-sm">{ev.fileName}</p>
                          <p className="text-xs text-ci-muted mt-1">
                            {(ev.fileSize / 1024).toFixed(1)}KB &middot; AI: {ev.aiStatus} &middot; Hash: {ev.hash?.substring(0, 12)}...
                          </p>
                        </div>
                        {ev.case && (
                          <button
                            onClick={() => router.push(`/cases/${ev.case.id}`)}
                            className="text-xs text-ci-accent hover:text-ci-accent-hover transition"
                          >
                            View Case
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.totalResults === 0 && (
              <div className="text-center text-ci-muted py-12">
                <p className="text-lg mb-2">No results found for &quot;{query}&quot;</p>
                <p className="text-sm">Try different keywords or check your spelling</p>
              </div>
            )}

            {results.note && (
              <p className="text-xs text-ci-muted mt-6 text-center">{results.note}</p>
            )}
          </div>
        )}

        {!results && !loading && (
          <div className="text-center text-ci-muted py-16">
            <p className="text-lg mb-2">Enter a query to search</p>
            <p className="text-sm">Search across all evidence files, AI analysis results, cases, and metadata</p>
          </div>
        )}
      </main>
    </div>
  );
}
