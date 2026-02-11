'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <div className="min-h-screen min-h-[100dvh]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-ci-border bg-ci-card/95 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={() => router.push('/')} className="text-xl md:text-2xl font-bold text-ci-accent">CrimeIntel</button>
          <span className="text-[10px] md:text-xs bg-purple-500/20 text-purple-400 px-1.5 md:px-2 py-0.5 rounded">NeuroSearch</span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => router.push('/cases')} className="text-ci-muted hover:text-ci-text transition">Cases</button>
          <button onClick={() => { api.clearToken(); router.push('/login'); }} className="text-ci-danger text-sm">Logout</button>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2 -mr-2" aria-label="Menu">
          <span className={`block w-5 h-0.5 bg-ci-text transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-ci-text transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-ci-text transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setMenuOpen(false)}>
          <div className="mobile-overlay absolute inset-0 bg-black/60" />
          <div className="mobile-menu absolute right-0 top-0 h-full w-64 bg-ci-card border-l border-ci-border pt-16 px-6">
            <div className="space-y-1">
              <button onClick={() => { router.push('/'); setMenuOpen(false); }} className="w-full text-left py-3 px-4 rounded-lg text-ci-text hover:bg-ci-border/50 transition">Command Center</button>
              <button onClick={() => { router.push('/cases'); setMenuOpen(false); }} className="w-full text-left py-3 px-4 rounded-lg text-ci-text hover:bg-ci-border/50 transition">Cases</button>
              <button onClick={() => { router.push('/search'); setMenuOpen(false); }} className="w-full text-left py-3 px-4 rounded-lg text-ci-accent font-medium bg-ci-accent/10">NeuroSearch</button>
              <hr className="border-ci-border my-3" />
              <button onClick={() => { api.clearToken(); router.push('/login'); }} className="w-full text-left py-3 px-4 rounded-lg text-ci-danger hover:bg-red-500/10 transition">Logout</button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <h1 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">NeuroSearch</h1>
        <p className="text-ci-muted text-xs md:text-sm mb-4 md:mb-6">Search across all evidence, AI results, cases, and metadata</p>

        {/* Search bar — stacks on mobile */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6 md:mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Persons, plates, keywords, locations..."
            className="flex-1 px-3 md:px-4 py-3 bg-ci-card border border-ci-border rounded-lg focus:border-purple-500 focus:outline-none text-ci-text text-base md:text-lg"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg transition font-medium disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {results && (
          <div>
            <div className="flex items-center gap-2 md:gap-3 mb-4">
              <span className="text-sm text-ci-muted">{results.totalResults} results</span>
              <span className="text-xs text-ci-muted hidden sm:inline">Engine: {results.engineVersion}</span>
            </div>

            {results.results?.cases?.length > 0 && (
              <div className="mb-5 md:mb-6">
                <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Cases ({results.results.cases.length})</h2>
                <div className="space-y-2">
                  {results.results.cases.map((c: any) => (
                    <div
                      key={c.id}
                      onClick={() => router.push(`/cases/${c.id}`)}
                      className="bg-ci-card border border-ci-border rounded-lg p-3 md:p-4 hover:border-purple-500/50 active:bg-ci-border/30 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono text-ci-muted">{c.caseNumber}</span>
                        <span className="text-xs bg-ci-accent/20 text-ci-accent px-1.5 py-0.5 rounded">{c.status}</span>
                      </div>
                      <h3 className="font-medium text-sm md:text-base">{c.title}</h3>
                      {c.description && <p className="text-sm text-ci-muted mt-1 line-clamp-1">{c.description}</p>}
                      <span className="text-xs text-ci-muted mt-1">{c._count?.evidence || 0} evidence</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.results?.evidence?.length > 0 && (
              <div>
                <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Evidence ({results.results.evidence.length})</h2>
                <div className="space-y-2">
                  {results.results.evidence.map((ev: any) => (
                    <div key={ev.id} className="bg-ci-card border border-ci-border rounded-lg p-3 md:p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-mono bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">{ev.type}</span>
                            <span className="text-xs text-ci-muted">{ev.case?.caseNumber}</span>
                          </div>
                          <p className="font-medium text-sm truncate">{ev.fileName}</p>
                          <p className="text-xs text-ci-muted mt-1">
                            {ev.fileSize > 1048576 ? `${(ev.fileSize / 1048576).toFixed(1)}MB` : `${(ev.fileSize / 1024).toFixed(1)}KB`} · AI: {ev.aiStatus}
                            <span className="hidden sm:inline"> · Hash: {ev.hash?.substring(0, 12)}...</span>
                          </p>
                        </div>
                        {ev.case && (
                          <button
                            onClick={(e) => { e.stopPropagation(); router.push(`/cases/${ev.case.id}`); }}
                            className="text-xs text-ci-accent hover:text-ci-accent-hover active:text-blue-300 transition flex-shrink-0 py-1"
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
              <div className="text-center text-ci-muted py-10 md:py-12">
                <p className="text-base md:text-lg mb-2">No results for &quot;{query}&quot;</p>
                <p className="text-sm">Try different keywords or check your spelling</p>
              </div>
            )}

            {results.note && (
              <p className="text-xs text-ci-muted mt-6 text-center">{results.note}</p>
            )}
          </div>
        )}

        {!results && !loading && (
          <div className="text-center text-ci-muted py-12 md:py-16">
            <p className="text-base md:text-lg mb-2">Enter a query to search</p>
            <p className="text-xs md:text-sm">Search across all evidence files, AI analysis results, cases, and metadata</p>
          </div>
        )}
      </main>
    </div>
  );
}
