import { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useUserStore } from '../../lib/store/user-store';
import { getProfile } from '../../lib/db/queries';
import {
  getTodayHabits,
  ensureTodayHabits,
  countFavoriteExercises,
  countFavoriteRecipes,
  countReadArticles,
  countHabitDays,
  type DailyHabit,
} from '../../lib/db/queries-v2';
import { getTodayTip, greetingFr } from '../../lib/content/daily-tips';
import { DailyTipCard } from '../../components/Dashboard/DailyTipCard';
import { HabitsTracker } from '../../components/Dashboard/HabitsTracker';
import { QuickActions } from '../../components/Dashboard/QuickActions';
import {
  fetchExercisesPage,
  fallbackImageFor as exoFallback,
  type ExerciseSummary,
} from '../../lib/api/wger';
import { fetchRandom, type MealDetail } from '../../lib/api/themealdb';

export default function Home() {
  const userId = useUserStore((s) => s.userId);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [habit, setHabit] = useState<DailyHabit | null>(null);
  const [progress, setProgress] = useState({
    days: 0,
    exos: 0,
    recipes: 0,
    articles: 0,
  });
  const [exoSuggestion, setExoSuggestion] = useState<ExerciseSummary | null>(null);
  const [mealSuggestion, setMealSuggestion] = useState<MealDetail | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const tip = getTodayTip();

  const loadProfile = useCallback(async () => {
    if (!userId) return;
    const p = await getProfile(userId);
    setFirstName(p?.first_name ?? null);
  }, [userId]);

  const loadDaily = useCallback(async () => {
    if (!userId) return;
    const existing = await getTodayHabits(userId);
    if (existing) {
      setHabit(existing);
    } else {
      const h = await ensureTodayHabits(userId);
      setHabit(h);
    }
  }, [userId]);

  const loadProgress = useCallback(async () => {
    if (!userId) return;
    const [days, exos, recipes, articles] = await Promise.all([
      countHabitDays(userId),
      countFavoriteExercises(userId),
      countFavoriteRecipes(userId),
      countReadArticles(userId),
    ]);
    setProgress({ days, exos, recipes, articles });
  }, [userId]);

  const loadSuggestions = useCallback(async () => {
    setLoadingSuggestions(true);
    try {
      const randomOffset = Math.floor(Math.random() * 30) * 20;
      const [page, meal] = await Promise.all([
        fetchExercisesPage(randomOffset, 20).catch(() => null),
        fetchRandom().catch(() => null),
      ]);
      if (page && page.items.length > 0) {
        const idx = Math.floor(Math.random() * page.items.length);
        setExoSuggestion(page.items[idx]);
      }
      setMealSuggestion(meal);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    loadDaily();
    loadProgress();
    loadSuggestions();
  }, [loadProfile, loadDaily, loadProgress, loadSuggestions]);

  useFocusEffect(
    useCallback(() => {
      loadDaily();
      loadProgress();
    }, [loadDaily, loadProgress])
  );

  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([loadDaily(), loadProgress(), loadSuggestions()]);
    setRefreshing(false);
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-maya-bg">
      <ScrollView
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 40, gap: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
        }
      >
        {/* Header */}
        <View className="px-5">
          <Text className="text-maya-muted text-sm">{greetingFr()}</Text>
          <Text className="text-maya-text text-3xl font-bold">
            {firstName ?? 'Salut'} 👋
          </Text>
        </View>

        {/* Tip du jour */}
        <View className="px-5">
          <DailyTipCard tip={tip} />
        </View>

        {/* Tracker habitudes */}
        {userId ? (
          <View className="px-5">
            <HabitsTracker
              userId={userId}
              habit={habit}
              onChanged={(h) => setHabit(h)}
            />
          </View>
        ) : null}

        {/* Actions rapides */}
        <View className="px-5">
          <Text className="text-maya-text font-bold text-base mb-3">
            Actions rapides
          </Text>
          <QuickActions />
        </View>

        {/* Suggestions du jour */}
        <View className="px-5">
          <Text className="text-maya-text font-bold text-base mb-3">
            Suggestion du jour
          </Text>
          {loadingSuggestions ? (
            <View className="bg-maya-panel border border-maya-border rounded-2xl py-8 items-center">
              <ActivityIndicator color="#10b981" />
            </View>
          ) : (
            <View className="gap-3">
              {exoSuggestion ? (
                <SuggestionCard
                  emoji="🏋️"
                  category="Exercice"
                  title={exoSuggestion.name}
                  subtitle={`${exoSuggestion.categoryFr}${
                    exoSuggestion.musclesFr.length ? ` · ${exoSuggestion.musclesFr.slice(0, 2).join(', ')}` : ''
                  }`}
                  imageUrl={exoSuggestion.imageUrl ?? exoFallback(exoSuggestion.name)}
                  onPress={() => router.push(`/exercise/${exoSuggestion.id}`)}
                />
              ) : null}
              {mealSuggestion ? (
                <SuggestionCard
                  emoji="🍽️"
                  category="Recette"
                  title={mealSuggestion.strMeal}
                  subtitle={[mealSuggestion.strCategory, mealSuggestion.strArea]
                    .filter(Boolean)
                    .join(' · ')}
                  imageUrl={mealSuggestion.strMealThumb}
                  onPress={() => router.push(`/recipe/${mealSuggestion.idMeal}`)}
                />
              ) : null}
              {!exoSuggestion && !mealSuggestion ? (
                <Text className="text-maya-muted italic">
                  Pas de suggestion disponible pour l'instant (réseau ?).
                </Text>
              ) : null}
            </View>
          )}
        </View>

        {/* Progression */}
        <View className="px-5">
          <Text className="text-maya-text font-bold text-base mb-3">
            Ma progression
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <ProgressTile emoji="📅" value={progress.days} label="jours suivis" />
            <ProgressTile emoji="📚" value={progress.articles} label="articles lus" />
            <ProgressTile emoji="🏋️" value={progress.exos} label="exos favoris" />
            <ProgressTile emoji="🍽️" value={progress.recipes} label="recettes sauvées" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SuggestionCard({
  emoji,
  category,
  title,
  subtitle,
  imageUrl,
  onPress,
}: {
  emoji: string;
  category: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-maya-panel rounded-2xl border border-maya-border overflow-hidden flex-row"
    >
      <View className="w-24" style={{ aspectRatio: 1 }}>
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={200}
        />
      </View>
      <View className="flex-1 px-3 py-3 justify-center">
        <View className="flex-row items-center gap-1 mb-1">
          <Text style={{ fontSize: 14 }}>{emoji}</Text>
          <Text className="text-maya-accent text-xs font-bold uppercase">
            {category}
          </Text>
        </View>
        <Text className="text-maya-text font-semibold" numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-maya-muted text-xs mt-0.5" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View className="items-center justify-center pr-3">
        <Ionicons name="chevron-forward" size={20} color="#78716c" />
      </View>
    </Pressable>
  );
}

function ProgressTile({
  emoji,
  value,
  label,
}: {
  emoji: string;
  value: number;
  label: string;
}) {
  return (
    <View
      className="bg-maya-panel rounded-xl border border-maya-border px-3 py-3"
      style={{ flexBasis: '48%', flexGrow: 1 }}
    >
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text className="text-maya-text text-2xl font-bold mt-1">{value}</Text>
      <Text className="text-maya-muted text-xs">{label}</Text>
    </View>
  );
}
