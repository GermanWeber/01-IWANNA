import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '@env';

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

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}chat/mensajes/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error al cargar los mensajes ${id}`);
      }
      
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar los mensajes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMessages();
    }
  }, [id]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;
  
    try {
      const response = await fetch(`${API_URL}chat/mensajes/enviar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_chat: id,
          id_autor: 1, // aqui hay que remplazar con el id del local storage
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
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
  data={messages}
  keyExtractor={(item, index) => item?.id?.toString() || `message-${index}`}
  renderItem={({ item }) => (
    <View style={[
      styles.messageBubble, 
      item.id_autor === 1 ? styles.userBubble : styles.otherBubble // ID del usuario autenticado
    ]}>
      {item.nombre && item.id_autor !== 1 && (
        <Text style={styles.senderName}>{item.nombre}</Text>
      )}
      <Text style={styles.messageText}>{item.contenido}</Text>
      <Text style={styles.messageTime}>{item.f_creacion}</Text>
    </View>
  )}
  contentContainerStyle={styles.messageList}
/>
      

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
});