import { View, Text, TextInput, Pressable } from 'react-native';
import type { TextInputProps } from 'react-native';

type Props = {
  label: string;
  hint?: string;
  children?: React.ReactNode;
} & TextInputProps;

export function FormField({ label, hint, children, ...inputProps }: Props) {
  return (
    <View className="mb-4">
      <Text className="text-maya-text text-sm font-medium mb-1">{label}</Text>
      {hint ? <Text className="text-maya-muted text-xs mb-2">{hint}</Text> : null}
      {children ?? (
        <TextInput
          placeholderTextColor="#6B7280"
          className="bg-maya-panel border border-maya-border rounded-xl px-4 py-3 text-maya-text text-base"
          {...inputProps}
        />
      )}
    </View>
  );
}

type OptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function OptionPill({ label, selected, onPress }: OptionProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2 rounded-full border ${
        selected
          ? 'bg-maya-accent border-maya-accent'
          : 'bg-maya-panel border-maya-border'
      }`}
    >
      <Text className={selected ? 'text-black font-semibold' : 'text-maya-text'}>{label}</Text>
    </Pressable>
  );
}
