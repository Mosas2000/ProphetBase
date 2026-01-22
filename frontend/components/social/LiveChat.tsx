'use client';

import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  timestamp: number;
  marketId?: string;
  reactions: { [emoji: string]: number };
}

interface Room {
  id: string;
  name: string;
  type: 'general' | 'market' | 'private';
  unreadCount: number;
  participants: number;
}

export default function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      username: 'CryptoTrader',
      avatar: '🎯',
      message: 'Just bought 1000 shares in Market #42. Bulls are running!',
      timestamp: Date.now() - 120000,
      marketId: '42',
      reactions: { '🔥': 3, '👍': 5 },
    },
    {
      id: '2',
      userId: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      username: 'ProphetKing',
      avatar: '👑',
      message:
        'Market analysis: YES outcome has 73% probability based on current odds',
      timestamp: Date.now() - 60000,
      reactions: { '🧠': 7, '💯': 2 },
    },
  ]);

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 'general',
      name: 'General Chat',
      type: 'general',
      unreadCount: 0,
      participants: 1247,
    },
    {
      id: 'trading',
      name: 'Trading Signals',
      type: 'general',
      unreadCount: 3,
      participants: 892,
    },
    {
      id: 'market-42',
      name: 'Market #42 Discussion',
      type: 'market',
      unreadCount: 0,
      participants: 156,
    },
  ]);

  const [currentRoom, setCurrentRoom] = useState<string>('general');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: '0x' + Math.random().toString(16).slice(2, 42),
      username: 'You',
      avatar: '👤',
      message: newMessage,
      timestamp: Date.now(),
      reactions: {},
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const newReactions = { ...msg.reactions };
          newReactions[emoji] = (newReactions[emoji] || 0) + 1;
          return { ...msg, reactions: newReactions };
        }
        return msg;
      })
    );
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <p className="text-sm text-gray-600">
            Real-time community discussion
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">2,341 online</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Rooms Sidebar */}
        <div className="col-span-1 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Rooms</h3>
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setCurrentRoom(room.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentRoom === room.id
                  ? 'bg-blue-50 border-2 border-blue-600'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{room.name}</span>
                {room.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {room.unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <span>👥</span>
                <span>{room.participants}</span>
              </div>
            </button>
          ))}

          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            + Create Room
          </button>
        </div>

        {/* Chat Area */}
        <div className="col-span-3 flex flex-col h-[600px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{msg.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">
                          {msg.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      {msg.marketId && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Market #{msg.marketId}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 mb-2">{msg.message}</p>

                    {/* Reactions */}
                    <div className="flex items-center space-x-2">
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => addReaction(msg.id, emoji)}
                          className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-sm transition-colors"
                        >
                          <span>{emoji}</span>
                          <span className="text-xs text-gray-600">{count}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => addReaction(msg.id, '👍')}
                        className="text-gray-400 hover:text-gray-600 px-2 py-1 text-sm transition-colors"
                      >
                        + React
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator */}
          {isTyping.length > 0 && (
            <div className="text-sm text-gray-500 px-4 mb-2">
              {isTyping.join(', ')} {isTyping.length === 1 ? 'is' : 'are'}{' '}
              typing...
            </div>
          )}

          {/* Input */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
