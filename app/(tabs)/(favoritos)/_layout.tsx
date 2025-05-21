import { Stack } from 'expo-router';
import HeaderPrincipal from '../../../components/Header';

export default function FavoritosLayout() {
  
  return (
    <Stack>
      <Stack.Screen
        name="favoritos"
        options={{
          header: (props) => (
            <HeaderPrincipal showBackButton={false}/>
          ),
        }}
      />
    </Stack>
  );
}
