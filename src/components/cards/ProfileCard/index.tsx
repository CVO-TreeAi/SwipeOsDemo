import React from 'react';
import { BaseCard } from '../BaseCard';
import { ProfileCardProps } from '../BaseCard/types';

export const ProfileCard: React.FC<ProfileCardProps> = ({
  userName,
  avatarUrl,
  companyName,
  ...baseProps
}) => {
  return (
    <BaseCard {...baseProps}>
      <div className="p-6 h-full flex flex-col justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={`${userName}'s avatar`}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff&size=64`;
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold truncate">{userName}</h2>
            <p className={`text-sm ${baseProps.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} truncate`}>
              {companyName}
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className={`text-xs ${baseProps.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Profile Complete
            </span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className={`w-2 h-2 rounded-full ${baseProps.theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default ProfileCard; 