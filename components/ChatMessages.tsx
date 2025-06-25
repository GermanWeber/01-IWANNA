import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';

interface Message {
  id: number;
  id_autor: number;
  contenido: string;
  f_creacion: string;
  nombre: string;
  foto: string;
}

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
  currentUserId?: number;
  onRefresh: () => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  loading,
  error,
  currentUserId,
  onRefresh,
}) => {
  if (loading && messages.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8BC34A" />
      </View>
    );
  }

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
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
        !loading && !error ? (
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
