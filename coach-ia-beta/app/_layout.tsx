import '../global.css';
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import { initDatabase } from '../lib/db/schema';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initDatabase()
      .then(() => setReady(true))
      .catch((e) => setError(String(e?.message ?? e)));
  }, []);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-maya-bg p-6">
        <Text className="text-maya-danger text-base">Erreur DB : {error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-maya-bg">
        <ActivityIndicator color="#10b981" />
        <Text className="text-maya-muted mt-3">Préparation…</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#1c1917',
          contentStyle: { backgroundColor: '#fafaf9' },
          headerTitleStyle: { color: '#1c1917', fontWeight: '700' },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="exercise/[id]" options={{ title: 'Exercice' }} />
        <Stack.Screen name="recipe/[id]" options={{ title: 'Recette' }} />
        <Stack.Screen name="knowledge/[slug]" options={{ title: 'Savoir' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
