import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUserStore } from '../../lib/store/user-store';
import { buildContext } from '../../lib/ai/context-builder';
import { resetDatabase } from '../../lib/db/schema';
import { clearApiCache } from '../../lib/api/cache';
import { isMockMode } from '../../lib/ai/gemini';

export default function ProfileScreen() {
  const userId = useUserStore((s) => s.userId);
  const setUserId = useUserStore((s) => s.setUserId);
  const [dossier, setDossier] = useState<string>('');
  const [cacheMsg, setCacheMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    const { dossier } = await buildContext(userId);
    setDossier(dossier);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  function confirmAsync(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (Platform.OS === 'web') {
        resolve(typeof window !== 'undefined' && window.confirm(message));
      } else {
        Alert.alert('Confirmer', message, [
          { text: 'Annuler', style: 'cancel', onPress: () => resolve(false) },
          { text: 'OK', style: 'destructive', onPress: () => resolve(true) },
        ]);
      }
    });
  }

  async function doReset() {
    const ok = await confirmAsync('Effacer tout ton dossier et tes messages ?');
    if (!ok) return;
    await resetDatabase();
    setUserId(null);
    router.replace('/(onboarding)/step-1-identity');
  }

  async function doClearApiCache() {
    const n = await clearApiCache();
    setCacheMsg(`Cache vidé — ${n} entrée(s) supprimée(s)`);
    setTimeout(() => setCacheMsg(null), 3000);
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-maya-bg">
      <ScrollView className="flex-1 px-6 py-4" contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="text-maya-text text-2xl font-bold mb-1">Mon dossier</Text>
        <Text className="text-maya-muted text-sm mb-4">
          Ce que Maya voit et utilise pour te répondre.
        </Text>

        <View className="bg-maya-panel border border-maya-border rounded-2xl p-4 mb-6 shadow-sm">
          <Text
            className="text-maya-text text-sm"
            style={{ fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}
          >
            {dossier || 'Chargement…'}
          </Text>
        </View>

        <Text className="text-maya-text text-lg font-bold mb-2">Mode IA</Text>
        <View
          className={`rounded-xl px-4 py-3 mb-6 ${
            isMockMode ? 'bg-maya-orangeSoft' : 'bg-maya-accentSoft'
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              isMockMode ? 'text-maya-orange' : 'text-maya-accentDark'
            }`}
          >
            {isMockMode
              ? '🔶 Mode démo — aucune clé Gemini détectée. Réponses simulées.'
              : '🟢 Gemini 2.5 Flash actif'}
          </Text>
          {isMockMode ? (
            <Text className="text-maya-muted text-xs mt-1">
              Ajoute EXPO_PUBLIC_GEMINI_API_KEY dans .env.local puis redémarre.
            </Text>
          ) : null}
        </View>

        <Text className="text-maya-text text-lg font-bold mb-2">Paramètres</Text>

        <Pressable
          onPress={doClearApiCache}
          className="bg-maya-panel border border-maya-border rounded-xl px-4 py-3 mb-3 flex-row justify-between items-center"
        >
          <View className="flex-1">
            <Text className="text-maya-text font-semibold">Vider le cache API</Text>
            <Text className="text-maya-muted text-xs mt-0.5">
              Force un rechargement des exercices & recettes.
            </Text>
          </View>
          <Text className="text-maya-accent">→</Text>
        </Pressable>
        {cacheMsg ? (
          <Text className="text-maya-success text-xs mb-3">{cacheMsg}</Text>
        ) : null}

        <Pressable
          onPress={doReset}
          className="bg-maya-panel border border-maya-danger rounded-xl px-4 py-3 items-center mt-4"
        >
          <Text className="text-maya-danger font-semibold">Réinitialiser la DB</Text>
        </Pressable>
        <Text className="text-maya-muted text-xs mt-2 text-center">
          Efface ton dossier, tes messages, tes favoris, ton suivi.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
