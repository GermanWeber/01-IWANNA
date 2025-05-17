import { Stack } from 'expo-router';
import HeaderPrincipal from '../../../../components/Header';

export default function CotizacionLayout() {
  
  return (
    <Stack>
      <Stack.Screen
        name="cotizacion"
        options={{
          header: (props) => (
            <HeaderPrincipal />
          ),
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
    </Stack>
  );
}