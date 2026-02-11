import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import mobileApi from '../api/client';
import { useAuthStore } from '../stores/authStore';

export default function CasesScreen({ navigation }: any) {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const { logout } = useAuthStore();

  const fetchData = useCallback(async () => {
    try {
      const [casesRes, statsRes] = await Promise.all([
        mobileApi.getCases(),
        mobileApi.getCaseStats(),
      ]);
      setCases(casesRes.data.items || []);
      setStats(statsRes.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const statusColor: Record<string, string> = {
    OPEN: '#f59e0b', ACTIVE: '#22c55e', CLOSED: '#9ca3af', ARCHIVED: '#6b7280',
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#3b82f6" /></View>;
  }

  return (
    <View style={styles.container}>
      {stats && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statValue}>{stats.total}</Text><Text style={styles.statLabel}>Total</Text></View>
          <View style={styles.statCard}><Text style={[styles.statValue, { color: '#f59e0b' }]}>{stats.open}</Text><Text style={styles.statLabel}>Open</Text></View>
          <View style={styles.statCard}><Text style={[styles.statValue, { color: '#22c55e' }]}>{stats.active}</Text><Text style={styles.statLabel}>Active</Text></View>
          <View style={styles.statCard}><Text style={[styles.statValue, { color: '#a855f7' }]}>{stats.evidence}</Text><Text style={styles.statLabel}>Evidence</Text></View>
        </View>
      )}

      <FlatList
        data={cases}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.caseCard} onPress={() => navigation.navigate('CaseDetail', { id: item.id })}>
            <View style={styles.caseHeader}>
              <Text style={styles.caseNumber}>{item.caseNumber}</Text>
              <Text style={[styles.caseStatus, { color: statusColor[item.status] || '#9ca3af' }]}>{item.status}</Text>
            </View>
            <Text style={styles.caseTitle}>{item.title}</Text>
            {item.description && <Text style={styles.caseDesc} numberOfLines={2}>{item.description}</Text>}
            <View style={styles.caseMeta}>
              <Text style={styles.metaText}>{item._count?.evidence || 0} evidence</Text>
              <Text style={styles.metaText}>{item.priority}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No cases found</Text>}
      />

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0e1a' },
  statsRow: { flexDirection: 'row', padding: 12, gap: 8 },
  statCard: { flex: 1, backgroundColor: '#111827', borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#1f2937' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#3b82f6' },
  statLabel: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  caseCard: { backgroundColor: '#111827', marginHorizontal: 12, marginVertical: 4, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#1f2937' },
  caseHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  caseNumber: { fontSize: 12, color: '#9ca3af', fontFamily: 'monospace' },
  caseStatus: { fontSize: 12, fontWeight: '600' },
  caseTitle: { fontSize: 16, fontWeight: '600', color: '#e5e7eb', marginBottom: 4 },
  caseDesc: { fontSize: 13, color: '#9ca3af', marginBottom: 6 },
  caseMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  metaText: { fontSize: 11, color: '#6b7280' },
  empty: { color: '#9ca3af', textAlign: 'center', marginTop: 40, fontSize: 16 },
  logoutBtn: { padding: 16, alignItems: 'center' },
  logoutText: { color: '#ef4444', fontSize: 14 },
});
