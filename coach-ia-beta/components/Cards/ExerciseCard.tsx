import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ExerciseSummary } from '../../lib/api/wger';
import { fallbackImageFor } from '../../lib/api/wger';

type Props = {
  exercise: ExerciseSummary;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

export function ExerciseCard({ exercise, isFavorite, onToggleFavorite }: Props) {
  const src = exercise.imageUrl ?? fallbackImageFor(exercise.name);
  return (
    <Pressable
      onPress={() => router.push(`/exercise/${exercise.id}`)}
      className="bg-maya-panel rounded-2xl border border-maya-border overflow-hidden mb-3"
      style={{ flex: 1 }}
    >
      <View className="aspect-square bg-maya-panelAlt">
        <Image
          source={{ uri: src }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={200}
        />
        {onToggleFavorite ? (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5"
            hitSlop={8}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorite ? '#ef4444' : '#78716c'}
            />
          </Pressable>
        ) : null}
      </View>
      <View className="p-3">
        <Text
          className="text-maya-text font-semibold text-sm"
          numberOfLines={2}
        >
          {exercise.name}
        </Text>
        <Text className="text-maya-muted text-xs mt-1" numberOfLines={1}>
          {exercise.categoryFr}
          {exercise.musclesFr.length > 0
            ? ` · ${exercise.musclesFr.slice(0, 2).join(', ')}`
            : ''}
        </Text>
      </View>
    </Pressable>
  );
}
