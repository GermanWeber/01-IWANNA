export interface Message {
  id: number;
  id_autor: number;
  id_chat: number;
  contenido: string;
  f_creacion: string;
  nombre: string;
  foto: string;
}

export interface ChatMessagesProps {
  currentChatId: number;
  currentUserId: number;
  messages: Message[];
  onRefresh: () => void;
  loading: boolean;
  error: string | null;
  onError?: (error: string) => void;
}
