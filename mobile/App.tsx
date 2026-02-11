import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from './src/stores/authStore';
import LoginScreen from './src/screens/LoginScreen';
import CasesScreen from './src/screens/CasesScreen';
import CaseDetailScreen from './src/screens/CaseDetailScreen';
import CaptureScreen from './src/screens/CaptureScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#111827' },
  headerTintColor: '#e5e7eb',
  headerTitleStyle: { fontWeight: 'bold' as const },
  contentStyle: { backgroundColor: '#0a0e1a' },
};

export default function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
          {!isAuthenticated ? (
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          ) : (
            <>
              <Stack.Screen name="Cases" component={CasesScreen} options={{ title: 'CrimeIntel 7.0' }} />
              <Stack.Screen name="CaseDetail" component={CaseDetailScreen} options={{ title: 'Case Detail' }} />
              <Stack.Screen name="Capture" component={CaptureScreen} options={{ title: 'Capture Evidence' }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
