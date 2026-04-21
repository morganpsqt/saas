import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type Action = {
  key: string;
  emoji: string;
  label: string;
  onPress: () => void;
};

export function QuickActions() {
  const actions: Action[] = [
    {
      key: 'chat',
      emoji: '💬',
      label: 'Parler à Maya',
      onPress: () => router.push('/(tabs)/chat'),
    },
    {
      key: 'exercice-rapide',
      emoji: '⚡',
      label: 'Exo rapide ce soir',
      onPress: () =>
        router.push({
          pathname: '/(tabs)/chat',
          params: {
            prefill:
              "Propose-moi une séance rapide (20-30 min) pour ce soir, adaptée à mon dossier.",
          },
        }),
    },
    {
      key: 'idee-repas',
      emoji: '🍽️',
      label: 'Idée de repas',
      onPress: () =>
        router.push({
          pathname: '/(tabs)/chat',
          params: {
            prefill:
              "Donne-moi une idée de repas simple et sain pour aujourd'hui.",
          },
        }),
    },
    {
      key: 'exo-lib',
      emoji: '🏋️',
      label: 'Chercher un exo',
      onPress: () => router.push('/(tabs)/exercises'),
    },
  ];

  return (
    <View className="flex-row flex-wrap gap-3">
      {actions.map((a) => (
        <Pressable
          key={a.key}
          onPress={a.onPress}
          className="bg-maya-panel rounded-xl border border-maya-border p-3 flex-row items-center gap-2"
          style={{ flexBasis: '48%', flexGrow: 1 }}
        >
          <Text style={{ fontSize: 20 }}>{a.emoji}</Text>
          <Text className="text-maya-text font-semibold flex-1" numberOfLines={1}>
            {a.label}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#78716c" />
        </Pressable>
      ))}
    </View>
  );
}
