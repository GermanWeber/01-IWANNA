import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { recuperarStorage } from '../../../../services/asyncStorage';
import ChatMessages from '../../../../components/ChatMessages';
import { 
  fetchMessages, 
  sendMessage, 
  initializeChat, 
  cleanupChat, 
  subscribeToMessages 
} from '../../../../services/chatService';
import { Message } from '../../../../types/chat';

export default function Chat() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<any>(null);

  // Load user data
  const loadUsuario = useCallback(async () => {
    try {
      console.log('Iniciando carga de usuario...');
      const usuarioData = await recuperarStorage('usuario');

      if (usuarioData) {
        console.log('Usuario recuperado:', usuarioData);
        setUsuario(usuarioData);
        return usuarioData;
      }
      return null;
    } catch (error) {
      console.error('Error al recuperar el usuario:', error);
      setError('Error al cargar la información del usuario');
      return null;
    }
  }, []);

  // Cargar mensajes
  const loadMessages = useCallback(async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const user = await loadUsuario();
      
      if (!user) {
        setError('No se pudo cargar la información del usuario');
        return;
      }

      // Inicializar el chat
      initializeChat(Number(id), user.id);
      
      // Cargar mensajes iniciales
      const chatMessages = await fetchMessages(Number(id));
      setMessages(chatMessages);
      
      // Limpiar errores previos
      setError(null);
      
    } catch (err) {
      console.error('Error al cargar los mensajes:', err);
      setError('Error al cargar los mensajes. Desliza hacia abajo para intentar de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [id, loadUsuario]);
  
  // Suscribirse a actualizaciones de mensajes
  useEffect(() => {
    if (!usuario?.id || !id) return;
    
    // Inicializar la suscripción a mensajes
    const unsubscribe = subscribeToMessages((message: any) => {
      if (message.type === 'messages_update') {
        setMessages(message.messages);
      } else if (message.type === 'message') {
        setMessages(prev => [...prev, message]);
      } else if (message.type === 'message_error') {
        Alert.alert('Error', 'No se pudo enviar el mensaje. Inténtalo de nuevo.');
      } else if (message.type === 'error') {
        setError(message.error || 'Ocurrió un error');
      }
    });
    
    // Cargar mensajes iniciales
    loadMessages();
    
    // Limpieza al desmontar
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      cleanupChat();
    };
  }, [id, loadMessages, usuario?.id]);

  // Initialize chat on mount
  useEffect(() => {
    loadMessages();
    
    // Cleanup on unmount
    return () => {
      cleanupChat();
    };
  }, [loadMessages]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !usuario?.id || isSending) return;
    
    const messageContent = newMessage.trim();
    setNewMessage('');
    setIsSending(true);
    
    try {
      await sendMessage(messageContent);
    } catch (err) {
      console.error('Error al enviar el mensaje:', err);
      Alert.alert('Error', 'No se pudo enviar el mensaje. Inténtalo de nuevo.');
      setNewMessage(messageContent); // Restore message if sending fails
    } finally {
      setIsSending(false);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    if (!id) return;
    
    try {
      const chatMessages = await fetchMessages(Number(id));
      setMessages(chatMessages);
    } catch (err) {
      console.error('Error al actualizar los mensajes:', err);
      setError('Error al actualizar los mensajes');
    }
  }, [id]);

  if (isLoading && messages.length === 0) {
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
      <ChatMessages
        currentUserId={usuario?.id || 0}
        currentChatId={Number(id) || 0}
        messages={messages}
        onRefresh={handleRefresh}
        loading={isLoading}
        error={error}
        onError={(errorMsg) => setError(errorMsg)}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={loadMessages}
          >
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
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { 
              backgroundColor: newMessage.trim() ? '#8BC34A' : '#CCCCCC',
              opacity: isSending ? 0.7 : 1
            }
          ]}
          onPress={handleSendMessage}
          disabled={!newMessage.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.sendText}>Enviar</Text>
          )}
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