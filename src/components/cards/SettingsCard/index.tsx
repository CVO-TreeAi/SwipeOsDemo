import React from 'react';
import { SettingsCardProps } from '../BaseCard/types';
import { Settings, Moon, Bell, Wifi, Shield, Palette } from 'lucide-react';

export const SettingsCard: React.FC<Omit<SettingsCardProps, 'onSwipe' | 'position'>> = ({
  settings,
  onToggle,
  theme,
}) => {
  const settingsConfig = [
    { key: 'notifications', icon: Bell, color: 'text-blue-500' },
    { key: 'darkMode', icon: Moon, color: 'text-purple-500' },
    { key: 'autoSync', icon: Wifi, color: 'text-green-500' },
    { key: 'security', icon: Shield, color: 'text-red-500' },
    { key: 'themes', icon: Palette, color: 'text-pink-500' },
  ];

  const formatSettingName = (key: string) => {
    return key
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center space-x-4 mb-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <Settings className="w-8 h-8 text-gray-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage preferences
          </p>
        </div>
      </div>
      
      <div className="flex-1 space-y-4 overflow-y-auto">
        {Object.entries(settings).map(([key, value], index) => {
          const config = settingsConfig.find(c => c.key === key) || settingsConfig[0];
          const Icon = config.icon;
          
          return (
            <div 
              key={key} 
              className={`flex items-center justify-between p-3 rounded-xl ${
                theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                }`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{formatSettingName(key)}</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {value ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onToggle(key)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  value 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                    : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={value}
                aria-label={`Toggle ${formatSettingName(key)}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
      
      <div className={`mt-auto pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between text-xs">
          <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
            Last synced: 2 min ago
          </span>
          <button className="text-blue-500 hover:text-blue-600 font-medium">
            Advanced Settings →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsCard; 