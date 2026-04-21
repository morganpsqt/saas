import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import {
  fetchExerciseDetail,
  fallbackImageFor,
  type ExerciseDetail,
} from '../../lib/api/wger';
import { useUserStore } from '../../lib/store/user-store';
import {
  addFavoriteExercise,
  isFavoriteExercise,
  removeFavoriteExercise,
} from '../../lib/db/queries-v2';

export default function ExerciseDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Number(params.id);
  const userId = useUserStore((s) => s.userId);
  const [data, setData] = useState<ExerciseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await fetchExerciseDetail(id);
      setData(d);
      if (userId) {
        setIsFav(await isFavoriteExercise(userId, String(id)));
      }
    } catch (e: any) {
      setError(String(e?.message ?? e));
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
      await removeFavoriteExercise(userId, String(id));
      setIsFav(false);
    } else {
      await addFavoriteExercise(userId, String(id), data.name);
      setIsFav(true);
    }
  }

  function askMaya() {
    if (!data) return;
    const prefill = `Parle-moi de l'exercice "${data.name}", comment bien l'exécuter et sur quels points être vigilant ?`;
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
          Impossible de charger cet exercice.
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

  const imageUrl = data.imageUrl ?? fallbackImageFor(data.name);

  return (
    <>
      <Stack.Screen options={{ title: data.name }} />
      <ScrollView className="flex-1 bg-maya-bg" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="bg-maya-panelAlt" style={{ aspectRatio: 16 / 10 }}>
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        </View>

        <View className="px-5 py-4">
          <Text className="text-maya-text text-2xl font-bold">{data.name}</Text>
          <View className="flex-row flex-wrap gap-2 mt-3">
            <Badge color="#f59e0b" text={data.categoryFr} />
            {data.musclesFr.map((m, i) => (
              <Badge key={i} color="#10b981" text={m} />
            ))}
            {data.equipmentFr.map((e, i) => (
              <Badge key={i + 'eq'} color="#0ea5e9" text={e} />
            ))}
          </View>

          {data.descriptionLang === 'en' ? (
            <View className="mt-4 bg-maya-orangeSoft rounded-xl px-3 py-2">
              <Text className="text-maya-orange text-xs">
                🇬🇧 Description en anglais (traduction non disponible sur wger pour cet exercice).
              </Text>
            </View>
          ) : null}

          <Text className="text-maya-text text-lg font-bold mt-6 mb-2">
            Comment faire
          </Text>
          {data.description ? (
            <Text className="text-maya-text leading-6">{data.description}</Text>
          ) : (
            <Text className="text-maya-muted italic">
              Pas de description détaillée pour cet exercice.
            </Text>
          )}

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
