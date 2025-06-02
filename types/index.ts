// User and Authentication Types
export interface User {
  id: string;
  fullName: string;
  avatarUrl: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

// Chat and Message Types
export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: string; // 'me' for the current user, or contact id for others
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'file';
  url: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface Chat {
  id: string;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
  lastMessage: Message;
  unreadCount: number;
  isGroup?: boolean;
  participants?: string[];
}

// Contact Types
export interface Contact {
  id: string;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
  status?: string;
  phone?: string;
  email?: string;
}

// Call Types
export interface Call {
  id: string;
  name: string;
  avatarUrl: string;
  timestamp: string;
  duration?: number; // in seconds
  status: 'ongoing' | 'completed' | 'missed' | 'rejected';
  direction: 'incoming' | 'outgoing';
  type: 'audio' | 'video';
}