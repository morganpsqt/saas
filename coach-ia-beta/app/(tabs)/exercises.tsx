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
  fetchExercisesPage,
  filterExercises,
  EXERCISE_CATEGORIES,
  EQUIPMENT_FILTERS,
  type ExerciseSummary,
} from '../../lib/api/wger';
import { ExerciseCard } from '../../components/Cards/ExerciseCard';
import { FilterChips } from '../../components/Common/FilterChips';
import { useUserStore } from '../../lib/store/user-store';
import {
  addFavoriteExercise,
  isFavoriteExercise,
  listFavoriteExercises,
  removeFavoriteExercise,
} from '../../lib/db/queries-v2';

const PAGE_SIZE = 20;

export default function ExercisesTab() {
  const userId = useUserStore((s) => s.userId);
  const [items, setItems] = useState<ExerciseSummary[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [equipment, setEquipment] = useState('all');
  const [favIds, setFavIds] = useState<Set<string>>(new Set());

  const loadPage = useCallback(
    async (resetOffset = false) => {
      if (loading) return;
      setLoading(true);
      setError(null);
      try {
        const nextOffset = resetOffset ? 0 : offset;
        const res = await fetchExercisesPage(nextOffset, PAGE_SIZE);
        setItems((prev) => (resetOffset ? res.items : [...prev, ...res.items]));
        setOffset(nextOffset + res.items.length);
        setHasMore(res.hasMore);
      } catch (e: any) {
        setError(String(e?.message ?? e));
      } finally {
        setLoading(false);
      }
    },
    [loading, offset]
  );

  const loadFavorites = useCallback(async () => {
    if (!userId) return;
    const favs = await listFavoriteExercises(userId);
    setFavIds(new Set(favs.map((f) => f.exercise_api_id)));
  }, [userId]);

  useEffect(() => {
    loadPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const visibleItems = useMemo(
    () => filterExercises(items, query, category, equipment),
    [items, query, category, equipment]
  );

  async function toggleFavorite(ex: ExerciseSummary) {
    if (!userId) return;
    const apiId = String(ex.id);
    const wasFav = await isFavoriteExercise(userId, apiId);
    if (wasFav) {
      await removeFavoriteExercise(userId, apiId);
    } else {
      await addFavoriteExercise(userId, apiId, ex.name);
    }
    await loadFavorites();
  }

  async function onRefresh() {
    setRefreshing(true);
    setOffset(0);
    setHasMore(true);
    try {
      const res = await fetchExercisesPage(0, PAGE_SIZE);
      setItems(res.items);
      setOffset(res.items.length);
      setHasMore(res.hasMore);
      setError(null);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-maya-bg">
      <View className="bg-maya-panel border-b border-maya-border pt-3 pb-2">
        <View className="px-4">
          <View className="flex-row items-center bg-maya-bg border border-maya-border rounded-xl px-3">
            <Ionicons name="search" size={18} color="#78716c" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Rechercher un exercice…"
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
          options={EXERCISE_CATEGORIES}
          value={category}
          onChange={setCategory}
        />
        <FilterChips
          options={EQUIPMENT_FILTERS}
          value={equipment}
          onChange={setEquipment}
        />
      </View>

      {error && items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="cloud-offline-outline" size={40} color="#78716c" />
          <Text className="text-maya-muted mt-2 text-center">
            Problème de réseau. Réessaye plus tard.
          </Text>
          <Pressable
            onPress={() => loadPage(true)}
            className="mt-4 px-4 py-2 bg-maya-accent rounded-xl"
          >
            <Text className="text-white font-semibold">Réessayer</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={visibleItems}
          keyExtractor={(e) => String(e.id)}
          numColumns={2}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingVertical: 12 }}
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              isFavorite={favIds.has(String(item.id))}
              onToggleFavorite={() => toggleFavorite(item)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
          }
          onEndReached={() => {
            if (hasMore && !loading) loadPage(false);
          }}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            !loading ? (
              <View className="items-center justify-center py-12">
                <Ionicons name="barbell-outline" size={40} color="#a8a29e" />
                <Text className="text-maya-muted mt-2">
                  Aucun exercice ne correspond à ta recherche.
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
