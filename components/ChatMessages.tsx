import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { API_URL } from '@env';

interface Message {
  id: number;
  id_autor: number;
  contenido: string;
  f_creacion: string;
  nombre: string;
  foto: string;
}

interface ChatMessagesProps {
  currentChatId?: number;
  currentUserId?: number;
  checkEnviado?: number;

}

const ChatMessages: React.FC<ChatMessagesProps> = ({ currentChatId, currentUserId, checkEnviado }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const flatListRef = useRef<FlatList<Message>>(null)

  const fetchMessages = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}chat/mensajes/${currentChatId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setMessages([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      let nuevosMensajes: Message[] = [];

      if (Array.isArray(data)) {
        nuevosMensajes = data;
      } else if (data && Array.isArray(data.mensajes)) {
        nuevosMensajes = data.mensajes;
      } else {
        nuevosMensajes = [];
      }

      // Solo actualizar y hacer scroll si la cantidad cambia
      if (nuevosMensajes.length !== messages.length) {
        setMessages(nuevosMensajes);
      }

    } catch (err) {
      console.error('Error al cargar mensajes:', err);
      setError('Error al cargar los mensajes del chat');
      setMessages([]);
    }
  };

  useEffect(() => {
    if (currentChatId) {
      fetchMessages();
      
      // Actualizar cada 5 segundos
      const interval = setInterval(fetchMessages, 5000);
      
      // Limpiar el intervalo al desmontar el componente
      return () => clearInterval(interval);
    }
  }, [currentChatId]);

  useEffect(() => {
    if (currentChatId) {
      fetchMessages(); // ✅ se ejecuta al inicio y cada vez que checkEnviado cambia
    }
  }, [checkEnviado]);
  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item, index) => item?.id?.toString() || `message-${index}`}
      renderItem={({ item }) => (
        <View
          style={[
            styles.messageBubble,
            item.id_autor === currentUserId
              ? styles.userBubble
              : styles.otherBubble,
          ]}>
          {item.nombre && item.id_autor !== currentUserId && (
            <Text style={styles.senderName}>{item.nombre}</Text>
          )}
          <Text style={styles.messageText}>{item.contenido}</Text>
          <Text style={styles.messageTime}>{item.f_creacion}</Text>
        </View>
      )}
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
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
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
});

export default ChatMessages;
