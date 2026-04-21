import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Recipes() {
  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-maya-bg items-center justify-center">
      <Text className="text-maya-muted">Recettes (à venir)</Text>
    </SafeAreaView>
  );
}
