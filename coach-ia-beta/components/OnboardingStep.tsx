import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  primaryLabel?: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export function OnboardingStep({
  step,
  total,
  title,
  subtitle,
  children,
  primaryLabel = 'Suivant',
  onPrimary,
  primaryDisabled,
  secondaryLabel,
  onSecondary,
}: Props) {
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-maya-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="px-6 pt-4 pb-2">
          <Text className="text-maya-muted text-xs">
            Étape {step}/{total}
          </Text>
          <View className="flex-row gap-1 mt-2 mb-4">
            {Array.from({ length: total }).map((_, i) => (
              <View
                key={i}
                className={`flex-1 h-1 rounded-full ${
                  i < step ? 'bg-maya-accent' : 'bg-maya-border'
                }`}
              />
            ))}
          </View>
          <Text className="text-maya-text text-2xl font-bold">{title}</Text>
          {subtitle ? (
            <Text className="text-maya-muted mt-1">{subtitle}</Text>
          ) : null}
        </View>
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
        <View className="px-6 pt-3 pb-4 border-t border-maya-border gap-3 flex-row">
          {secondaryLabel ? (
            <Pressable
              onPress={onSecondary}
              className="px-5 py-3 rounded-xl bg-maya-panel border border-maya-border"
            >
              <Text className="text-maya-text font-medium">{secondaryLabel}</Text>
            </Pressable>
          ) : null}
          <Pressable
            disabled={primaryDisabled}
            onPress={onPrimary}
            className={`flex-1 rounded-xl items-center justify-center py-3 ${
              primaryDisabled ? 'bg-maya-border' : 'bg-maya-accent'
            }`}
          >
            <Text
              className={`font-semibold text-base ${
                primaryDisabled ? 'text-maya-muted' : 'text-white'
              }`}
            >
              {primaryLabel}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
