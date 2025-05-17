import { Stack } from 'expo-router';
import HeaderPrincipal from '../../../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context'; 

export default function MasLayout() {
  
  return (
    
    <Stack>
      <Stack.Screen
        name="mas"
        options={{
          header: (props) => (
            <HeaderPrincipal titulo="MÁS"/>
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
            <HeaderPrincipal titulo="AGENDA"/>
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
            <HeaderPrincipal titulo="PREGUNTAS FRECUENTES"/>
          ),
        }}
      />
      <Stack.Screen
        name="denuncias"
        options={{
          header: (props) => (
            <HeaderPrincipal titulo="DENUNCIAS"/>
          ),
        }}
      />
      <Stack.Screen
        name="post"
        options={{
          header: (props) => (
            <HeaderPrincipal titulo="POSTS"/>
          ),
        }}
      />
      <Stack.Screen
        name="quienes-somos"
        options={{
          header: (props) => (
            <HeaderPrincipal titulo="QUIENES SOMOS"/>
          ),
        }}
      />
    </Stack>
   
  );
}