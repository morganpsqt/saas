import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Linking,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import {
  fetchMealDetail,
  fallbackImageFor,
  type MealDetail,
} from '../../lib/api/themealdb';
import { useUserStore } from '../../lib/store/user-store';
import {
  addFavoriteRecipe,
  isFavoriteRecipe,
  removeFavoriteRecipe,
} from '../../lib/db/queries-v2';

function splitInstructions(raw: string): string[] {
  if (!raw) return [];
  // Split by line breaks, filter empty, trim
  return raw
    .split(/\r?\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export default function RecipeDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id;
  const userId = useUserStore((s) => s.userId);
  const [data, setData] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const d = await fetchMealDetail(id);
      setData(d);
      if (d && userId) {
        setIsFav(await isFavoriteRecipe(userId, d.idMeal));
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id, userId]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleFavorite() {
    if (!userId || !data) return;
    if (isFav) {
      await removeFavoriteRecipe(userId, data.idMeal);
      setIsFav(false);
    } else {
      await addFavoriteRecipe(userId, data.idMeal, data.strMeal);
      setIsFav(true);
    }
  }

  function askMaya() {
    if (!data) return;
    const ingList = data.ingredients
      .slice(0, 6)
      .map((i) => i.ingredient)
      .join(', ');
    const prefill = `Est-ce que la recette "${data.strMeal}" (ingrédients principaux : ${ingList}) convient à mon objectif ? Comment l'adapter si besoin ?`;
    router.push({ pathname: '/(tabs)/chat', params: { prefill } });
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-maya-bg">
        <ActivityIndicator color="#10b981" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-maya-bg px-6">
        <Ionicons name="cloud-offline-outline" size={40} color="#78716c" />
        <Text className="text-maya-muted mt-2 text-center">
          Impossible de charger cette recette.
        </Text>
        <Pressable
          onPress={load}
          className="mt-4 px-4 py-2 bg-maya-accent rounded-xl"
        >
          <Text className="text-white font-semibold">Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  const steps = splitInstructions(data.strInstructions);
  const image = data.strMealThumb || fallbackImageFor(data.strMeal);

  return (
    <>
      <Stack.Screen options={{ title: data.strMeal }} />
      <ScrollView className="flex-1 bg-maya-bg" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="bg-maya-panelAlt" style={{ aspectRatio: 16 / 10 }}>
          <Image
            source={{ uri: image }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        </View>
        <View className="px-5 py-4">
          <Text className="text-maya-text text-2xl font-bold">{data.strMeal}</Text>
          <View className="flex-row flex-wrap gap-2 mt-2">
            {data.strCategory ? <Badge color="#f59e0b" text={data.strCategory} /> : null}
            {data.strArea ? <Badge color="#0ea5e9" text={data.strArea} /> : null}
            <Badge color="#78716c" text="🇬🇧 en anglais" />
          </View>

          <Text className="text-maya-text text-lg font-bold mt-6 mb-2">
            Ingrédients ({data.ingredients.length})
          </Text>
          <View className="bg-maya-panel border border-maya-border rounded-xl divide-y divide-maya-border overflow-hidden">
            {data.ingredients.map((row, i) => (
              <View key={i} className="flex-row justify-between items-center px-4 py-2.5">
                <Text className="text-maya-text flex-1" numberOfLines={2}>
                  {row.ingredient}
                </Text>
                <Text className="text-maya-muted text-xs ml-2">{row.measure}</Text>
              </View>
            ))}
          </View>

          <Text className="text-maya-text text-lg font-bold mt-6 mb-2">Instructions</Text>
          {steps.length === 0 ? (
            <Text className="text-maya-muted italic">Pas d'instructions disponibles.</Text>
          ) : (
            steps.map((s, i) => (
              <View key={i} className="flex-row gap-3 mb-3">
                <View className="bg-maya-accent rounded-full items-center justify-center" style={{ width: 24, height: 24 }}>
                  <Text className="text-white text-xs font-bold">{i + 1}</Text>
                </View>
                <Text className="text-maya-text flex-1 leading-6">{s}</Text>
              </View>
            ))
          )}

          {data.strYoutube ? (
            <Pressable
              onPress={() => Linking.openURL(data.strYoutube!)}
              className="mt-4 bg-maya-panel border border-maya-border rounded-xl py-3 items-center flex-row justify-center gap-2"
            >
              <Ionicons name="logo-youtube" size={18} color="#ef4444" />
              <Text className="text-maya-text font-semibold">Voir la vidéo</Text>
            </Pressable>
          ) : null}

          <View className="mt-6 gap-3">
            <Pressable
              onPress={toggleFavorite}
              className={`rounded-xl py-3 items-center flex-row justify-center gap-2 border ${
                isFav ? 'bg-maya-accentSoft border-maya-accent' : 'bg-maya-panel border-maya-border'
              }`}
            >
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={18}
                color={isFav ? '#ef4444' : '#1c1917'}
              />
              <Text className={`font-semibold ${isFav ? 'text-maya-accentDark' : 'text-maya-text'}`}>
                {isFav ? 'Retiré des favoris' : 'Ajouter aux favoris'}
              </Text>
            </Pressable>

            <Pressable
              onPress={askMaya}
              className="bg-maya-accent rounded-xl py-3 items-center flex-row justify-center gap-2"
            >
              <Ionicons name="chatbubble-ellipses" size={18} color="white" />
              <Text className="text-white font-semibold">Demander à Maya</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

function Badge({ color, text }: { color: string; text: string }) {
  return (
    <View
      style={{ backgroundColor: color + '22', borderColor: color + '55', borderWidth: 1 }}
      className="rounded-full px-3 py-1"
    >
      <Text style={{ color }} className="text-xs font-semibold">
        {text}
      </Text>
    </View>
  );
}
