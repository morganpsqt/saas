import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUserStore } from '../../lib/store/user-store';
import { buildContext } from '../../lib/ai/context-builder';
import { resetDatabase } from '../../lib/db/schema';

export default function ProfileScreen() {
  const userId = useUserStore((s) => s.userId);
  const setUserId = useUserStore((s) => s.setUserId);
  const [dossier, setDossier] = useState<string>('');

  const load = useCallback(async () => {
    if (!userId) return;
    const { dossier } = await buildContext(userId);
    setDossier(dossier);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  function doReset() {
    const confirmLabel = 'Tout effacer ?';
    const action = async () => {
      await resetDatabase();
      setUserId(null);
      router.replace('/(onboarding)/step-1-identity');
    };
    if (Platform.OS === 'web') {
      // window.confirm fallback for web
      // eslint-disable-next-line no-alert
      if (typeof window !== 'undefined' && window.confirm(confirmLabel)) {
        action();
      }
    } else {
      Alert.alert(
        confirmLabel,
        'Ton dossier et tes messages seront supprimés.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Effacer', style: 'destructive', onPress: action },
        ]
      );
    }
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-maya-bg">
      <ScrollView className="flex-1 px-6 py-4">
        <Text className="text-maya-text text-2xl font-bold mb-1">Mon dossier</Text>
        <Text className="text-maya-muted text-sm mb-4">
          Ce que Maya voit et utilise pour te répondre.
        </Text>

        <View className="bg-maya-panel border border-maya-border rounded-xl p-4 mb-6">
          <Text
            className="text-maya-text text-sm"
            style={{ fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}
          >
            {dossier || 'Chargement…'}
          </Text>
        </View>

        <Pressable
          onPress={doReset}
          className="bg-maya-panel border border-maya-danger rounded-xl px-4 py-3 items-center"
        >
          <Text className="text-maya-danger font-semibold">Réinitialiser la DB</Text>
        </Pressable>
        <Text className="text-maya-muted text-xs mt-2 text-center">
          Efface ton dossier et toutes les conversations.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
