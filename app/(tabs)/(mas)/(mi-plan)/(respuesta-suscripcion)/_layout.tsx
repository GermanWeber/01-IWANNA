import { Stack } from 'expo-router';
import HeaderPrincipal from '../../../../../components/Header';

export default function PlanesLayout() {
  
  return (
    <Stack>
      <Stack.Screen
        name="cancel-layout"
        options={{
          header: (props) => (
            <HeaderPrincipal/>
          ),
        }}
      />

      <Stack.Screen
        name="success-layout"
        options={{
          header: (props) => (
            <HeaderPrincipal />
          ),
        }}
      />
    </Stack>
  );
}