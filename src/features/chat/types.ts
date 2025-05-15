/**
 * Represents a chat message in the system
 */
export interface ChatMessage {
  id: string;
  sender_station_id: string;
  recipient_station_id: string | null; // null for broadcast messages
  message: string;
  timestamp: string;
  read: boolean;
  thread_id: string; // for message threading
} 