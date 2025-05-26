import React from 'react';
import { BaseCard } from '../BaseCard';
import { AiAssistantCardProps } from '../BaseCard/types';

export const AiAssistantCard: React.FC<AiAssistantCardProps> = ({
  unreadCount,
  onOpenChat,
  ...baseProps
}) => {
  return (
    <BaseCard {...baseProps}>
      <div className="p-6 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Assistant</h2>
              <p className={`text-xs ${baseProps.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Ready to help
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className={`p-3 rounded-lg ${
            baseProps.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className="text-sm">
              "How can I help you today? I'm here to assist with your tree service needs."
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-xs ${baseProps.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Online
              </span>
            </div>
            
            <button
              onClick={onOpenChat}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Open Chat
            </button>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default AiAssistantCard; 