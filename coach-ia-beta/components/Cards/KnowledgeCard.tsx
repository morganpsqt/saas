import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { Article } from '../../lib/content/knowledge-articles';
import { CATEGORIES } from '../../lib/content/knowledge-articles';

type Props = {
  article: Article;
  isRead?: boolean;
};

export function KnowledgeCard({ article, isRead }: Props) {
  const cat = CATEGORIES.find((c) => c.key === article.category);
  const color = cat?.color ?? '#10b981';
  return (
    <Pressable
      onPress={() => router.push(`/knowledge/${article.slug}`)}
      className="bg-maya-panel rounded-2xl border border-maya-border mb-3 overflow-hidden"
    >
      <View
        style={{ backgroundColor: color + '15' }}
        className="px-4 pt-4 pb-3 flex-row gap-3 items-center"
      >
        <View
          style={{ backgroundColor: color + '30' }}
          className="rounded-full items-center justify-center"
          // eslint-disable-next-line react-native/no-inline-styles
        >
          <Text style={{ fontSize: 32 }}>{article.emoji}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text
              style={{ color }}
              className="text-xs font-semibold uppercase tracking-wide"
            >
              {cat?.labelFr}
            </Text>
            {isRead ? (
              <View className="flex-row items-center gap-1">
                <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                <Text className="text-maya-success text-xs font-medium">Lu</Text>
              </View>
            ) : null}
          </View>
          <Text className="text-maya-text font-bold text-base" numberOfLines={2}>
            {article.title}
          </Text>
        </View>
      </View>
      <View className="px-4 py-3">
        <Text className="text-maya-muted text-sm leading-5" numberOfLines={3}>
          {article.summary}
        </Text>
        <View className="flex-row items-center gap-1 mt-2">
          <Ionicons name="time-outline" size={12} color="#a8a29e" />
          <Text className="text-maya-mutedSoft text-xs">
            {article.readMinutes} min de lecture
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
