'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { NavShell } from '@/components/NavShell';
import { DEMO_USERS } from '@/lib/mock-data';

export default function UsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = api.getToken();
    if (!token) { router.push('/login'); return; }
    setLoading(false);
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen min-h-[100dvh]"><div className="animate-pulse text-ci-accent">Loading...</div></div>;

  const roleColor: Record<string, string> = {
    ADMIN: 'bg-red-500/20 text-red-400',
    SUPERVISOR: 'bg-orange-500/20 text-orange-400',
    INVESTIGATOR: 'bg-blue-500/20 text-blue-400',
    ANALYST: 'bg-purple-500/20 text-purple-400',
    VIEWER: 'bg-gray-500/20 text-gray-400',
  };

  const roleIcon: Record<string, string> = {
    ADMIN: '👑', SUPERVISOR: '🛡️', INVESTIGATOR: '🔍', ANALYST: '📊', VIEWER: '👁️',
  };

  let users = [...DEMO_USERS];
  if (search) {
    const q = search.toLowerCase();
    users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  }

  const roleCounts = DEMO_USERS.reduce((acc: Record<string, number>, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {});
  const activeCount = DEMO_USERS.filter(u => u.isActive).length;

  return (
    <NavShell current="/users">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <h1 className="text-xl md:text-3xl font-bold mb-1">Gestione Utenti</h1>
        <p className="text-ci-muted text-xs md:text-sm mb-5">Utenti registrati e ruoli sulla piattaforma</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="bg-ci-card border border-ci-border rounded-lg p-3 md:p-4">
            <p className="text-xs text-ci-muted">Totale Utenti</p>
            <p className="text-xl md:text-2xl font-bold text-ci-accent mt-0.5">{DEMO_USERS.length}</p>
          </div>
          <div className="bg-ci-card border border-ci-border rounded-lg p-3 md:p-4">
            <p className="text-xs text-ci-muted">Attivi</p>
            <p className="text-xl md:text-2xl font-bold text-ci-success mt-0.5">{activeCount}</p>
          </div>
          <div className="bg-ci-card border border-ci-border rounded-lg p-3 md:p-4">
            <p className="text-xs text-ci-muted">Disattivati</p>
            <p className="text-xl md:text-2xl font-bold text-red-400 mt-0.5">{DEMO_USERS.length - activeCount}</p>
          </div>
          <div className="bg-ci-card border border-ci-border rounded-lg p-3 md:p-4">
            <p className="text-xs text-ci-muted">Ruoli</p>
            <p className="text-xl md:text-2xl font-bold text-purple-400 mt-0.5">{Object.keys(roleCounts).length}</p>
          </div>
        </div>

        {/* Role distribution */}
        <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6 mb-5">
          <h2 className="text-sm md:text-base font-semibold mb-3">Distribuzione Ruoli</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(roleCounts).map(([role, count]) => (
              <div key={role} className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-ci-border ${roleColor[role] || ''}`}>
                <span className="text-lg">{roleIcon[role] || '👤'}</span>
                <div>
                  <p className="text-xs font-medium">{role}</p>
                  <p className="text-lg font-bold">{count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca utente per nome, email o ruolo..."
            className="w-full px-3 py-2.5 bg-ci-card border border-ci-border rounded focus:border-ci-accent focus:outline-none text-ci-text text-sm"
          />
        </div>

        {/* Users table */}
        <div className="bg-ci-card border border-ci-border rounded-lg overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ci-muted bg-ci-bg">
                  <th className="px-4 py-3">Utente</th>
                  <th className="px-4 py-3">Ruolo</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ultimo Accesso</th>
                  <th className="px-4 py-3">Registrato</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-t border-ci-border/50 hover:bg-ci-bg/50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-ci-accent/20 flex items-center justify-center text-ci-accent font-bold text-sm">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-ci-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${roleColor[u.role] || ''}`}>
                        {roleIcon[u.role] || '👤'} {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs ${u.isActive ? 'text-ci-success' : 'text-red-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                        {u.isActive ? 'Attivo' : 'Disattivato'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-ci-muted">{new Date(u.lastLogin).toLocaleDateString('it-IT')}</td>
                    <td className="px-4 py-3 text-xs text-ci-muted">{new Date(u.createdAt).toLocaleDateString('it-IT')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-ci-border/50">
            {users.map(u => (
              <div key={u.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-ci-accent/20 flex items-center justify-center text-ci-accent font-bold text-sm">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{u.name}</p>
                      <p className="text-xs text-ci-muted">{u.email}</p>
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${roleColor[u.role] || ''}`}>
                    {roleIcon[u.role]} {u.role}
                  </span>
                  <span className="text-xs text-ci-muted">Ultimo accesso: {new Date(u.lastLogin).toLocaleDateString('it-IT')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-ci-muted mt-4 text-center">{users.length} utenti mostrati</p>
      </main>
    </NavShell>
  );
}
