import { Stack } from 'expo-router';
import HeaderPrincipal from '../../../../components/Header';

export default function CotizacionLayout() {
  
  return (
    <Stack>
      <Stack.Screen
        name="cotizacion"
        options={{
          header: () => <HeaderPrincipal />
        }}
      />

      <Stack.Screen
        name="cotizacion-interior"
        options={{
          header: (props) => (
            <HeaderPrincipal/>
          ),
        }}
      />

      <Stack.Screen
        name="cotizacion-form"
        options={{
          header: () => <HeaderPrincipal />
        }}
      />

      <Stack.Screen
        name="direccion-cotizacion"
        options={{
          header: () => <HeaderPrincipal />
        }}
      />
    </Stack>
  );
}