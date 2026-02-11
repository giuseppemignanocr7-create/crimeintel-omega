'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center justify-center min-h-screen">
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
    <div className="min-h-screen">
      <nav className="border-b border-ci-border bg-ci-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-ci-accent">CrimeIntel</span>
          <span className="text-xs bg-ci-accent/20 text-ci-accent px-2 py-0.5 rounded">7.0 Ω</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/cases')} className="text-ci-muted hover:text-ci-text transition">Cases</button>
          <button onClick={() => router.push('/search')} className="text-ci-muted hover:text-ci-text transition">NeuroSearch</button>
          <button onClick={() => { api.clearToken(); router.push('/login'); }} className="text-ci-danger hover:text-red-300 transition text-sm">Logout</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Command Center</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {statCards.map((s) => (
            <div key={s.label} className="bg-ci-card border border-ci-border rounded-lg p-5 ci-glow">
              <p className="text-ci-muted text-sm">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-ci-card border border-ci-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button onClick={() => router.push('/cases')} className="w-full text-left px-4 py-3 bg-ci-bg rounded hover:bg-ci-accent/10 transition border border-ci-border">
                View All Cases
              </button>
              <button onClick={() => router.push('/search')} className="w-full text-left px-4 py-3 bg-ci-bg rounded hover:bg-ci-accent/10 transition border border-ci-border">
                NeuroSearch Intelligence Query
              </button>
            </div>
          </div>

          <div className="bg-ci-card border border-ci-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">System Status</h2>
            <div className="space-y-2 text-sm">
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
