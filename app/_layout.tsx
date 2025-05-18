import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-get-random-values';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir directamente a la página de tabs
    router.replace('(tabs)');
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
    </SafeAreaView>
  );
}