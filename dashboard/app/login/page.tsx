'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@crimeintel.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-ci-accent mb-2">CrimeIntel</h1>
          <p className="text-ci-muted">Forensic Intelligence Platform v7.0 Ω</p>
        </div>

        <form onSubmit={handleLogin} className="bg-ci-card border border-ci-border rounded-lg p-8 ci-glow">
          <h2 className="text-xl font-semibold mb-6">Sign In</h2>

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
              className="w-full px-4 py-2.5 bg-ci-bg border border-ci-border rounded focus:border-ci-accent focus:outline-none transition text-ci-text"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-ci-accent hover:bg-ci-accent-hover text-white font-medium rounded transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="mt-4 text-xs text-ci-muted text-center">
            Demo: admin@crimeintel.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
