import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { initializeChat, cleanupChat, subscribeToMessages } from '../services/chatService';
import { ChatMessagesProps, Message } from '../types/chat';

const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  currentChatId, 
  currentUserId,
  messages,
  onRefresh,
  loading,
  error,
  onError
}) => {
  const flatListRef = useRef<FlatList<Message>>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [tempMessages, setTempMessages] = useState<{ [key: number]: Message }>({});

  // Función para comparar si dos mensajes son diferentes
  const areMessagesDifferent = (msg1: Message, msg2: Message) => {
    return (
      msg1.id !== msg2.id ||
      msg1.contenido !== msg2.contenido ||
      msg1.f_creacion !== msg2.f_creacion
    );
  };

  // Función para actualizar mensajes solo si hay cambios
  const updateMessagesIfNeeded = (newMessages: Message[], currentMessages: Message[]) => {
    // Si las longitudes son diferentes, hay cambios
    if (newMessages.length !== currentMessages.length) return true;
    
    // Buscar diferencias en los mensajes
    for (let i = 0; i < newMessages.length; i++) {
      const newMsg = newMessages[i];
      const currentMsg = currentMessages[i];
      
      // Si encontramos un mensaje diferente, hay cambios
      if (areMessagesDifferent(newMsg, currentMsg)) {
        return true;
      }
    }
    
    // No hay cambios
    return false;
  };

  // Inicializar el chat y cargar mensajes
  useEffect(() => {
    if (currentChatId && currentUserId) {
      // Inicializar la conexión del chat
      initializeChat(currentChatId, currentUserId);

      // Suscribirse a actualizaciones de mensajes
      const unsubscribe = subscribeToMessages((message: any) => {
        //console.log('Mensaje recibido:', message);
        
        if (message.type === 'message') {
          // Verificar si el mensaje ya existe
          setLocalMessages(prev => {
            const exists = prev.some(m => m.id === message.id);
            return exists ? prev : [...prev, message];
          });
          
        } else if (message.type === 'messages_update') {
          // Actualizar solo si hay cambios en los mensajes
          setLocalMessages(prev => {
            if (updateMessagesIfNeeded(message.messages, prev)) {
              console.log('Actualizando mensajes con cambios');
                if (flatListRef.current && messages.length > 0) {
                  setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                  }, 100);
                }
              return message.messages;
            }
            //console.log('No hay cambios en los mensajes');
            return prev;
          });
          
        } else if (message.type === 'message_update') {
          // Actualizar mensaje temporal con la respuesta del servidor
          setLocalMessages(prev => {
            const updated = prev.map(m => {
              if (m.id === message.tempId) {
                console.log('Actualizando mensaje temporal:', message.tempId);
                return message.message;
              }
              return m;
            });
            
            // Solo actualizar si hay cambios
            const hasChanges = prev.some((m, i) => 
              m.id === updated[i].id && areMessagesDifferent(m, updated[i])
            );
            
            return hasChanges ? updated : prev;
          });
          
          // Eliminar el mensaje temporal
          setTempMessages(prev => {
            const newTemp = { ...prev };
            delete newTemp[message.tempId];
            return newTemp;
          });
          
        } else if (message.type === 'message_error') {
          // Manejar error de envío
          setTempMessages(prev => {
            const newTemp = { ...prev };
            delete newTemp[message.tempId];
            return newTemp;
          });
          
          if (onError) {
            onError('No se pudo enviar el mensaje. Inténtalo de nuevo.');
          }
          
        } else if (message.type === 'error') {
          // Mostrar error general a través de la prop onError
          if (onError) {
            onError(message.error || 'Ocurrió un error');
          }
        }
      });

      // Limpiar al desmontar
      return () => {
        cleanupChat();
        unsubscribe();
      };
    }
  }, [currentChatId, currentUserId]);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    if (currentChatId) {
      onRefresh?.();
    }
  }, [currentChatId, onRefresh]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    // if (flatListRef.current && messages.length > 0) {
    //   setTimeout(() => {
    //     flatListRef.current?.scrollToEnd({ animated: true });
    //   }, 100);
    // }
  }, [messages]);

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => {
        const isCurrentUser = item.id_autor === currentUserId;
        const isTempMessage = item.id < 0;
        
        return (
          <View
            style={[
              styles.messageBubble,
              isCurrentUser ? styles.userBubble : styles.otherBubble,
              isTempMessage && styles.tempMessage
            ]}
          >
            {!isCurrentUser && item.nombre && (
              <Text style={styles.senderName}>{item.nombre}</Text>
            )}
            <Text style={styles.messageText}>{item.contenido}</Text>
            <View style={styles.messageFooter}>
              <Text style={styles.messageTime}>
                {item.f_creacion}
              </Text>
              {isTempMessage && (
                <View style={styles.sendingIndicator}>
                  <ActivityIndicator size="small" color="#888888" />
                </View>
              )}
            </View>
          </View>
        );
      }}
      contentContainerStyle={[
        styles.messageList,
        messages.length === 0 && styles.emptyMessageList,
      ]}
      ListEmptyComponent={
        !error ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay mensajes aún</Text>
            <Text style={styles.emptySubtext}>
              Sé el primero en escribir un mensaje
            </Text>
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )
      }
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={handleRefresh}
          colors={['#8BC34A']}
          tintColor="#8BC34A"
        />
      }
      onContentSizeChange={() => {
        if (messages.length > 0) {
          flatListRef.current?.scrollToEnd({ animated: true });
        }
      }}
      onLayout={() => {
        if (messages.length > 0) {
          flatListRef.current?.scrollToEnd({ animated: true });
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  tempMessage: {
    opacity: 0.7,
  },
  sendingIndicator: {
    
  },
  messageFooter: {
    
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    padding: 10,
  },
  emptyMessageList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
    marginVertical: 5,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 0,
  },
  otherBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 0,
  },
  senderName: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 10,
    color: '#888888',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
  },
  
});

export default ChatMessages;
