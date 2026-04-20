import { useEffect } from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { router } from 'expo-router';
import { getFirstProfile } from '../lib/db/queries';
import { useUserStore } from '../lib/store/user-store';

export default function Index() {
  const setUserId = useUserStore((s) => s.setUserId);

  useEffect(() => {
    (async () => {
      const profile = await getFirstProfile();
      if (profile) {
        setUserId(profile.id);
        router.replace('/(main)/chat');
      } else {
        router.replace('/(onboarding)/step-1-identity');
      }
    })();
  }, [setUserId]);

  return (
    <View className="flex-1 items-center justify-center bg-maya-bg">
      <Text className="text-maya-accent text-4xl font-bold mb-2">Maya</Text>
      <Text className="text-maya-muted mb-6">Ton coach fitness & nutrition</Text>
      <ActivityIndicator color="#22D3EE" />
      <Pressable
        onPress={() => router.replace('/(onboarding)/step-1-identity')}
        className="mt-8 px-4 py-2"
      >
        <Text className="text-maya-muted text-xs underline">Passer au démarrage</Text>
      </Pressable>
    </View>
  );
}
