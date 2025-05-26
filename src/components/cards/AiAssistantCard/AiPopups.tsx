import React, { useState } from 'react';
import { Theme } from '../BaseCard/types';
import { X, MessageSquare, History, Settings, HelpCircle, Send, Bot, User, Trash2, Star, BarChart3 } from 'lucide-react';

interface AiPopupProps {
  theme: Theme;
  onClose: () => void;
}

// New Conversation Page
export const NewConversationPopup: React.FC<AiPopupProps> = ({ theme, onClose }) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{id: number, type: 'user' | 'ai', content: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { id: Date.now(), type: 'user' as const, content: message };
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = { 
        id: Date.now() + 1, 
        type: 'ai' as const, 
        content: `I understand you're asking about "${message}". Let me help you with that. This is a demo response from the AI assistant.` 
      };
      setConversation(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className={`p-6 h-full flex flex-col ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="text-green-500" size={24} />
          New Conversation
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {conversation.length === 0 && (
          <div className="text-center py-8">
            <Bot className="mx-auto mb-4 text-green-500" size={48} />
            <p className="text-lg font-medium">Start a new conversation</p>
            <p className="text-sm opacity-70">Ask me anything and I'll help you out!</p>
          </div>
        )}

        {conversation.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.type === 'user' ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
                {msg.type === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-lg ${msg.type === 'user' ? 'bg-blue-500 text-white' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
              <Bot size={16} />
            </div>
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          className={`flex-1 p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

// View History Page
export const ViewHistoryPopup: React.FC<AiPopupProps> = ({ theme, onClose }) => {
  const conversations = [
    { id: 1, title: 'Project Planning Discussion', date: '2 hours ago', messages: 12 },
    { id: 2, title: 'Code Review Questions', date: '1 day ago', messages: 8 },
    { id: 3, title: 'Database Design Help', date: '3 days ago', messages: 15 },
    { id: 4, title: 'API Integration Issues', date: '1 week ago', messages: 6 },
    { id: 5, title: 'Performance Optimization', date: '2 weeks ago', messages: 20 }
  ];

  const handleOpenConversation = (conv: any) => {
    console.log('Opening conversation:', conv);
  };

  const handleDeleteConversation = (id: number) => {
    console.log('Deleting conversation:', id);
  };

  return (
    <div className={`p-6 h-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <History className="text-blue-500" size={24} />
          Conversation History
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`p-4 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}
            onClick={() => handleOpenConversation(conv)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{conv.title}</h3>
                <div className="flex items-center gap-4 text-sm opacity-70 mt-1">
                  <span>{conv.date}</span>
                  <span>{conv.messages} messages</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Starring conversation:', conv.id);
                  }}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                >
                  <Star size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(conv.id);
                  }}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600"
      >
        Close History
      </button>
    </div>
  );
};

// AI Settings Page
export const AiSettingsPopup: React.FC<AiPopupProps> = ({ theme, onClose }) => {
  const [settings, setSettings] = useState({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: 'You are a helpful AI assistant.',
    autoSave: true,
    notifications: true,
    darkMode: theme === 'dark'
  });

  const handleSave = () => {
    console.log('Saving AI settings:', settings);
    onClose();
  };

  return (
    <div className={`p-6 h-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="text-orange-500" size={24} />
          AI Settings
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">AI Model</label>
          <select
            value={settings.model}
            onChange={(e) => setSettings({...settings, model: e.target.value})}
            className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
          >
            <option value="gpt-4">GPT-4 (Recommended)</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="claude-3">Claude 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Temperature: {settings.temperature}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => setSettings({...settings, temperature: parseFloat(e.target.value)})}
            className="w-full"
          />
          <div className="flex justify-between text-xs opacity-70 mt-1">
            <span>Conservative</span>
            <span>Creative</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Max Tokens</label>
          <input
            type="number"
            value={settings.maxTokens}
            onChange={(e) => setSettings({...settings, maxTokens: parseInt(e.target.value)})}
            className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">System Prompt</label>
          <textarea
            value={settings.systemPrompt}
            onChange={(e) => setSettings({...settings, systemPrompt: e.target.value})}
            rows={3}
            className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Auto-save conversations</span>
            <button
              onClick={() => setSettings({...settings, autoSave: !settings.autoSave})}
              className={`w-12 h-6 rounded-full transition-colors ${settings.autoSave ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span>Push notifications</span>
            <button
              onClick={() => setSettings({...settings, notifications: !settings.notifications})}
              className={`w-12 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600"
          >
            Save Settings
          </button>
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-lg font-medium border ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Quick Ask Page
export const QuickAskPopup: React.FC<AiPopupProps> = ({ theme, onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    "How do I optimize React performance?",
    "What's the best way to handle state management?",
    "Explain async/await in JavaScript",
    "How to implement authentication?",
    "What are React hooks?"
  ];

  const handleQuickAsk = async (q?: string) => {
    const questionToAsk = q || question;
    if (!questionToAsk.trim()) return;

    setQuestion(questionToAsk);
    setIsLoading(true);
    setAnswer('');

    // Simulate AI response
    setTimeout(() => {
      setAnswer(`Here's a quick answer to "${questionToAsk}": This is a demo response that would normally come from the AI assistant. The answer would be comprehensive and helpful based on the question asked.`);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className={`p-6 h-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <HelpCircle className="text-purple-500" size={24} />
          Quick Ask
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Ask a quick question</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuickAsk()}
              placeholder="Type your question..."
              className={`flex-1 p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
            />
            <button
              onClick={() => handleQuickAsk()}
              disabled={!question.trim() || isLoading}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ask
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Or choose a quick question:</label>
          <div className="space-y-2">
            {quickQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => handleQuickAsk(q)}
                className={`w-full text-left p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {(isLoading || answer) && (
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className="font-semibold mb-2">Answer:</h3>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Thinking...</span>
              </div>
            ) : (
              <p>{answer}</p>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className={`w-full py-3 rounded-lg font-medium border ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
        >
          Close
        </button>
      </div>
    </div>
  );
}; 