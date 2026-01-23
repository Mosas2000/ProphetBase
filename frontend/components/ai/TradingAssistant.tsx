'use client';

import React, { useState } from 'react';
import { MessageCircle, Send, Sparkles, TrendingUp, Target, BookOpen, HelpCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface QuickAction {
  label: string;
  query: string;
  icon: React.ReactNode;
}

export default function TradingAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Trading Assistant. I can help you with market analysis, trading strategies, risk management, and answer questions about prediction markets. What would you like to know?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      suggestions: [
        "What's the best market to invest in right now?",
        "Analyze my portfolio risk",
        "Explain how prediction markets work",
        "Show me trending opportunities"
      ],
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickActions: QuickAction[] = [
    {
      label: 'Market Analysis',
      query: 'Give me a detailed analysis of the Bitcoin $100k market',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      label: 'Trading Strategy',
      query: 'What's the best trading strategy for high volatility markets?',
      icon: <Target className="w-4 h-4" />,
    },
    {
      label: 'Risk Assessment',
      query: 'How risky is my current portfolio?',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      label: 'Learn More',
      query: 'Explain how to use prediction markets effectively',
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  const simulateAssistantResponse = (userQuery: string): string => {
    const lowerQuery = userQuery.toLowerCase();

    if (lowerQuery.includes('bitcoin') || lowerQuery.includes('100k')) {
      return "Based on current market analysis:\n\n📊 **Market Sentiment**: 78/100 (Bullish)\n\n📈 **Technical Analysis**:\n- Ascending triangle pattern detected (87% confidence)\n- Strong support at $0.65\n- Resistance at $0.72\n- Target: $0.85\n\n💡 **Recommendation**: The Bitcoin $100k market shows strong bullish momentum with multiple positive indicators. Consider entering at current levels with a stop loss at $0.63. Expected timeframe: 7-14 days.\n\n⚠️ **Risk**: Medium (58/100) - Monitor volatility and regulatory news.";
    }
    
    if (lowerQuery.includes('strategy') || lowerQuery.includes('volatility')) {
      return "For high volatility markets, here's a recommended strategy:\n\n🎯 **Position Sizing**:\n- Start with 2-3% of portfolio per trade\n- Use dollar-cost averaging for entries\n- Scale positions based on conviction\n\n📊 **Risk Management**:\n- Set stop losses 5-8% below entry\n- Take partial profits at +15%, +30%, +50%\n- Trail stops as profits increase\n\n⚡ **Timing**:\n- Avoid trading during major news events\n- Wait for confirmation signals\n- Use limit orders to control entry prices\n\n🔍 **Indicators to Watch**:\n- Volume spikes (50%+ above average)\n- Pattern confirmations (80%+ confidence)\n- Sentiment shifts (15%+ changes)\n\nWould you like me to analyze a specific market with this strategy?";
    }
    
    if (lowerQuery.includes('risk') || lowerQuery.includes('portfolio')) {
      return "📊 **Portfolio Risk Analysis**:\n\n**Overall Risk Score**: 62/100 (Medium)\n\n🔴 **High Risk Factors**:\n- Concentration: 72/100 (Too concentrated in crypto)\n- Volatility: 68/100 (High price swings)\n\n🟡 **Medium Risk Factors**:\n- Time Horizon: 58/100 (Moderate risk over time)\n\n🟢 **Low Risk Factors**:\n- Liquidity: 45/100 (Good exit options)\n\n💡 **Recommendations**:\n1. Diversify across 5-7 different markets\n2. Reduce position sizes in volatile markets by 30%\n3. Add some lower-risk, stable markets\n4. Set trailing stops on all positions\n\nWould you like me to suggest specific markets to balance your risk?";
    }
    
    if (lowerQuery.includes('prediction market') || lowerQuery.includes('how') || lowerQuery.includes('work')) {
      return "📚 **How Prediction Markets Work**:\n\n**Concept**:\nPrediction markets let you trade on the outcome of future events. Share prices represent the market's probability assessment.\n\n**Example**:\n- Market: \"Will Bitcoin reach $100k?\"\n- YES shares at $0.68 = 68% probability\n- If outcome is YES: shares worth $1.00\n- If outcome is NO: shares worth $0.00\n\n**Trading Mechanics**:\n1. **Buy YES**: You profit if event happens\n2. **Buy NO**: You profit if event doesn't happen\n3. **Sell Early**: Exit before resolution\n\n**Profit Example**:\n- Buy YES at $0.68\n- Event resolves YES\n- Profit: $1.00 - $0.68 = $0.32 (47% return)\n\n**Key Advantages**:\n✅ Clear profit/loss scenarios\n✅ Limited downside (max loss = entry price)\n✅ Can trade both directions\n✅ Early exit options\n\nWant to learn about specific strategies?";
    }
    
    if (lowerQuery.includes('opportunities') || lowerQuery.includes('trending') || lowerQuery.includes('invest')) {
      return "🔥 **Top Trading Opportunities Right Now**:\n\n**1. Bitcoin $100k Market** 🚀\n- Current: $0.68 (↑ 5%)\n- AI Confidence: 85%\n- Expected Return: +25%\n- Risk: Medium\n- Action: BUY YES\n\n**2. Inflation Market** 📊\n- Current: $0.42 (↓ 3%)\n- Pattern: Head & Shoulders (84% confidence)\n- Expected Return: +23%\n- Risk: Low\n- Action: BUY NO\n\n**3. Tech Stocks Rally** 💻\n- Current: $0.55 (→ Stable)\n- Sentiment: Bullish shift +12%\n- Expected Return: +18%\n- Risk: Medium\n- Action: ACCUMULATE\n\n**Portfolio Allocation Suggestion**:\n- 40% Bitcoin market\n- 35% Inflation market\n- 25% Tech stocks market\n\nWould you like detailed analysis on any of these?";
    }

    return "I understand you're asking about: \"" + userQuery + "\"\n\nI can help you with:\n\n📊 **Market Analysis** - Technical indicators, patterns, trends\n💰 **Trading Strategies** - Entry/exit points, position sizing\n🎯 **Risk Management** - Portfolio analysis, diversification\n📚 **Education** - How prediction markets work\n🔍 **Opportunities** - High-potential markets\n\nPlease ask me a specific question, or try one of the quick actions below!";
  };

  const handleSend = async (query?: string) => {
    const messageText = query || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const assistantResponse = simulateAssistantResponse(messageText);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
        suggestions: [
          "Tell me more",
          "Analyze another market",
          "What are the risks?",
          "Show me a strategy"
        ],
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (query: string) => {
    handleSend(query);
  };

  const handleSuggestion = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <MessageCircle className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">AI Trading Assistant</h1>
              <p className="text-slate-400">Get expert trading advice and market insights</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAction(action.query)}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-blue-500/50 transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400 group-hover:bg-blue-600/30 transition-colors">
                  {action.icon}
                </div>
              </div>
              <div className="text-sm font-semibold text-left">{action.label}</div>
            </button>
          ))}
        </div>

        {/* Chat Container */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-blue-600/20 rounded-lg">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-sm text-slate-400 font-semibold">AI Assistant</span>
                    </div>
                  )}

                  <div
                    className={`rounded-xl p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700/50 text-slate-100'
                    }`}
                  >
                    <div className="whitespace-pre-line">{message.content}</div>
                  </div>

                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="text-xs text-slate-400 mb-2">Suggested questions:</div>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestion(suggestion)}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors border border-slate-600 hover:border-blue-500/50"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-slate-500 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm text-slate-400 font-semibold">AI Assistant</span>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-700 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about trading, markets, or strategies..."
                className="flex-1 px-4 py-3 bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim()}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  inputValue.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <HelpCircle className="w-4 h-4" />
              <span>Try asking about market analysis, trading strategies, or risk management</span>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 bg-blue-600/10 border border-blue-600/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-400 mb-1">AI-Powered Intelligence</div>
              <div className="text-sm text-slate-300">
                This assistant uses advanced AI to analyze markets, detect patterns, assess risks, and provide personalized trading recommendations. All advice is for informational purposes only.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
