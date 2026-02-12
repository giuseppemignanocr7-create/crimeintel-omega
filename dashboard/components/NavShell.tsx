'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export function NavShell({ children, current }: { children: React.ReactNode; current: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { href: '/', label: 'Command Center' },
    { href: '/cases', label: 'Cases' },
    { href: '/search', label: 'NeuroSearch' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/audit', label: 'Audit Log' },
    { href: '/users', label: 'Utenti' },
  ];
  return (
    <div className="min-h-screen min-h-[100dvh]">
      <nav className="sticky top-0 z-50 border-b border-ci-border bg-ci-card/95 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={() => router.push('/')} className="text-xl md:text-2xl font-bold text-ci-accent">CrimeIntel</button>
          <span className="text-[10px] md:text-xs bg-ci-accent/20 text-ci-accent px-1.5 md:px-2 py-0.5 rounded">7.0 Ω</span>
        </div>
        <div className="hidden lg:flex items-center gap-1">
          {links.map(l => (
            <button key={l.href} onClick={() => router.push(l.href)}
              className={`px-3 py-1.5 rounded text-sm transition ${current === l.href ? 'text-ci-accent bg-ci-accent/10 font-medium' : 'text-ci-muted hover:text-ci-text hover:bg-ci-border/30'}`}>
              {l.label}
            </button>
          ))}
          <div className="w-px h-5 bg-ci-border mx-2" />
          <button onClick={() => { api.clearToken(); router.push('/login'); }} className="text-ci-danger hover:text-red-300 transition text-sm px-2">Logout</button>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden flex flex-col gap-1.5 p-2 -mr-2" aria-label="Menu">
          <span className={`block w-5 h-0.5 bg-ci-text transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-ci-text transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-ci-text transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute right-0 top-0 h-full w-64 bg-ci-card border-l border-ci-border pt-16 px-4">
            <div className="space-y-1">
              {links.map(l => (
                <button key={l.href} onClick={() => { router.push(l.href); setMenuOpen(false); }}
                  className={`w-full text-left py-3 px-4 rounded-lg transition ${current === l.href ? 'text-ci-accent font-medium bg-ci-accent/10' : 'text-ci-text hover:bg-ci-border/50'}`}>
                  {l.label}
                </button>
              ))}
              <hr className="border-ci-border my-3" />
              <button onClick={() => { api.clearToken(); router.push('/login'); }} className="w-full text-left py-3 px-4 rounded-lg text-ci-danger hover:bg-red-500/10 transition">Logout</button>
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
