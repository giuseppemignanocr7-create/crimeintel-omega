'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supa } from '@/lib/supabase-api';

// ── useRealtimeCases: live case updates ──
export function useRealtimeCases(onUpdate?: (payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => void) {
  const [lastEvent, setLastEvent] = useState<{ eventType: string; caseId: string; timestamp: string } | null>(null);
  const channelRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    const channel = supa.subscribeToCases((payload) => {
      const caseId = (payload.new?.id || payload.old?.id || '') as string;
      setLastEvent({ eventType: payload.eventType, caseId, timestamp: new Date().toISOString() });
      onUpdate?.(payload);
    });
    channelRef.current = channel;
    return () => { supa.unsubscribe(channel); };
  }, [onUpdate]);

  return { lastEvent, unsubscribe: () => supa.unsubscribe(channelRef.current) };
}

// ── useRealtimeEvidence: live evidence updates for a specific case ──
export function useRealtimeEvidence(caseId: string, onUpdate?: (payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => void) {
  const [lastEvent, setLastEvent] = useState<{ eventType: string; evidenceId: string; timestamp: string } | null>(null);
  const channelRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    if (!caseId) return;
    const channel = supa.subscribeToEvidence(caseId, (payload) => {
      const evidenceId = (payload.new?.id || payload.old?.id || '') as string;
      setLastEvent({ eventType: payload.eventType, evidenceId, timestamp: new Date().toISOString() });
      onUpdate?.(payload);
    });
    channelRef.current = channel;
    return () => { supa.unsubscribe(channel); };
  }, [caseId, onUpdate]);

  return { lastEvent, unsubscribe: () => supa.unsubscribe(channelRef.current) };
}

// ── useRealtimeNotifications: live notification feed ──
export function useRealtimeNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Record<string, unknown>[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const channelRef = useRef<{ unsubscribe: () => void } | null>(null);

  // Load initial notifications
  useEffect(() => {
    if (!userId) return;
    supa.getNotifications().then(data => {
      if (data) setNotifications(data as Record<string, unknown>[]);
    });
    supa.getUnreadCount().then(count => setUnreadCount(count));
  }, [userId]);

  // Subscribe to new notifications
  useEffect(() => {
    if (!userId) return;
    const channel = supa.subscribeToNotifications(userId, (payload) => {
      setNotifications(prev => [payload.new, ...prev]);
      setUnreadCount(prev => prev + 1);
    });
    channelRef.current = channel;
    return () => { supa.unsubscribe(channel); };
  }, [userId]);

  const markAsRead = useCallback(async (ids: string[]) => {
    await supa.markNotificationsRead(ids);
    setNotifications(prev => prev.map(n =>
      ids.includes(n.id as string) ? { ...n, read_at: new Date().toISOString() } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - ids.length));
  }, []);

  const markAllRead = useCallback(async () => {
    await supa.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    setUnreadCount(0);
  }, []);

  const dismiss = useCallback(async (id: string) => {
    await supa.dismissNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => {
      const wasUnread = notifications.find(n => n.id === id && !n.read_at);
      return wasUnread ? Math.max(0, prev - 1) : prev;
    });
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllRead,
    dismiss,
    unsubscribe: () => supa.unsubscribe(channelRef.current),
  };
}

// ── useRealtimeAudit: live audit log stream ──
export function useRealtimeAudit(maxEvents = 50) {
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
  const channelRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    const channel = supa.subscribeToAuditLog((payload) => {
      setEvents(prev => [payload.new, ...prev].slice(0, maxEvents));
    });
    channelRef.current = channel;
    return () => { supa.unsubscribe(channel); };
  }, [maxEvents]);

  return { events, unsubscribe: () => supa.unsubscribe(channelRef.current) };
}

// ── usePresence: track online users ──
export function usePresence(userId: string, userData: { name: string; role: string }) {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, unknown>[]>([]);
  const channelRef = useRef<ReturnType<typeof supa.trackPresence>>(null);

  useEffect(() => {
    if (!userId) return;
    const channel = supa.trackPresence(userId, userData);
    if (!channel) return;

    channelRef.current = channel;

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const users = Object.values(state).flat() as Record<string, unknown>[];
      setOnlineUsers(users);
    });

    return () => { channel.unsubscribe(); };
  }, [userId, userData]);

  return { onlineUsers, count: onlineUsers.length };
}
