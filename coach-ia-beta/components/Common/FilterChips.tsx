import { ScrollView, Pressable, Text } from 'react-native';

type Option = { key: string; labelFr: string };

type Props = {
  options: Option[];
  value: string;
  onChange: (key: string) => void;
};

export function FilterChips({ options, value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      className="py-2"
    >
      {options.map((o) => {
        const selected = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            className={`px-4 py-2 rounded-full border ${
              selected
                ? 'bg-maya-accent border-maya-accent'
                : 'bg-maya-panel border-maya-border'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selected ? 'text-white' : 'text-maya-text'
              }`}
            >
              {o.labelFr}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
