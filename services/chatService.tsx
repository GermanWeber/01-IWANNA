import { API_URL } from '@env';
import { Message } from '../types/chat';

let currentChatId: number | null = null;
let currentUserId: number | null = null;
const messageHandlers: ((message: any) => void)[] = [];

// Tiempo de actualización en milisegundos (5 segundos)
const POLLING_INTERVAL = 5000;
let pollingInterval: NodeJS.Timeout | null = null;

export const initializeChat = async (chatId: number, userId: number) => {
  currentChatId = chatId;
  currentUserId = userId;
  
  // Iniciar el polling
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
  
  // Cargar mensajes inmediatamente
  await fetchMessages(chatId);
  
  // Configurar polling para actualizar mensajes periódicamente
  pollingInterval = setInterval(() => {
    if (currentChatId) {
      fetchMessages(currentChatId).catch(console.error);
    }
  }, POLLING_INTERVAL);
};

export const cleanupChat = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
  currentChatId = null;
  currentUserId = null;
};

export const subscribeToMessages = (handler: (message: any) => void) => {
  messageHandlers.push(handler);
  return () => {
    const index = messageHandlers.indexOf(handler);
    if (index > -1) {
      messageHandlers.splice(index, 1);
    }
  };
};

const notifyMessage = (message: any) => {
  messageHandlers.forEach(handler => handler(message));
};

export const fetchMessages = async (chatId: number): Promise<Message[]> => {
  try {
    const response = await fetch(`${API_URL}chat/mensajes/${chatId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error HTTP! estado: ${response.status}`);
    }

    const data = await response.json();
    
    // Transformar los datos al tipo Message
    const messages = Array.isArray(data) ? data.map((message: any) => ({
      id: message.id,
      id_autor: message.id_autor,
      id_chat: message.id_chat,
      contenido: message.contenido,
      f_creacion: message.f_creacion,
      nombre: message.nombre || 'Usuario',
      foto: message.foto || ''
    })) : [];

    // Notificar sobre nuevos mensajes
    notifyMessage({
      type: 'messages_update',
      messages: messages
    });

    return messages;
  } catch (err) {
    console.error('Error al cargar mensajes:', err);
    notifyMessage({
      type: 'error',
      error: 'No se pudieron cargar los mensajes'
    });
    throw err;
  }
};

export const sendMessage = async (content: string): Promise<Message> => {
  if (!currentChatId || !currentUserId) {
    throw new Error('Chat no inicializado');
  }

  const tempId = Date.now();
  const tempMessage: Message = {
    id: -tempId, // ID temporal para actualización optimista
    id_autor: currentUserId,
    id_chat: currentChatId,
    contenido: content,
    f_creacion: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    nombre: 'Tú',
    foto: '',
  };

  // Actualización optimista
  notifyMessage({
    type: 'message',
    ...tempMessage,
  });

  try {
    const response = await fetch(`${API_URL}chat/mensajes/enviar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_chat: currentChatId,
        id_autor: currentUserId,
        contenido: content,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al enviar el mensaje');
    }

    const sentMessage = await response.json();
    
    // Transformar la respuesta al tipo Message
    const formattedMessage: Message = {
      id: sentMessage.insertId || tempId, // Usar insertId del servidor o el ID temporal
      id_autor: currentUserId,
      id_chat: currentChatId,
      contenido: content,
      f_creacion: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      nombre: 'Tú',
      foto: '',
    };
    
    // Reemplazar el mensaje temporal con el real
    notifyMessage({
      type: 'message_update',
      tempId: tempMessage.id,
      message: formattedMessage,
    });

    // Forzar una actualización de los mensajes para asegurar consistencia
    if (currentChatId) {
      await fetchMessages(currentChatId);
    }

    return formattedMessage;
  } catch (err) {
    console.error('Error al enviar el mensaje:', err);
    // Notificar sobre el error
    notifyMessage({
      type: 'message_error',
      tempId: tempMessage.id,
      error: 'No se pudo enviar el mensaje',
    });
    throw err;
  }
};

