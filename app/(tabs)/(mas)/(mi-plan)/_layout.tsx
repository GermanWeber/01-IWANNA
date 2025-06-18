import { Stack } from 'expo-router';
import HeaderPrincipal from '../../../../components/Header';

export default function PlanesLayout() {
  
  return (
    <Stack>
      <Stack.Screen
        name="mi-plan"
        options={{
          header: (props) => (
            <HeaderPrincipal/>
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