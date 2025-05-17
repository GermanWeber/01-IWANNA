import { Stack } from 'expo-router';
import HeaderPrincipal from '../../../../components/Header';

export default function PlanesLayout() {
  
  return (
    <Stack>
      <Stack.Screen
        name="mi-plan"
        options={{
          header: (props) => (
            <HeaderPrincipal titulo="MI PLAN"/>
          ),
        }}
      />

      <Stack.Screen
        name="planes"
        options={{
          header: (props) => (
            <HeaderPrincipal titulo="PLANES"/>
          ),
        }}
      />
    </Stack>
  );
}