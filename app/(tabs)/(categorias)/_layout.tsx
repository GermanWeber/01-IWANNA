import { Stack } from 'expo-router';
import HeaderPrincipal from '../../../components/Header';
import { Ionicons } from '@expo/vector-icons';

interface RouteParams {
  categoria?: string;
}

export default function CategoriaLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="categorias"
        options={{
          header: (props) => (
            <HeaderPrincipal showBackButton={false}/>
          ),
        }}
      />
      <Stack.Screen
        name="[detalleCategoria]"
        options={{
          header: (props) => (
            <HeaderPrincipal/>
          ),
        }}
      />
    </Stack>
  );
}