export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: number;
  read: boolean;
  attachments?: Array<{
    type: 'trade' | 'image' | 'chart';
    data: any;
  }>;
}

export interface Conversation {
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}

export class MessagingService {
  private messages: Map<string, Message[]> = new Map();
  private typing: Map<string, Set<string>> = new Map();

  sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'read'>): Message {
    const newMessage: Message = {
      ...message,
      id: `MSG-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      read: false,
    };

    const conversationId = this.getConversationId(
      message.senderId,
      message.recipientId
    );

    const conversation = this.messages.get(conversationId) || [];
    conversation.push(newMessage);
    this.messages.set(conversationId, conversation);

    return newMessage;
  }

  getConversation(userId1: string, userId2: string): Message[] {
    const conversationId = this.getConversationId(userId1, userId2);
    return this.messages.get(conversationId) || [];
  }

  markAsRead(conversationId: string, userId: string): void {
    const messages = this.messages.get(conversationId);
    if (messages) {
      messages.forEach((msg) => {
        if (msg.recipientId === userId) {
          msg.read = true;
        }
      });
    }
  }

  setTyping(conversationId: string, userId: string, isTyping: boolean): void {
    if (!this.typing.has(conversationId)) {
      this.typing.set(conversationId, new Set());
    }

    const typingUsers = this.typing.get(conversationId)!;
    if (isTyping) {
      typingUsers.add(userId);
    } else {
      typingUsers.delete(userId);
    }
  }

  isUserTyping(conversationId: string, userId: string): boolean {
    return this.typing.get(conversationId)?.has(userId) || false;
  }

  private getConversationId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('-');
  }
}
