import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import mobileApi from '../api/client';

export default function CaptureScreen({ route, navigation }: any) {
  const { caseId } = route.params;
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [location, setLocation] = useState<any>(null);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is needed to capture evidence');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
      await getLocation();
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
      await getLocation();
    }
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }
    } catch {
      // Location not available
    }
  };

  const uploadEvidence = async () => {
    if (!image) return;
    setUploading(true);
    try {
      const fileName = image.split('/').pop() || 'evidence.jpg';
      const mimeType = fileName.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg';

      await mobileApi.uploadEvidence(caseId, image, fileName, mimeType);
      Alert.alert('Success', 'Evidence uploaded successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Upload Failed', err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capture Evidence</Text>
      <Text style={styles.subtitle}>Case: {caseId.substring(0, 8)}...</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={takePhoto}>
          <Text style={styles.actionIcon}>📷</Text>
          <Text style={styles.actionText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={pickImage}>
          <Text style={styles.actionIcon}>🖼</Text>
          <Text style={styles.actionText}>Pick from Gallery</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <View style={styles.preview}>
          <Image source={{ uri: image }} style={styles.previewImage} />

          {location && (
            <Text style={styles.locationText}>
              GPS: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.uploadBtn, uploading && styles.uploadBtnDisabled]}
            onPress={uploadEvidence}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.uploadBtnText}>Upload Evidence</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {!image && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No evidence captured yet</Text>
          <Text style={styles.placeholderHint}>Take a photo or pick from gallery</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#e5e7eb', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#9ca3af', marginBottom: 20, fontFamily: 'monospace' },
  actions: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  actionBtn: { flex: 1, backgroundColor: '#111827', borderRadius: 12, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#1f2937' },
  actionIcon: { fontSize: 28, marginBottom: 8 },
  actionText: { color: '#e5e7eb', fontSize: 13, fontWeight: '500' },
  preview: { alignItems: 'center' },
  previewImage: { width: '100%', height: 300, borderRadius: 12, marginBottom: 12, backgroundColor: '#111827' },
  locationText: { color: '#9ca3af', fontSize: 12, marginBottom: 16, fontFamily: 'monospace' },
  uploadBtn: { backgroundColor: '#3b82f6', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 40, alignItems: 'center', width: '100%' },
  uploadBtnDisabled: { opacity: 0.5 },
  uploadBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#6b7280', fontSize: 16, marginBottom: 4 },
  placeholderHint: { color: '#4b5563', fontSize: 13 },
});
