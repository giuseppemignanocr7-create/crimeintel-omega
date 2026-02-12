'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

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

  const handleDemo = async () => {
    setError('');
    setDemoLoading(true);
    try {
      await api.demoLogin();
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-ci-accent mb-2">CrimeIntel</h1>
          <p className="text-ci-muted text-sm md:text-base">Forensic Intelligence Platform v7.0 Ω</p>
        </div>

        <form onSubmit={handleLogin} className="bg-ci-card border border-ci-border rounded-lg p-6 md:p-8 ci-glow">
          <h2 className="text-lg md:text-xl font-semibold mb-5 md:mb-6">Accedi</h2>

          {error && (
            <div className="mb-4 p-3 bg-ci-danger/10 border border-ci-danger/30 rounded text-ci-danger text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm text-ci-muted mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mario@example.com"
              className="w-full px-4 py-2.5 bg-ci-bg border border-ci-border rounded focus:border-ci-accent focus:outline-none transition text-ci-text"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-ci-muted mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="La tua password"
              className="w-full px-4 py-2.5 bg-ci-bg border border-ci-border rounded focus:border-ci-accent focus:outline-none transition text-ci-text"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-ci-accent hover:bg-ci-accent-hover active:bg-blue-700 text-white font-medium rounded transition disabled:opacity-50"
          >
            {loading ? 'Accesso...' : 'Accedi'}
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ci-border"></div></div>
            <div className="relative flex justify-center text-xs"><span className="bg-ci-card px-3 text-ci-muted">oppure</span></div>
          </div>

          <button
            type="button"
            onClick={handleDemo}
            disabled={demoLoading}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium rounded transition disabled:opacity-50"
          >
            {demoLoading ? 'Accesso...' : 'Entra come Ospite (Demo)'}
          </button>

          <p className="mt-5 text-sm text-ci-muted text-center">
            Non hai un account?{' '}
            <button type="button" onClick={() => router.push('/register')} className="text-ci-accent hover:underline font-medium">
              Registrati
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
