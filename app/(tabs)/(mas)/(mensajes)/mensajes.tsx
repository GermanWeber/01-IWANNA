import { Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native';
import BotonMensaje from '../../../../components/botonMensaje';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { API_URL } from '@env';
import { recuperarStorage } from '../../../../services/asyncStorage';
interface Chat {
  id: number;
  id_usuario: number;
  apellido?: string;
  nombre: string;
  foto: string;
  descripcion: string;
  f_creacion: string;
  ultimo_mensaje?: string;
  sin_leer?: number;
}


export default function Mensajes() {
    const router = useRouter();
    const [chatsTrabajador, setChatsTrabajador] = useState<Chat[]>([]);
    const [chatsCliente, setChatsCliente] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usuario, setUsuario] = useState<any>(null);
    

    const loadUsuario = async () => {
            try {
                console.log('Iniciando carga de usuario...');
                const usuarioData = await recuperarStorage('usuario');
                
                if (usuarioData) {
                    console.log('Usuario recuperado:', usuarioData);
                    setUsuario(usuarioData);
                    fetchChatstrabajador(usuarioData.id);
                    fetchChatsCliente(usuarioData.id);
                }
            } catch (error) {
                console.log('Error al recuperar el usuario:', error);
            }
        };

    const fetchChatstrabajador = async (id: number) => {
      try {
        const userId = id; 
        console.log('ID del usuario:', userId);
        const response = await fetch(`${API_URL}chat/trabajador/${userId}`);
        
        if (response === null) {
          throw new Error('no hay chats');
        }

        if (!response.ok) {
          throw new Error('Error al obtener los chats');
        }
        
        const data = await response.json();
        setChatsTrabajador(data);
        console.log('Chats recibidos:', data);

      } catch (err) {
        console.log('Error:', err);
        setError('Error al cargar los mensajes del trabajador');
      } finally {
        setLoading(false);
      }
    };

    const fetchChatsCliente = async (id: number) => {
      try {
        const userId = id; 
        console.log('ID del usuario:', userId);
        const response = await fetch(`${API_URL}chat/cliente/${userId}`);
        
        if (response === null) {
          throw new Error('no hay chats');
        }

        if (!response.ok) {
          throw new Error('Error al obtener los chats');
        }
        
        const data = await response.json();
        setChatsCliente(data);
        console.log('Chats recibidos:', data);

      } catch (err) {
        console.log('Error:', err);
        setError('Error al cargar los mensajes del cliente');
      } finally {
        setLoading(false);
      }
    };

    const handleChatPress = (chatId: number) => {
      console.log('ID del chat:', chatId);
      router.push(`/(tabs)/(mas)/(mensajes)/chat?id=${chatId}`);
    };

    useEffect(() => {
      loadUsuario();
    }, []);


    const handleRefresh = () => {
      setLoading(true);
      loadUsuario();
    };
    
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8BC34A" />
        </View>
      );
    }

    if (usuario.id_tipo == 3) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} />}
          >
            <View style={styles.container}>
            {chatsCliente.length > 0 ? (
    chatsCliente.map((chat) => (
          <BotonMensaje
            key={`chat-${chat.id}`} 
            textoBoton={chat.nombre}
            textoProfesion={chat.descripcion}
            fecha={chat.f_creacion}
            colorTextoProfesion='#424242'      
            avatar={chat.foto}
            colorTexto='#8BC34A'
            bgColor='#F5F5F5'
            onPress={() => handleChatPress(chat.id)}
          />
    ))
  ) : (
    <Text style={styles.noMessagesText}>No tienes chats activos</Text>
  )}
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    if (usuario.id_tipo === 2) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} />}
          >
            <View style={styles.container}>
            {chatsTrabajador.length > 0 ? (
    chatsTrabajador.map((chat) => (
          <BotonMensaje
            key={`chat-${chat.id}`} 
            textoBoton={chat.nombre + ' ' + chat.apellido}
            textoProfesion={chat.descripcion}
            fecha={chat.f_creacion}
            colorTextoProfesion='#424242'      
            avatar={chat.foto}
            colorTexto='#8BC34A'
            bgColor='#F5F5F5'
            onPress={() => handleChatPress(chat.id)}
          />
    ))
  ) : (
    <Text style={styles.noMessagesText}>No tienes chats activos</Text>
  )}
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
   
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