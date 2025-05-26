import React, { useState } from 'react';
import { Theme } from '../BaseCard/types';
import { 
  MessageSquare,
  Send,
  Mic,
  Paperclip,
  History,
  Clock,
  Search,
  Settings,
  Brain,
  Zap,
  Shield,
  Volume2,
  HelpCircle,
  BookOpen,
  Command,
  Sparkles
} from 'lucide-react';
import { supabaseMCP } from '../../../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AiNewConversationPopup: React.FC<{ theme: Theme }> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I understand your query. Let me help you with that...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              max-w-[70%] p-4 rounded-2xl
              ${message.role === 'user'
                ? isDark 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-500 text-white'
                : isDark
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-900'
              }
            `}>
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' 
                  ? 'text-blue-100' 
                  : isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className={`
              p-4 rounded-2xl
              ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
            `}>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`
        sticky bottom-0 p-4 border-t
        ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
      `}>
        <div className="flex items-center gap-3">
          <button className={`
            p-2 rounded-lg transition-colors
            ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
          `}>
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className={`
              flex-1 px-4 py-2 rounded-lg border
              ${isDark 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
          />
          <button className={`
            p-2 rounded-lg transition-colors
            ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
          `}>
            <Mic size={20} />
          </button>
          <button
            onClick={handleSend}
            className={`
              p-2 rounded-lg transition-colors
              ${isDark 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
            `}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const AiHistoryPopup: React.FC<{ theme: Theme }> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: '1',
      title: 'Project Planning Discussion',
      lastMessage: 'I\'ve created a timeline for your project...',
      timestamp: new Date(Date.now() - 3600000),
      unread: false
    },
    {
      id: '2',
      title: 'Code Review Help',
      lastMessage: 'The implementation looks good, but...',
      timestamp: new Date(Date.now() - 7200000),
      unread: true
    },
    {
      id: '3',
      title: 'Market Analysis',
      lastMessage: 'Based on the data, the trends show...',
      timestamp: new Date(Date.now() - 86400000),
      unread: false
    },
    {
      id: '4',
      title: 'Learning Resources',
      lastMessage: 'Here are some great resources for...',
      timestamp: new Date(Date.now() - 172800000),
      unread: false
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search 
          size={20} 
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`} 
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search conversations..."
          className={`
            w-full pl-10 pr-4 py-3 rounded-lg border
            ${isDark 
              ? 'bg-gray-800 border-gray-700 text-white' 
              : 'bg-gray-50 border-gray-300 text-gray-900'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
        />
      </div>

      {/* Conversations List */}
      <div className="space-y-3">
        {filteredConversations.map((conversation) => (
          <button
            key={conversation.id}
            className={`
              w-full p-4 rounded-lg border transition-all text-left
              ${isDark
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                : 'bg-white border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {conversation.title}
              </h3>
              <div className="flex items-center gap-2">
                <Clock size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {conversation.timestamp.toLocaleDateString()}
                </span>
              </div>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} line-clamp-1`}>
              {conversation.lastMessage}
            </p>
            {conversation.unread && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Unread
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export const AiSettingsPopup: React.FC<{ theme: Theme }> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [settings, setSettings] = useState({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    voiceEnabled: true,
    autoSave: true,
    contextMemory: true
  });

  return (
    <div className="space-y-6">
      {/* AI Model Selection */}
      <div>
        <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Brain className="inline mr-2" size={20} />
          AI Model
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {['gpt-4', 'gpt-3.5-turbo', 'claude-3', 'llama-2'].map((model) => (
            <button
              key={model}
              onClick={() => setSettings({ ...settings, model })}
              className={`
                p-3 rounded-lg border transition-all
                ${settings.model === model
                  ? isDark 
                    ? 'bg-blue-900/30 border-blue-600' 
                    : 'bg-blue-50 border-blue-400'
                  : isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }
              `}
            >
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {model.toUpperCase()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Performance Settings */}
      <div>
        <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Zap className="inline mr-2" size={20} />
          Performance
        </h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Temperature: {settings.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Max Tokens: {settings.maxTokens}
            </label>
            <input
              type="range"
              min="256"
              max="4096"
              step="256"
              value={settings.maxTokens}
              onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div>
        <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Settings className="inline mr-2" size={20} />
          Features
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Volume2 size={18} />
              Voice Assistant
            </span>
            <input
              type="checkbox"
              checked={settings.voiceEnabled}
              onChange={(e) => setSettings({ ...settings, voiceEnabled: e.target.checked })}
              className="w-5 h-5"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Shield size={18} />
              Auto-save Conversations
            </span>
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
              className="w-5 h-5"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Sparkles size={18} />
              Context Memory
            </span>
            <input
              type="checkbox"
              checked={settings.contextMemory}
              onChange={(e) => setSettings({ ...settings, contextMemory: e.target.checked })}
              className="w-5 h-5"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export const AiQuickAskPopup: React.FC<{ theme: Theme }> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const quickPrompts = [
    {
      category: 'Writing',
      icon: <BookOpen size={20} />,
      prompts: [
        'Help me write an email',
        'Create a blog post outline',
        'Improve this paragraph',
        'Generate social media content'
      ]
    },
    {
      category: 'Coding',
      icon: <Command size={20} />,
      prompts: [
        'Debug this code',
        'Explain this concept',
        'Write a function',
        'Review my code'
      ]
    },
    {
      category: 'Analysis',
      icon: <BarChart3 size={20} />,
      prompts: [
        'Analyze this data',
        'Create a summary',
        'Find patterns',
        'Generate insights'
      ]
    },
    {
      category: 'Learning',
      icon: <HelpCircle size={20} />,
      prompts: [
        'Explain like I\'m 5',
        'Create a study guide',
        'Quiz me on this topic',
        'Provide examples'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      {quickPrompts.map((category) => (
        <div key={category.category}>
          <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {category.icon}
            {category.category}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {category.prompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setSelectedPrompt(prompt)}
                className={`
                  p-3 rounded-lg border transition-all text-left
                  ${selectedPrompt === prompt
                    ? isDark 
                      ? 'bg-blue-900/30 border-blue-600' 
                      : 'bg-blue-50 border-blue-400'
                    : isDark
                      ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {prompt}
                </p>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Selected Prompt Action */}
      {selectedPrompt && (
        <div className={`
          p-4 rounded-lg border
          ${isDark 
            ? 'bg-blue-900/20 border-blue-600' 
            : 'bg-blue-50 border-blue-400'
          }
        `}>
          <p className={`text-sm mb-3 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
            Selected: {selectedPrompt}
          </p>
          <button className={`
            w-full py-2 rounded-lg font-medium transition-colors
            ${isDark 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
          `}>
            Start Conversation
          </button>
        </div>
      )}
    </div>
  );
}; 