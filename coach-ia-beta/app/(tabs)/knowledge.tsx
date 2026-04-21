import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Knowledge() {
  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-maya-bg items-center justify-center">
      <Text className="text-maya-muted">Savoir (à venir)</Text>
    </SafeAreaView>
  );
}
