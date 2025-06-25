import { Stack } from 'expo-router';
import HeaderPrincipal from '../../../../components/Header';
import { useRouter } from 'expo-router';

export default function PlanesLayout() {


  const router = useRouter();

  const handleBackButtonPress = () => {
    router.push('/(tabs)/(mas)');
  };
  
  return (
    <Stack>
      <Stack.Screen
        name="mi-plan"
        options={{
          header: (props) => (
            <HeaderPrincipal showBackButton={false}/>
          ),
        }}
      />

      <Stack.Screen
        name="planes"
        options={{
          header: (props) => (
            <HeaderPrincipal />
          ),
        }}
      />

      <Stack.Screen
        name="(respuesta-suscripcion)"
        options={{ headerShown: false,  }}
      />
    </Stack>
  );
}