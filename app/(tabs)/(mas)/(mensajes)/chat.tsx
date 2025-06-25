import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '@env';
import { recuperarStorage } from '../../../../services/asyncStorage';
import ChatMessages from '../../../../components/ChatMessages';

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

  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<any>(null);
  const [checkEnviado, setCheckEnviado] = useState<number>(0);

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
      setCheckEnviado(prev => prev + 1);
      // Refrescar la lista completa de mensajes
      setNewMessage('');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      // Mostrar algún mensaje de error al usuario
    }
  };

  useEffect(() => {
    loadUsuario();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ChatMessages
        currentUserId={usuario?.id}
        currentChatId={Number(id)}
        checkEnviado={checkEnviado}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} >
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