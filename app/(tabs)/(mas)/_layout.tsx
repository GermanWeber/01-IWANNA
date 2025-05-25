import { Stack } from 'expo-router';
import HeaderPrincipal from '../../../components/Header';

export default function MasLayout() {
  
  return (
    
    <Stack>
      <Stack.Screen
        name="mas"
        options={{
          header: (props) => (
            <HeaderPrincipal showBackButton={false}/>
          ),
        }}
      />

      <Stack.Screen
        name="(mi-plan)"
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="agenda"
        options={{
          header: (props) => (
            <HeaderPrincipal/>
          ),
        }}
      />
       <Stack.Screen
        name="(perfil_usuario)"
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="(auth2)"
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="(mensajes)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(cotizacion)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="preguntas-frecuentes"
        options={{
          header: (props) => (
            <HeaderPrincipal/>
          ),
        }}
      />
      <Stack.Screen
        name="denuncias"
        options={{
          header: (props) => (
            <HeaderPrincipal/>
          ),
        }}
      />
      <Stack.Screen
        name="(posts)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="quienes-somos"
        options={{
          header: (props) => (
            <HeaderPrincipal/>
          ),
        }}
      />
    </Stack>
   
  );
}