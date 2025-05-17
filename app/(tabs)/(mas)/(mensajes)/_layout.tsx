import { Stack } from 'expo-router';
import HeaderPrincipal from '../../../../components/Header';

export default function PlanesLayout() {
  
  return (
    <Stack>
      <Stack.Screen
        name="mensajes"
        options={{
          header: (props) => (
            <HeaderPrincipal titulo="MENSAJES" bgColor="#FFFFFF"/>
          ),
        }}
      />

      <Stack.Screen
        name="chat"
        options={{
          header: (props) => (
            <HeaderPrincipal titulo="CHAT" bgColor="#FFFFFF"/>
          ),
        }}
      />
    </Stack>
  );
}