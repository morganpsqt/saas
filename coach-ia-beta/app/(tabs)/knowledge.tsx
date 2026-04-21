import { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { FilterChips } from '../../components/Common/FilterChips';
import { KnowledgeCard } from '../../components/Cards/KnowledgeCard';
import {
  articles,
  CATEGORIES,
  getArticlesByCategory,
  type ArticleCategory,
} from '../../lib/content/knowledge-articles';
import { useUserStore } from '../../lib/store/user-store';
import { listReadArticleSlugs } from '../../lib/db/queries-v2';

const CAT_OPTIONS = [
  { key: 'all', labelFr: 'Tous' },
  ...CATEGORIES.map((c) => ({ key: c.key, labelFr: c.labelFr })),
];

export default function KnowledgeTab() {
  const userId = useUserStore((s) => s.userId);
  const [cat, setCat] = useState<string>('all');
  const [readSet, setReadSet] = useState<Set<string>>(new Set());

  const loadRead = useCallback(async () => {
    if (!userId) return;
    const slugs = await listReadArticleSlugs(userId);
    setReadSet(new Set(slugs));
  }, [userId]);

  useEffect(() => {
    loadRead();
  }, [loadRead]);

  // Refresh when returning from a detail page
  useFocusEffect(
    useCallback(() => {
      loadRead();
    }, [loadRead])
  );

  const list =
    cat === 'all' ? articles : getArticlesByCategory(cat as ArticleCategory);
  const readCount = readSet.size;

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-maya-bg">
      <View className="bg-maya-panel border-b border-maya-border pt-3 pb-2">
        <View className="px-4 pb-2 flex-row items-center justify-between">
          <Text className="text-maya-muted text-xs">
            {readCount} / {articles.length} articles lus
          </Text>
          <View className="flex-row gap-1 items-center">
            <Ionicons name="book-outline" size={14} color="#10b981" />
            <Text className="text-maya-accent text-xs font-medium">
              {Math.round((readCount / articles.length) * 100)}%
            </Text>
          </View>
        </View>
        <View className="h-1 mx-4 bg-maya-border rounded-full overflow-hidden">
          <View
            className="h-full bg-maya-accent"
            style={{ width: `${(readCount / articles.length) * 100}%` }}
          />
        </View>
        <FilterChips options={CAT_OPTIONS} value={cat} onChange={setCat} />
      </View>

      <FlatList
        data={list}
        keyExtractor={(a) => a.slug}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        renderItem={({ item }) => (
          <KnowledgeCard article={item} isRead={readSet.has(item.slug)} />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Ionicons name="book-outline" size={40} color="#a8a29e" />
            <Text className="text-maya-muted mt-2">
              Pas d'article dans cette catégorie.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
