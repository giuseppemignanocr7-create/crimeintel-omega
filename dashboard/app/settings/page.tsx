'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { NavShell } from '@/components/NavShell';
import { DEMO_SYSTEM } from '@/lib/mock-data';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    if (!token) { router.push('/login'); return; }
    setLoading(false);
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen min-h-[100dvh]"><div className="animate-pulse text-ci-accent">Loading...</div></div>;

  const { encryption, compliance, infrastructure, rbac } = DEMO_SYSTEM;

  const complianceColor: Record<string, string> = {
    COMPLIANT: 'text-green-400', ACTIVE: 'text-cyan-400', PARTIAL: 'text-yellow-400', NON_COMPLIANT: 'text-red-400',
  };

  return (
    <NavShell current="/settings">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <h1 className="text-xl md:text-3xl font-bold mb-1">Sistema & Sicurezza</h1>
        <p className="text-ci-muted text-xs md:text-sm mb-5">Encryption, compliance, infrastruttura e RBAC</p>

        {/* Services Status */}
        <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm md:text-base font-semibold">Stato Servizi</h2>
            <span className="text-xs text-green-400 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Uptime: {infrastructure.uptime}%
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {infrastructure.services.map(s => (
              <div key={s.name} className="bg-ci-bg border border-ci-border rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-[10px] text-ci-muted">Latency: {s.latency}ms • {s.uptime}%</p>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${s.status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-ci-muted">
            <span>Deploy: {infrastructure.deployment}</span>
            <span>DB: {infrastructure.database}</span>
            <span>AI: {infrastructure.aiCluster}</span>
            <span>Storage: {infrastructure.storage}</span>
            <span>Graph: {infrastructure.graphDb}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Encryption */}
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-4 flex items-center gap-2">🔐 Military-Grade Encryption</h2>
            <div className="space-y-3">
              {[
                { label: 'Encryption at Rest', value: encryption.atRest, icon: '💾' },
                { label: 'Encryption in Transit', value: encryption.inTransit, icon: '🌐' },
                { label: 'Certificates', value: encryption.certificates, icon: '📜' },
                { label: 'Hash Algorithm', value: encryption.hashAlgorithm, icon: '#️⃣' },
                { label: 'Password Hashing', value: encryption.passwordHashing, icon: '🔑' },
              ].map(e => (
                <div key={e.label} className="flex items-center justify-between bg-ci-bg border border-ci-border rounded p-3">
                  <div className="flex items-center gap-2">
                    <span>{e.icon}</span>
                    <span className="text-sm text-ci-muted">{e.label}</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-green-400">{e.value}</span>
                </div>
              ))}
              <div className="bg-ci-bg border border-ci-border rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-ci-muted">🔄 Key Rotation</span>
                  <span className="text-xs text-ci-muted">Ogni {encryption.keyRotationDays} giorni</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Ultima: {new Date(encryption.lastRotation).toLocaleDateString('it-IT')}</span>
                  <span className="text-green-400">Prossima: {encryption.nextRotation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance */}
          <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-4 flex items-center gap-2">✅ Compliance & Certificazioni</h2>
            <div className="space-y-3">
              {compliance.map(c => (
                <div key={c.name} className="bg-ci-bg border border-ci-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{c.name}</span>
                    <span className={`text-xs font-bold ${complianceColor[c.status]}`}>{c.status}</span>
                  </div>
                  <div className="h-2 bg-ci-card rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full ${c.score >= 95 ? 'bg-green-500' : c.score >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${c.score}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-ci-muted">
                    <span>Score: {c.score}/100</span>
                    <span>Ultimo audit: {new Date(c.lastAudit).toLocaleDateString('it-IT')}</span>
                  </div>
                  <p className="text-[10px] text-ci-muted mt-1">{c.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RBAC */}
        <div className="bg-ci-card border border-ci-border rounded-lg p-4 md:p-6">
          <h2 className="text-sm md:text-base font-semibold mb-4 flex items-center gap-2">🛡️ Role-Based Access Control (RBAC)</h2>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ci-muted bg-ci-bg">
                  <th className="px-4 py-3">Ruolo</th>
                  <th className="px-4 py-3">Utenti</th>
                  <th className="px-4 py-3">Permessi</th>
                </tr>
              </thead>
              <tbody>
                {rbac.roles.map(r => (
                  <tr key={r.name} className="border-t border-ci-border/50">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-sm">{r.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-ci-accent font-bold">{r.users}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {r.permissions.map(p => (
                          <span key={p} className="text-[10px] px-2 py-0.5 bg-ci-bg border border-ci-border rounded-full font-mono">{p}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {rbac.roles.map(r => (
              <div key={r.name} className="bg-ci-bg border border-ci-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{r.name}</span>
                  <span className="text-xs text-ci-accent font-bold">{r.users} utenti</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {r.permissions.map(p => (
                    <span key={p} className="text-[10px] px-1.5 py-0.5 bg-ci-card border border-ci-border rounded-full font-mono">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
          {[
            { title: 'Zero-Knowledge Proofs', desc: 'Verifica integrità prove senza rivelare contenuto', status: 'ACTIVE', icon: '🔒' },
            { title: 'Hashchain Custody', desc: 'Chain-of-custody con SHA-512 hashchain immutabile', status: 'ACTIVE', icon: '⛓️' },
            { title: 'MFA (TOTP)', desc: 'Autenticazione multi-fattore con token temporali', status: 'ACTIVE', icon: '📲' },
            { title: 'Anti-Replay', desc: 'Protezione contro attacchi di replay su API', status: 'ACTIVE', icon: '🛡️' },
            { title: 'Digital Signatures', desc: 'Firma digitale su report ed export forensi', status: 'ACTIVE', icon: '✍️' },
            { title: 'Audit Trail', desc: 'Tracciamento completo di ogni operazione', status: 'ACTIVE', icon: '📋' },
          ].map(f => (
            <div key={f.title} className="bg-ci-card border border-ci-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{f.icon}</span>
                <span className="font-semibold text-sm">{f.title}</span>
              </div>
              <p className="text-xs text-ci-muted mb-2">{f.desc}</p>
              <span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-400 rounded font-medium">{f.status}</span>
            </div>
          ))}
        </div>
      </main>
    </NavShell>
  );
}
