import React from 'react';
import { BaseCard } from '../BaseCard';
import { SettingsCardProps } from '../BaseCard/types';

export const SettingsCard: React.FC<SettingsCardProps> = ({
  settings,
  onToggle,
  ...baseProps
}) => {
  const settingsEntries = Object.entries(settings);

  const formatSettingName = (key: string) => {
    return key
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <BaseCard {...baseProps}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            baseProps.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold">Settings</h2>
            <p className={`text-xs ${baseProps.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Preferences
            </p>
          </div>
        </div>
        
        <div className="flex-1 space-y-3 overflow-y-auto">
          {settingsEntries.slice(0, 3).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium">{formatSettingName(key)}</p>
              </div>
              <button
                onClick={() => onToggle(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  value 
                    ? 'bg-blue-600' 
                    : baseProps.theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={value}
                aria-label={`Toggle ${formatSettingName(key)}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
          
          {settingsEntries.length > 3 && (
            <div className={`text-xs text-center pt-2 ${
              baseProps.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              +{settingsEntries.length - 3} more settings
            </div>
          )}
        </div>
      </div>
    </BaseCard>
  );
};

export default SettingsCard; 