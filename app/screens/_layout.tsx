import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-get-random-values';

export default function RootLayout() {
  const router = useRouter();


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <Stack>
          <Stack.Screen name="direccion" options={{ headerShown: false }} />
        </Stack>
    </SafeAreaView>
  );
}