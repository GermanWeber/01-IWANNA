import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-get-random-values';
import HeaderPrincipal from '../../components/Header';

export default function RootLayout() {
  const router = useRouter();


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderPrincipal/>
        <Stack>
          <Stack.Screen name="direccion" options={{ headerShown: false }} />
          <Stack.Screen name="[idUsuario]" options={{ headerShown: false }} />
          <Stack.Screen name="cotizacion-form" options={{ headerShown: false }} />
          <Stack.Screen name="ver-posts" options={{ headerShown: false }} />
        </Stack>
    </SafeAreaView>
  );
}