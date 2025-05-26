import React from 'react';
import { ProfileCardProps } from '../BaseCard/types';

export const ProfileCard: React.FC<Omit<ProfileCardProps, 'onSwipe' | 'position'>> = ({
  userName,
  avatarUrl,
  companyName,
  theme,
}) => {
  return (
    <div className="p-6 h-full flex flex-col justify-between">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={avatarUrl}
            alt={`${userName}'s avatar`}
            className="w-20 h-20 rounded-full object-cover border-3 border-blue-500 shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff&size=80`;
            }}
          />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold truncate">{userName}</h2>
          <p className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} truncate`}>
            {companyName}
          </p>
        </div>
      </div>
      
      <div className="mt-auto pt-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Profile Completion
              </span>
              <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                75%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500" style={{ width: '75%' }}>
                <div className="h-full bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i <= 3 
                      ? 'bg-blue-500' 
                      : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Last updated 2h ago
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard; 