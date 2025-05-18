import { Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native';
import BotonMensaje from '../../../../components/botonMensaje';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { BASE_URL } from '@env';

interface Chat {
  id: number;
  id_usuario: number;
  nombre: string;
  foto: string;
  descripcion: string;
  f_creacion: string;
  ultimo_mensaje?: string;
  sin_leer?: number;
}

export default function Mensajes() {
    const router = useRouter();
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchChats = async () => {
        try {
          // Obtener el ID del usuario autenticado (ajusta según tu sistema de autenticación)
          const userId = 1; // Reemplaza con el ID del usuario logueado
          const response = await fetch(`${BASE_URL}chat/trabajador/${userId}`);
          
          if (!response.ok) {
            throw new Error('Error al obtener los chats');
          }
          
          const data = await response.json();
          setChats(data);
          console.log('Chats recibidos:', data);

        } catch (err) {
          console.error('Error:', err);
          setError('Error al cargar los mensajes');
        } finally {
          setLoading(false);
        }
      };

      fetchChats();
    }, []);

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8BC34A" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
          {chats.length > 0 ? (
  chats.map((chat) => (
        <BotonMensaje
          key={`chat-${chat.id}`} 
          textoBoton={chat.nombre}
          textoProfesion={chat.descripcion}
          fecha={chat.f_creacion}
          colorTextoProfesion='#424242'      
          avatar={{ uri: chat.foto }}
          colorTexto='#8BC34A'
          bgColor='#F5F5F5'
          onPress={() => router.push(`/(mas)/(mensajes)/chat?id=${chat.id}`)}
        />
  ))
) : (
  <Text style={styles.noMessagesText}>No tienes mensajes</Text>
)}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  noMessagesText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  }
});