import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '@env';
import { recuperarStorage } from '../../../../services/asyncStorage';

interface Message {
  id: number;
  id_autor: number;
  contenido: string;
  f_creacion: string;
  nombre: string;
  foto: string;
}

export default function Chat() {
  const { id } = useLocalSearchParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
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
      }
    } catch (error) {
      console.log('Error al recuperar el usuario:', error);
    }
  };

  const fetchMessages = async () => {
    console.log('Iniciando carga de mensajes...');
    console.log('ID del chat:', id);
    try {
      setLoading(true);
      setError(null); // Limpiar errores anteriores

      const response = await fetch(`${API_URL}chat/mensajes/${id}`);

      if (!response.ok) {
        // Si es 404, significa que no hay mensajes, no es un error
        if (response.status === 404) {
          console.log('No hay mensajes en este chat');
          setMessages([]);
          return;
        }
        throw new Error(`Error al cargar los mensajes del chat: ${response.status}`);
      }

      const data = await response.json();

      // Verificar si la respuesta es válida
      if (Array.isArray(data)) {
        setMessages(data);
      } else if (data && Array.isArray(data.mensajes)) {
        // Si la respuesta viene envuelta en un objeto
        setMessages(data.mensajes);
      } else {
        // Si la respuesta no es un array, asumir que no hay mensajes
        console.log('Respuesta no válida, estableciendo mensajes vacíos');
        setMessages([]);
      }

    } catch (err) {
      console.error('Error al cargar mensajes:', err);
      setError('Error al cargar los mensajes del chat');
      setMessages([]); // Establecer array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMessages();
      loadUsuario();
      
      // Actualizar cada 5 segundos
      const interval = setInterval(fetchMessages, 5000);
      
      // Limpiar el intervalo al desmontar el componente
      return () => clearInterval(interval);
    }
  }, [id]);

  const sendMessage = async () => {

    console.log('enviando mensaje en chat: ', id, 'usuario: ', usuario?.id);
    if (newMessage.trim() === '') return;

    try {
      const response = await fetch(`${API_URL}chat/mensajes/enviar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_chat: id,
          id_autor: usuario?.id,
          contenido: newMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje');
      }

      const sentMessage = await response.json();

      // Refrescar la lista completa de mensajes
      await fetchMessages();
      setNewMessage('');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      // Mostrar algún mensaje de error al usuario
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchMessages();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8BC34A" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >

      <FlatList
        refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} />}
        data={messages}
        keyExtractor={(item, index) => item?.id?.toString() || `message-${index}`}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.id_autor === usuario?.id ? styles.userBubble : styles.otherBubble // ID del usuario autenticado
          ]}>
            {item.nombre && item.id_autor !== usuario?.id && (
              <Text style={styles.senderName}>{item.nombre}</Text>
            )}
            <Text style={styles.messageText}>{item.contenido}</Text>
            <Text style={styles.messageTime}>{item.f_creacion}</Text>
          </View>
        )}
        contentContainerStyle={[
          styles.messageList,
          messages.length === 0 && styles.emptyMessageList
        ]}
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay mensajes aún</Text>
              <Text style={styles.emptySubtext}>Sé el primero en escribir un mensaje</Text>
            </View>
          ) : null
        }
      />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: newMessage.trim() ? '#8BC34A' : '#CCCCCC' }
          ]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  senderName: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
    color: '#555',
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
  messageList: {
    padding: 10,
  },
  emptyMessageList: {
    flex: 1,
    justifyContent: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    marginLeft: '20%',
  },
  otherBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    marginRight: '20%',
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 10,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#999',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#8BC34A',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});