import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-get-random-values';
import HeaderPrincipal from '../components/Header';

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
          <Stack.Screen  name="screens" />
        </Stack>
    </SafeAreaView>
  );
}