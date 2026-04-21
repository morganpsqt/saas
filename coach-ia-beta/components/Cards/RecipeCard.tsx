import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { MealSummary } from '../../lib/api/themealdb';
import { fallbackImageFor } from '../../lib/api/themealdb';

type Props = {
  meal: MealSummary;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

export function RecipeCard({ meal, isFavorite, onToggleFavorite }: Props) {
  const src = meal.strMealThumb || fallbackImageFor(meal.strMeal);
  return (
    <Pressable
      onPress={() => router.push(`/recipe/${meal.idMeal}`)}
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
        <View className="absolute bottom-2 left-2 bg-white/90 rounded-full px-2 py-0.5">
          <Text className="text-[10px] text-maya-muted">🇬🇧 en anglais</Text>
        </View>
      </View>
      <View className="p-3">
        <Text
          className="text-maya-text font-semibold text-sm"
          numberOfLines={2}
        >
          {meal.strMeal}
        </Text>
        {meal.strCategory ? (
          <Text className="text-maya-muted text-xs mt-1" numberOfLines={1}>
            {meal.strCategory}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
