import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../stores/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('admin@crimeintel.com');
  const [password, setPassword] = useState('admin123');
  const { login, loading, error } = useAuthStore();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>CrimeIntel</Text>
        <Text style={styles.subtitle}>Forensic Intelligence v7.0 Ω</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={() => login(email, password)} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.demo}>Demo: admin@crimeintel.com / admin123</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 400, backgroundColor: '#111827', borderRadius: 12, padding: 24, borderWidth: 1, borderColor: '#1f2937' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#3b82f6', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center', marginBottom: 24 },
  error: { color: '#ef4444', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  input: { backgroundColor: '#0a0e1a', borderWidth: 1, borderColor: '#1f2937', borderRadius: 8, padding: 14, color: '#e5e7eb', fontSize: 16, marginBottom: 12 },
  button: { backgroundColor: '#3b82f6', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  demo: { color: '#6b7280', fontSize: 12, textAlign: 'center', marginTop: 16 },
});
