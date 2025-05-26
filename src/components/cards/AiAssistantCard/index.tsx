import React from 'react';
import { AiAssistantCardProps } from '../BaseCard/types';
import { MessageCircle, Sparkles } from 'lucide-react';

export const AiAssistantCard: React.FC<Omit<AiAssistantCardProps, 'onSwipe' | 'position' | 'onOpenChat'>> = ({
  unreadCount,
  theme,
}) => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xs font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">AI Assistant</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Your intelligent helper
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 space-y-4">
        <div className={`p-4 rounded-2xl ${
          theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm leading-relaxed">
                "Hello! I'm your AI assistant. How can I help you manage your tree service business today?"
              </p>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-2xl ${
          theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'
        }`}>
          <div className="space-y-2">
            <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Recent capabilities:</p>
            <ul className="text-xs space-y-1">
              <li className="flex items-center space-x-2">
                <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                <span>Schedule optimization</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                <span>Quote generation</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                <span>Customer insights</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 mt-auto">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Online & Ready
          </span>
        </div>
        
        <div className="text-xs text-gray-500">
          Response time: &lt;1s
        </div>
      </div>
    </div>
  );
};

export default AiAssistantCard; 