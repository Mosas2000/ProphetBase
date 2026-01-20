'use client';

import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { formatDate } from '@/lib/utils/formatDate';
import { useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

interface Message {
  id: string;
  user: string;
  userAddress: string;
  content: string;
  timestamp: number;
  reactions: { emoji: string; count: number }[];
}

interface ChatRoomProps {
  marketId: number;
}

export default function ChatRoom({ marketId }: ChatRoomProps) {
  const { address } = useAccount();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: 'CryptoKing',
      userAddress: '0x1234...5678',
      content: 'This market is looking bullish! 🚀',
      timestamp: Date.now() - 3600000,
      reactions: [{ emoji: '🚀', count: 5 }, { emoji: '👍', count: 3 }],
    },
    {
      id: '2',
      user: 'MarketMaker',
      userAddress: '0x2345...6789',
      content: 'I disagree, fundamentals are weak',
      timestamp: Date.now() - 1800000,
      reactions: [{ emoji: '🤔', count: 2 }],
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!address || !newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      user: 'You',
      userAddress: address,
      content: newMessage,
      timestamp: Date.now(),
      reactions: [],
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(m => {
      if (m.id !== messageId) return m;
      
      const existingReaction = m.reactions.find(r => r.emoji === emoji);
      if (existingReaction) {
        return {
          ...m,
          reactions: m.reactions.map(r =>
            r.emoji === emoji ? { ...r, count: r.count + 1 } : r
          ),
        };
      } else {
        return {
          ...m,
          reactions: [...m.reactions, { emoji, count: 1 }],
        };
      }
    }));
  };

  const quickEmojis = ['👍', '🚀', '🔥', '💎', '🤔', '😂'];

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">Live Chat</h3>

      <div className="h-96 overflow-y-auto mb-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-3">
            <Avatar fallback={message.user[0]} size="sm" />
            <div className="flex-1">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{message.user}</span>
                  <span className="text-xs text-gray-500">{formatDate(message.timestamp)}</span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
              
              {message.reactions.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {message.reactions.map((reaction, idx) => (
                    <button
                      key={idx}
                      onClick={() => addReaction(message.id, reaction.emoji)}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {reaction.emoji} {reaction.count}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex gap-1 mt-1">
                {quickEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addReaction(message.id, emoji)}
                    className="text-xs hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {address ? (
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            Send
          </Button>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400">Connect wallet to join the chat</p>
        </div>
      )}
    </Card>
  );
}
