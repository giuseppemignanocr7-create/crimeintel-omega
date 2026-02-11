'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    api.getCaseStats()
      .then((res) => setStats(res.data))
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen min-h-[100dvh]">
        <div className="animate-pulse text-ci-accent text-xl">Loading CrimeIntel...</div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Cases', value: stats?.total || 0, color: 'text-ci-accent' },
    { label: 'Open', value: stats?.open || 0, color: 'text-ci-warning' },
    { label: 'Active', value: stats?.active || 0, color: 'text-ci-success' },
    { label: 'Evidence', value: stats?.evidence || 0, color: 'text-purple-400' },
    { label: 'AI Analyzed', value: stats?.aiAnalyzed || 0, color: 'text-cyan-400' },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-ci-border bg-ci-card/95 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-xl md:text-2xl font-bold text-ci-accent">CrimeIntel</span>
          <span className="text-[10px] md:text-xs bg-ci-accent/20 text-ci-accent px-1.5 md:px-2 py-0.5 rounded">7.0 Ω</span>
        </div>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => router.push('/cases')} className="text-ci-muted hover:text-ci-text transition">Cases</button>
          <button onClick={() => router.push('/search')} className="text-ci-muted hover:text-ci-text transition">NeuroSearch</button>
          <button onClick={() => { api.clearToken(); router.push('/login'); }} className="text-ci-danger hover:text-red-300 transition text-sm">Logout</button>
        </div>
        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2 -mr-2" aria-label="Menu">
          <span className={`block w-5 h-0.5 bg-ci-text transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-ci-text transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-ci-text transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setMenuOpen(false)}>
          <div className="mobile-overlay absolute inset-0 bg-black/60" />
          <div className="mobile-menu absolute right-0 top-0 h-full w-64 bg-ci-card border-l border-ci-border pt-16 px-6">
            <div className="space-y-1">
              <button onClick={() => { router.push('/'); setMenuOpen(false); }} className="w-full text-left py-3 px-4 rounded-lg text-ci-accent font-medium bg-ci-accent/10">
                Command Center
              </button>
              <button onClick={() => { router.push('/cases'); setMenuOpen(false); }} className="w-full text-left py-3 px-4 rounded-lg text-ci-text hover:bg-ci-border/50 transition">
                Cases
              </button>
              <button onClick={() => { router.push('/search'); setMenuOpen(false); }} className="w-full text-left py-3 px-4 rounded-lg text-ci-text hover:bg-ci-border/50 transition">
                NeuroSearch
              </button>
              <hr className="border-ci-border my-3" />
              <button onClick={() => { api.clearToken(); router.push('/login'); }} className="w-full text-left py-3 px-4 rounded-lg text-ci-danger hover:bg-red-500/10 transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Command Center</h1>

        {/* Stat cards — horizontal scroll on mobile */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-8 md:mb-10 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
          {statCards.map((s) => (
            <div key={s.label} className="flex-shrink-0 w-36 md:w-auto bg-ci-card border border-ci-border rounded-lg p-4 md:p-5 ci-glow">
              <p className="text-ci-muted text-xs md:text-sm whitespace-nowrap">{s.label}</p>
              <p className={`text-2xl md:text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Quick Actions</h2>
            <div className="space-y-2 md:space-y-3">
              <button onClick={() => router.push('/cases')} className="w-full text-left px-4 py-3 md:py-3 bg-ci-bg rounded hover:bg-ci-accent/10 active:bg-ci-accent/20 transition border border-ci-border text-sm md:text-base">
                View All Cases
              </button>
              <button onClick={() => router.push('/search')} className="w-full text-left px-4 py-3 md:py-3 bg-ci-bg rounded hover:bg-ci-accent/10 active:bg-ci-accent/20 transition border border-ci-border text-sm md:text-base">
                NeuroSearch Intelligence Query
              </button>
            </div>
          </div>

          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">System Status</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-ci-muted">API</span><span className="text-ci-success">Online</span></div>
              <div className="flex justify-between"><span className="text-ci-muted">Database</span><span className="text-ci-success">Connected</span></div>
              <div className="flex justify-between"><span className="text-ci-muted">AI Engine</span><span className="text-ci-warning">Stub Mode</span></div>
              <div className="flex justify-between"><span className="text-ci-muted">Version</span><span>7.0.0 Omega</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
