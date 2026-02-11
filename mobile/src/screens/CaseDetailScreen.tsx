import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import mobileApi from '../api/client';

export default function CaseDetailScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCase();
  }, [id]);

  const loadCase = async () => {
    setLoading(true);
    try {
      const res = await mobileApi.getCase(id);
      setCaseData(res.data);
    } catch (err: any) {
      Alert.alert('Error', err.message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#3b82f6" /></View>;
  }

  if (!caseData) {
    return <View style={styles.center}><Text style={styles.errorText}>Case not found</Text></View>;
  }

  const statusColor: Record<string, string> = {
    OPEN: '#f59e0b', ACTIVE: '#22c55e', CLOSED: '#9ca3af', ARCHIVED: '#6b7280',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.caseNumber}>{caseData.caseNumber}</Text>
        <Text style={[styles.status, { color: statusColor[caseData.status] || '#9ca3af' }]}>{caseData.status}</Text>
      </View>

      <Text style={styles.title}>{caseData.title}</Text>
      {caseData.description && <Text style={styles.description}>{caseData.description}</Text>}

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Priority: {caseData.priority}</Text>
        {caseData.locationName && <Text style={styles.metaText}>{caseData.locationName}</Text>}
      </View>

      <TouchableOpacity
        style={styles.captureBtn}
        onPress={() => navigation.navigate('Capture', { caseId: id })}
      >
        <Text style={styles.captureBtnText}>Capture Evidence</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Evidence ({caseData.evidence?.length || 0})</Text>

      {caseData.evidence?.length === 0 ? (
        <Text style={styles.emptyText}>No evidence uploaded yet</Text>
      ) : (
        caseData.evidence?.map((ev: any) => (
          <View key={ev.id} style={styles.evidenceCard}>
            <View style={styles.evHeader}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{ev.type}</Text>
              </View>
              <Text style={[styles.aiStatus, {
                color: ev.aiStatus === 'COMPLETED' ? '#22c55e' : ev.aiStatus === 'PROCESSING' ? '#f59e0b' : '#9ca3af'
              }]}>{ev.aiStatus}</Text>
            </View>
            <Text style={styles.fileName}>{ev.fileName}</Text>
            <Text style={styles.fileInfo}>
              {(ev.fileSize / 1024).toFixed(1)}KB · {ev.hash?.substring(0, 12)}...
            </Text>
          </View>
        ))
      )}

      {caseData.fusion && (
        <View style={styles.fusionCard}>
          <Text style={styles.sectionTitle}>HyperFusion</Text>
          <View style={styles.fusionRow}>
            <View style={styles.fusionStat}>
              <Text style={styles.fusionValue}>{(caseData.fusion.fusionScore * 100).toFixed(0)}%</Text>
              <Text style={styles.fusionLabel}>Score</Text>
            </View>
            <View style={styles.fusionStat}>
              <Text style={styles.fusionValue}>{(caseData.fusion.confidence * 100).toFixed(0)}%</Text>
              <Text style={styles.fusionLabel}>Confidence</Text>
            </View>
            <View style={styles.fusionStat}>
              <Text style={styles.fusionValue}>{caseData.fusion.version}</Text>
              <Text style={styles.fusionLabel}>Version</Text>
            </View>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0e1a' },
  errorText: { color: '#ef4444', fontSize: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  caseNumber: { fontSize: 13, color: '#9ca3af', fontFamily: 'monospace' },
  status: { fontSize: 13, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#e5e7eb', marginBottom: 6 },
  description: { fontSize: 14, color: '#9ca3af', marginBottom: 12, lineHeight: 20 },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  metaText: { fontSize: 12, color: '#6b7280' },
  captureBtn: { backgroundColor: '#3b82f6', borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 20 },
  captureBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: '#e5e7eb', marginBottom: 10, marginTop: 8 },
  emptyText: { color: '#6b7280', fontSize: 14, textAlign: 'center', paddingVertical: 20 },
  evidenceCard: { backgroundColor: '#111827', borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#1f2937' },
  evHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  typeBadge: { backgroundColor: 'rgba(59,130,246,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  typeText: { color: '#3b82f6', fontSize: 11, fontWeight: '600' },
  aiStatus: { fontSize: 11, fontWeight: '600' },
  fileName: { color: '#e5e7eb', fontSize: 14, fontWeight: '500' },
  fileInfo: { color: '#6b7280', fontSize: 11, marginTop: 3 },
  fusionCard: { backgroundColor: '#111827', borderRadius: 10, padding: 16, marginTop: 8, borderWidth: 1, borderColor: '#1f2937' },
  fusionRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  fusionStat: { alignItems: 'center' },
  fusionValue: { fontSize: 20, fontWeight: 'bold', color: '#a855f7' },
  fusionLabel: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
});
