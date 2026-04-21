import { View, Text } from 'react-native';
import type { Tip } from '../../lib/content/daily-tips';

const COLORS: Record<Tip['category'], { bg: string; fg: string; label: string }> = {
  nutrition: { bg: '#dcfce7', fg: '#15803d', label: 'Nutrition' },
  training: { bg: '#fef3c7', fg: '#b45309', label: 'Training' },
  mindset: { bg: '#fce7f3', fg: '#be185d', label: 'Mindset' },
  recovery: { bg: '#dbeafe', fg: '#1d4ed8', label: 'Récup' },
  habits: { bg: '#ede9fe', fg: '#6d28d9', label: 'Habitude' },
};

type Props = {
  tip: Tip;
};

export function DailyTipCard({ tip }: Props) {
  const c = COLORS[tip.category];
  return (
    <View
      style={{ backgroundColor: c.bg }}
      className="rounded-2xl p-4 border border-maya-border"
    >
      <View className="flex-row items-center gap-2 mb-2">
        <Text style={{ fontSize: 22 }}>{tip.emoji}</Text>
        <Text
          style={{ color: c.fg }}
          className="text-xs font-bold uppercase tracking-wider"
        >
          Tip du jour · {c.label}
        </Text>
      </View>
      <Text className="text-maya-text leading-6" style={{ fontSize: 15 }}>
        {tip.text}
      </Text>
    </View>
  );
}
