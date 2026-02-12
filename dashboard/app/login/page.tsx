'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const DEMO_ROLES = [
  { role: 'ADMIN', name: 'Commissario Ferretti', dept: 'Direzione Centrale', icon: '👑', desc: 'Accesso completo: utenti, sistema, tutti i moduli.', badge: 'bg-red-500/20 text-red-400', border: 'hover:border-red-500/50', features: ['Tutti i Moduli', 'Gestione Utenti', 'System Settings', 'Audit Log'] },
  { role: 'SUPERVISOR', name: 'Isp. Capo Verdi', dept: 'Squadra Mobile', icon: '🎖️', desc: 'Supervisione casi, assegnazione investigatori, report.', badge: 'bg-blue-500/20 text-blue-400', border: 'hover:border-blue-500/50', features: ['Supervisione Casi', 'AI Engine', 'Report', 'CrimeGraph'] },
  { role: 'INVESTIGATOR', name: 'Sov. Neri Sara', dept: 'Sezione Indagini', icon: '🔍', desc: 'Gestione casi propri, caricamento prove, analisi AI.', badge: 'bg-green-500/20 text-green-400', border: 'hover:border-green-500/50', features: ['Casi Propri', 'Upload Prove', 'AI Analysis', 'NeuroSearch'] },
  { role: 'ANALYST', name: 'Dott. Bianchi Luca', dept: 'Analisi Criminale', icon: '📊', desc: 'Analisi dati, report, intelligence predittiva.', badge: 'bg-purple-500/20 text-purple-400', border: 'hover:border-purple-500/50', features: ['Analytics', 'Report', 'Predictive Intel', 'CrimeGraph'] },
  { role: 'VIEWER', name: 'Dott.ssa Rossi Elena', dept: 'Magistratura', icon: '👁️', desc: 'Consultazione casi e prove in sola lettura.', badge: 'bg-gray-500/20 text-gray-400', border: 'hover:border-gray-400/50', features: ['Lettura Casi', 'Visualizza Prove', 'Consulta Report'] },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [view, setView] = useState<'login' | 'demo'>('login');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoRole = async (role: string) => {
    setError('');
    setDemoLoading(role);
    try {
      await api.demoLoginAs(role);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed');
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-3xl md:text-4xl font-bold text-ci-accent mb-1">CrimeIntel</h1>
          <p className="text-ci-muted text-sm">Forensic Intelligence Platform v7.0 Omega</p>
        </div>

        {/* Tab toggle */}
        <div className="flex justify-center gap-1 mb-5 bg-ci-card border border-ci-border rounded-lg p-1 max-w-xs mx-auto">
          <button onClick={() => setView('login')} className={`flex-1 px-4 py-2 rounded text-sm font-medium transition ${view === 'login' ? 'bg-ci-accent text-white' : 'text-ci-muted hover:text-ci-text'}`}>
            Accedi
          </button>
          <button onClick={() => setView('demo')} className={`flex-1 px-4 py-2 rounded text-sm font-medium transition ${view === 'demo' ? 'bg-purple-600 text-white' : 'text-ci-muted hover:text-ci-text'}`}>
            Prova Demo
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-ci-danger/10 border border-ci-danger/30 rounded text-ci-danger text-sm text-center max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* ══════════ LOGIN ══════════ */}
        {view === 'login' && (
          <div className="max-w-md mx-auto">
            <form onSubmit={handleLogin} className="bg-ci-card border border-ci-border rounded-lg p-6 md:p-8 ci-glow">
              <h2 className="text-lg font-semibold mb-5">Accedi al Sistema</h2>

              <div className="mb-4">
                <label className="block text-sm text-ci-muted mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mario@example.com"
                  className="w-full px-4 py-2.5 bg-ci-bg border border-ci-border rounded focus:border-ci-accent focus:outline-none transition text-ci-text" required />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-ci-muted mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="La tua password"
                  className="w-full px-4 py-2.5 bg-ci-bg border border-ci-border rounded focus:border-ci-accent focus:outline-none transition text-ci-text" required />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-ci-accent hover:bg-ci-accent-hover active:bg-blue-700 text-white font-medium rounded transition disabled:opacity-50">
                {loading ? 'Accesso...' : 'Accedi'}
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ci-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-ci-card px-3 text-ci-muted">oppure</span></div>
              </div>

              <button type="button" onClick={() => handleDemoRole('ADMIN')} disabled={!!demoLoading}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium rounded transition disabled:opacity-50 flex items-center justify-center gap-2">
                <span>👑</span>
                {demoLoading === 'ADMIN' ? 'Accesso Demo...' : 'Accesso Rapido Demo (Admin)'}
              </button>

              <p className="mt-4 text-xs text-ci-muted text-center">
                Vuoi provare tutti i ruoli?{' '}
                <button type="button" onClick={() => setView('demo')} className="text-purple-400 hover:underline font-medium">Scegli un profilo demo →</button>
              </p>

              <p className="mt-3 text-sm text-ci-muted text-center">
                Non hai un account?{' '}
                <button type="button" onClick={() => router.push('/register')} className="text-ci-accent hover:underline font-medium">Registrati</button>
              </p>
            </form>
          </div>
        )}

        {/* ══════════ DEMO ══════════ */}
        {view === 'demo' && (
          <div>
            {/* Banner */}
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4 mb-5 text-center max-w-lg mx-auto">
              <p className="text-purple-300 text-sm font-medium mb-1">Modalità Demo Completa</p>
              <p className="text-ci-muted text-xs">25 casi realistici, 156 prove, AI Engine 7 moduli, CrimeGraph, Predictive Intel, Report Center. Tutto offline, nessun backend.</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-5 max-w-lg mx-auto">
              {[
                { icon: '📂', v: '25 Casi', s: 'investigativi' },
                { icon: '🔍', v: '156 Prove', s: 'digitali' },
                { icon: '🤖', v: '7 Moduli', s: 'AI Engine' },
                { icon: '🕸️', v: '15 Nodi', s: 'CrimeGraph' },
                { icon: '🔮', v: '5 Zone', s: 'Predittive' },
                { icon: '📄', v: '8 Report', s: 'generati' },
              ].map(f => (
                <div key={f.v} className="bg-ci-card border border-ci-border rounded-lg p-2.5 text-center">
                  <span className="text-lg">{f.icon}</span>
                  <p className="text-xs font-bold mt-1">{f.v}</p>
                  <p className="text-[10px] text-ci-muted">{f.s}</p>
                </div>
              ))}
            </div>

            {/* Role cards */}
            <p className="text-xs uppercase tracking-wider text-ci-muted font-semibold text-center mb-3">Scegli il tuo profilo</p>
            <div className="space-y-2.5">
              {DEMO_ROLES.map(a => (
                <button key={a.role} onClick={() => handleDemoRole(a.role)} disabled={!!demoLoading}
                  className={`w-full bg-ci-card border border-ci-border rounded-lg p-4 text-left transition-all ${a.border} hover:bg-ci-border/20 disabled:opacity-60 group relative overflow-hidden`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl md:text-3xl flex-shrink-0">{a.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{a.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${a.badge}`}>{a.role}</span>
                        <span className="text-[10px] text-ci-muted hidden sm:inline">{a.dept}</span>
                      </div>
                      <p className="text-xs text-ci-muted mt-0.5">{a.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {a.features.map(f => (
                          <span key={f} className="text-[10px] px-1.5 py-0.5 bg-ci-bg border border-ci-border rounded text-ci-muted">{f}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0 self-center">
                      {demoLoading === a.role ? (
                        <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ci-muted group-hover:text-ci-text transition"><path d="M9 18l6-6-6-6" /></svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <p className="mt-5 text-sm text-ci-muted text-center">
              Hai un account?{' '}
              <button type="button" onClick={() => setView('login')} className="text-ci-accent hover:underline font-medium">← Torna al Login</button>
            </p>
          </div>
        )}

        <div className="mt-5 text-center text-[10px] text-ci-muted/40">CrimeIntel 7.0 Omega — Forensic AI Intelligence Platform</div>
      </div>
    </div>
  );
}
