import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0B0F14' },
        headerTintColor: '#E5E7EB',
        headerTitleStyle: { color: '#E5E7EB' },
      }}
    >
      <Stack.Screen name="chat" options={{ title: 'Maya' }} />
      <Stack.Screen name="profile" options={{ title: 'Mon dossier' }} />
    </Stack>
  );
}
