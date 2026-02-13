'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { CrimeMind } from '@/components/CrimeMind';

const NAV_SECTIONS = [
  {
    title: 'Principale',
    items: [
      { href: '/', label: 'Command Center', icon: '🏠' },
      { href: '/cases', label: 'Gestione Casi', icon: '📂' },
      { href: '/search', label: 'NeuroSearch', icon: '🔍' },
    ],
  },
  {
    title: 'AI & Analisi',
    items: [
      { href: '/ai-engine', label: 'AI Engine', icon: '🤖' },
      { href: '/crimegraph', label: 'CrimeGraph', icon: '🕸️' },
      { href: '/predictive', label: 'Predictive Intel', icon: '🔮' },
      { href: '/analytics', label: 'Analytics', icon: '📊' },
    ],
  },
  {
    title: 'Documentazione',
    items: [
      { href: '/reports', label: 'Report Center', icon: '📄' },
      { href: '/competitors', label: 'Competitive Intel', icon: '⚔️' },
    ],
  },
  {
    title: 'Amministrazione',
    items: [
      { href: '/audit', label: 'Audit Log', icon: '📋' },
      { href: '/users', label: 'Gestione Utenti', icon: '👥' },
      { href: '/settings', label: 'Sistema & Sicurezza', icon: '🔐' },
      { href: '/security-dashboard', label: 'Security Center', icon: '🛡️' },
    ],
  },
];

const ALL_NAV_ITEMS = NAV_SECTIONS.flatMap(s => s.items);

export function NavShell({ children, current }: { children: React.ReactNode; current: string }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const currentLabel = ALL_NAV_ITEMS.find(i => i.href === current)?.label || '';

  const navigate = (href: string) => {
    router.push(href);
    setSidebarOpen(false);
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-2 px-4 py-5 border-b border-ci-border ${collapsed && !mobile ? 'justify-center' : ''}`}>
        <button onClick={() => navigate('/')} className="text-xl font-bold text-ci-accent">
          {collapsed && !mobile ? 'CI' : 'CrimeIntel'}
        </button>
        {!collapsed && !mobile && <span className="text-[10px] bg-ci-accent/20 text-ci-accent px-1.5 py-0.5 rounded">7.0 Ω</span>}
        {mobile && <span className="text-[10px] bg-ci-accent/20 text-ci-accent px-1.5 py-0.5 rounded">7.0 Ω</span>}
      </div>

      {/* Nav sections */}
      <div className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_SECTIONS.map(section => (
          <div key={section.title} className="mb-4">
            {(!collapsed || mobile) && (
              <p className="text-[10px] uppercase tracking-wider text-ci-muted font-semibold px-3 mb-1.5">{section.title}</p>
            )}
            {collapsed && !mobile && <div className="w-6 h-px bg-ci-border mx-auto mb-2" />}
            <div className="space-y-0.5">
              {section.items.map(item => {
                const active = current === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    title={collapsed && !mobile ? item.label : undefined}
                    className={`w-full flex items-center gap-3 rounded-lg transition-all duration-150 ${
                      collapsed && !mobile ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'
                    } ${active
                      ? 'bg-ci-accent/15 text-ci-accent font-medium border border-ci-accent/30'
                      : 'text-ci-muted hover:text-ci-text hover:bg-ci-border/40 border border-transparent'
                    }`}
                  >
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    {(!collapsed || mobile) && <span className="text-sm truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Demo mode banner */}
      {api.getToken() === 'demo-offline-token' && (!collapsed || mobile) && (
        <div className="mx-2 mb-1 px-3 py-1.5 bg-purple-600/15 border border-purple-500/30 rounded text-center">
          <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Demo Mode</p>
        </div>
      )}

      {/* Bottom: user + logout */}
      <div className={`border-t border-ci-border p-3 ${collapsed && !mobile ? 'px-2' : ''}`}>
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-ci-accent/20 flex items-center justify-center text-ci-accent font-bold text-xs flex-shrink-0">
              {(api.getCurrentDemoUser()?.name || 'U').charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{api.getCurrentDemoUser()?.name || 'Utente'}</p>
              <p className="text-[10px] text-ci-muted truncate">{api.getCurrentDemoUser()?.role || ''}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => { api.clearToken(); router.push('/login'); }}
          title={collapsed && !mobile ? 'Logout' : undefined}
          className={`w-full flex items-center gap-2 text-ci-danger hover:bg-red-500/10 rounded-lg transition text-sm ${
            collapsed && !mobile ? 'justify-center px-2 py-2.5' : 'px-3 py-2'
          }`}
        >
          <span>🚪</span>
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen min-h-[100dvh] flex">
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col fixed top-0 left-0 h-full bg-ci-card border-r border-ci-border z-40 transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-60'
      }`}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-7 w-6 h-6 bg-ci-card border border-ci-border rounded-full flex items-center justify-center text-ci-muted hover:text-ci-text hover:bg-ci-border transition text-xs z-50"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-ci-card/95 backdrop-blur-sm border-b border-ci-border px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => setSidebarOpen(true)} className="p-1 -ml-1 flex-shrink-0" aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ci-text">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <span className="text-base font-bold text-ci-accent flex-shrink-0">CI</span>
          {currentLabel && (
            <>
              <span className="text-ci-muted text-xs">/</span>
              <span className="text-xs font-medium text-ci-text truncate">{currentLabel}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {api.getToken() === 'demo-offline-token' && (
            <span className="text-[9px] bg-purple-600/20 text-purple-400 px-1.5 py-0.5 rounded font-bold">DEMO</span>
          )}
          <div className="w-7 h-7 rounded-full bg-ci-accent/20 flex items-center justify-center text-ci-accent font-bold text-[10px]">
            {(api.getCurrentDemoUser()?.name || 'U').charAt(0)}
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute left-0 top-0 h-full w-64 bg-ci-card border-r border-ci-border" onClick={e => e.stopPropagation()}>
            <SidebarContent mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`flex-1 transition-all duration-200 ${collapsed ? 'md:ml-16' : 'md:ml-60'} mt-14 md:mt-0`}>
        {children}
      </div>

      {/* CrimeMind AI floating assistant */}
      <CrimeMind />
    </div>
  );
}
