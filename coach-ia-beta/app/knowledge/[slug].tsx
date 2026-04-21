import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { getArticleBySlug, CATEGORIES } from '../../lib/content/knowledge-articles';
import { useUserStore } from '../../lib/store/user-store';
import { isArticleRead, markArticleRead } from '../../lib/db/queries-v2';

export default function KnowledgeDetail() {
  const params = useLocalSearchParams<{ slug: string }>();
  const slug = String(params.slug);
  const article = getArticleBySlug(slug);
  const userId = useUserStore((s) => s.userId);
  const [read, setRead] = useState(false);

  const refreshRead = useCallback(async () => {
    if (!userId) return;
    setRead(await isArticleRead(userId, slug));
  }, [userId, slug]);

  useEffect(() => {
    refreshRead();
  }, [refreshRead]);

  if (!article) {
    return (
      <View className="flex-1 items-center justify-center bg-maya-bg px-6">
        <Text className="text-maya-muted">Article introuvable.</Text>
      </View>
    );
  }

  const cat = CATEGORIES.find((c) => c.key === article.category);
  const color = cat?.color ?? '#10b981';

  async function toggleRead() {
    if (!userId || !article) return;
    if (!read) {
      await markArticleRead(userId, article.slug);
    }
    // pas de dé-lecture volontaire dans cette version
    setRead(true);
  }

  function askMaya() {
    if (!article) return;
    const prefill = `Explique-moi plus sur "${article.title}" et aide-moi à l'appliquer à mon dossier.`;
    router.push({ pathname: '/(tabs)/chat', params: { prefill } });
  }

  return (
    <>
      <Stack.Screen options={{ title: cat?.labelFr ?? 'Article' }} />
      <ScrollView className="flex-1 bg-maya-bg" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero */}
        <View
          style={{ backgroundColor: color + '15' }}
          className="px-6 pt-6 pb-8"
        >
          <Text
            style={{ color }}
            className="text-xs font-bold uppercase tracking-wider mb-2"
          >
            {cat?.labelFr}
          </Text>
          <View className="flex-row items-start gap-4">
            <Text style={{ fontSize: 48 }}>{article.emoji}</Text>
            <View className="flex-1">
              <Text className="text-maya-text text-2xl font-bold leading-8">
                {article.title}
              </Text>
              <View className="flex-row items-center gap-1 mt-2">
                <Ionicons name="time-outline" size={14} color="#78716c" />
                <Text className="text-maya-muted text-sm">
                  {article.readMinutes} min de lecture
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sections */}
        <View className="px-6 py-5">
          {article.sections.map((s, i) => (
            <View key={i} className="mb-6">
              <Text className="text-maya-text text-lg font-bold mb-2">
                {s.heading}
              </Text>
              {s.paragraphs.map((p, j) => (
                <Text
                  key={j}
                  className="text-maya-text leading-6 mb-3"
                  style={{ fontSize: 15 }}
                >
                  {renderInlineBold(p)}
                </Text>
              ))}
            </View>
          ))}

          {/* Key takeaways */}
          <View
            style={{ backgroundColor: color + '15', borderColor: color + '55' }}
            className="rounded-2xl border p-4 mt-2"
          >
            <Text
              style={{ color }}
              className="text-sm font-bold uppercase tracking-wide mb-3"
            >
              🎯 À retenir
            </Text>
            {article.keyTakeaways.map((k, i) => (
              <View key={i} className="flex-row gap-2 mb-2">
                <Text style={{ color }} className="font-bold">
                  •
                </Text>
                <Text className="text-maya-text flex-1" style={{ fontSize: 15 }}>
                  {k}
                </Text>
              </View>
            ))}
          </View>

          {/* CTAs */}
          <View className="mt-6 gap-3">
            <Pressable
              onPress={toggleRead}
              disabled={read}
              className={`rounded-xl py-3 items-center flex-row justify-center gap-2 border ${
                read
                  ? 'bg-maya-accentSoft border-maya-accent'
                  : 'bg-maya-panel border-maya-border'
              }`}
            >
              <Ionicons
                name={read ? 'checkmark-circle' : 'book-outline'}
                size={18}
                color={read ? '#10b981' : '#1c1917'}
              />
              <Text
                className={`font-semibold ${
                  read ? 'text-maya-accentDark' : 'text-maya-text'
                }`}
              >
                {read ? 'Article lu' : "J'ai lu"}
              </Text>
            </Pressable>

            <Pressable
              onPress={askMaya}
              className="bg-maya-accent rounded-xl py-3 items-center flex-row justify-center gap-2"
            >
              <Ionicons name="chatbubble-ellipses" size={18} color="white" />
              <Text className="text-white font-semibold">Maya, explique-moi plus</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

// Render **bold** inside paragraphs (basic markdown)
function renderInlineBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return (
        <Text key={i} className="font-bold">
          {p.slice(2, -2)}
        </Text>
      );
    }
    return <Text key={i}>{p}</Text>;
  });
}
