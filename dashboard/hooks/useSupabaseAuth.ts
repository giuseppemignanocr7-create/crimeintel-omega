'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { supa } from '@/lib/supabase-api';
import type { Session, User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  avatar_url: string | null;
  phone: string | null;
  department: string | null;
  last_login: string | null;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export function useSupabaseAuth() {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  const loadProfile = useCallback(async () => {
    try {
      const profile = await supa.getProfile();
      setState(prev => ({ ...prev, profile: profile as Profile | null }));
    } catch {
      // Profile load failure is non-critical
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false,
      }));
      if (session?.user) loadProfile();
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }));
        if (session?.user) {
          loadProfile();
        } else {
          setState(prev => ({ ...prev, profile: null }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await supa.signIn(email, password);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setState(prev => ({ ...prev, error: message, loading: false }));
      throw err;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string, role = 'VIEWER') => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await supa.signUp(email, password, name, role);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setState(prev => ({ ...prev, error: message, loading: false }));
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    await supa.signOut();
    setState({ session: null, user: null, profile: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    isAuthenticated: !!state.session,
    isAdmin: state.profile?.role === 'ADMIN',
    isSupervisor: state.profile?.role === 'SUPERVISOR',
    isAdminOrSupervisor: state.profile?.role === 'ADMIN' || state.profile?.role === 'SUPERVISOR',
    signIn,
    signUp,
    signOut,
    refreshProfile: loadProfile,
  };
}
