import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  MEAL_CATEGORIES,
  fetchByCategory,
  fetchByQuery,
  type MealSummary,
} from '../../lib/api/themealdb';
import { RecipeCard } from '../../components/Cards/RecipeCard';
import { FilterChips } from '../../components/Common/FilterChips';
import { useUserStore } from '../../lib/store/user-store';
import {
  addFavoriteRecipe,
  isFavoriteRecipe,
  listFavoriteRecipes,
  removeFavoriteRecipe,
} from '../../lib/db/queries-v2';

const DEFAULT_CAT = 'chicken';

export default function RecipesTab() {
  const userId = useUserStore((s) => s.userId);
  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(DEFAULT_CAT);
  const [favIds, setFavIds] = useState<Set<string>>(new Set());
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // simple debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let list: MealSummary[];
      if (debouncedQuery.length > 0) {
        list = await fetchByQuery(debouncedQuery);
      } else {
        const catLabel = MEAL_CATEGORIES.find((c) => c.key === category)?.themealdb;
        if (!catLabel) {
          // 'all' → mélange de 2-3 catégories pour montrer de la variété
          const [a, b, c] = await Promise.all([
            fetchByCategory('Chicken'),
            fetchByCategory('Vegetarian'),
            fetchByCategory('Breakfast'),
          ]);
          list = [...a.slice(0, 10), ...b.slice(0, 10), ...c.slice(0, 10)];
        } else {
          list = await fetchByCategory(catLabel);
        }
      }
      setMeals(list);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }, [category, debouncedQuery]);

  useEffect(() => {
    load();
  }, [load]);

  const loadFavorites = useCallback(async () => {
    if (!userId) return;
    const favs = await listFavoriteRecipes(userId);
    setFavIds(new Set(favs.map((f) => f.recipe_api_id)));
  }, [userId]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  async function toggleFavorite(m: MealSummary) {
    if (!userId) return;
    const fav = await isFavoriteRecipe(userId, m.idMeal);
    if (fav) {
      await removeFavoriteRecipe(userId, m.idMeal);
    } else {
      await addFavoriteRecipe(userId, m.idMeal, m.strMeal);
    }
    await loadFavorites();
  }

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const shownMeals = useMemo(() => meals, [meals]);

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-maya-bg">
      <View className="bg-maya-panel border-b border-maya-border pt-3 pb-2">
        <View className="px-4">
          <View className="flex-row items-center bg-maya-bg border border-maya-border rounded-xl px-3">
            <Ionicons name="search" size={18} color="#78716c" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Rechercher une recette (en anglais)…"
              placeholderTextColor="#a8a29e"
              className="flex-1 py-2.5 px-2 text-maya-text"
            />
            {query ? (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="#78716c" />
              </Pressable>
            ) : null}
          </View>
        </View>
        <FilterChips
          options={MEAL_CATEGORIES}
          value={category}
          onChange={(k) => {
            setCategory(k);
            setQuery('');
          }}
        />
      </View>

      {error && meals.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="cloud-offline-outline" size={40} color="#78716c" />
          <Text className="text-maya-muted mt-2 text-center">
            Problème de réseau. Réessaye plus tard.
          </Text>
          <Pressable
            onPress={load}
            className="mt-4 px-4 py-2 bg-maya-accent rounded-xl"
          >
            <Text className="text-white font-semibold">Réessayer</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={shownMeals}
          keyExtractor={(m) => m.idMeal}
          numColumns={2}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingVertical: 12 }}
          renderItem={({ item }) => (
            <RecipeCard
              meal={item}
              isFavorite={favIds.has(item.idMeal)}
              onToggleFavorite={() => toggleFavorite(item)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
          }
          ListEmptyComponent={
            !loading ? (
              <View className="items-center justify-center py-12">
                <Ionicons name="restaurant-outline" size={40} color="#a8a29e" />
                <Text className="text-maya-muted mt-2">
                  Aucune recette ne correspond.
                </Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            loading ? (
              <View className="py-4">
                <ActivityIndicator color="#10b981" />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
