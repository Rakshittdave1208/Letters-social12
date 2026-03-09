// src/features/messages/types.ts
export type Message = {
  id:        string;
  senderId:  string;
  senderName: string;
  text:      string;
  createdAt: any;
  read:      boolean;
};

export type Conversation = {
  id:           string;
  participants: string[];
  participantNames: Record<string, string>;
  participantPhotos: Record<string, string | null>;
  lastMessage:  string;
  lastMessageAt: any;
  unreadCount:  Record<string, number>;
};