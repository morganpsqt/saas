import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

type Props = {
  className?: string;
  style?: any;
};

export function Skeleton({ className, style }: Props) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[{ opacity, backgroundColor: '#e7e5e4', borderRadius: 8 }, style]}
      className={className}
    />
  );
}

export function ExerciseCardSkeleton() {
  return (
    <View
      className="bg-maya-panel rounded-2xl border border-maya-border overflow-hidden mb-3"
      style={{ flex: 1 }}
    >
      <Skeleton style={{ width: '100%', aspectRatio: 1, borderRadius: 0 }} />
      <View className="p-3">
        <Skeleton style={{ height: 14, width: '80%', marginBottom: 6 }} />
        <Skeleton style={{ height: 12, width: '60%' }} />
      </View>
    </View>
  );
}

export function SkeletonGrid2({ count = 6 }: { count?: number }) {
  return (
    <View
      className="px-4 flex-row flex-wrap"
      style={{ gap: 12 }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ width: '48%', flexGrow: 1 }}>
          <ExerciseCardSkeleton />
        </View>
      ))}
    </View>
  );
}
