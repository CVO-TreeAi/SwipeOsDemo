import React, { useState, useEffect } from 'react';
import { PopupProps } from '../components/types';

/**
 * Down Popup - Settings
 * 
 * This popup is triggered by the down swipe gesture.
 * Customize this to implement your card's settings functionality.
 */
const DownPopup: React.FC<PopupProps> = ({ config, isDark = false, onClose, data }) => {
  const [settings, setSettings] = useState({
    theme: 'auto',
    notifications: true,
    autoSync: false,
    language: 'en',
    dataRetention: '30'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load existing settings
    const savedSettings = localStorage.getItem(`${config.id}_settings`);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [config.id]);

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Save settings
      localStorage.setItem(`${config.id}_settings`, JSON.stringify(settings));

      setMessage('Settings saved successfully!');
      
      // Close popup after success
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      setMessage('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      theme: 'auto',
      notifications: true,
      autoSync: false,
      language: 'en',
      dataRetention: '30'
    });
    setMessage('Settings reset to defaults');
  };

  const themeColors = isDark ? {
    background: config.theme.backgroundDark,
    text: config.theme.textDark,
  } : {
    background: config.theme.background,
    text: config.theme.text,
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: `${themeColors.background}f0` }}
    >
      <div 
        className="w-full max-w-md rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: themeColors.background,
          color: themeColors.text 
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Settings Form */}
        <div className="space-y-6">
          {/* Theme Setting */}
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ 
                borderColor: config.theme.primary,
                focusRingColor: config.theme.primary 
              }}
            >
              <option value="auto">Auto (System)</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Notifications</label>
              <p className="text-xs opacity-70">Receive push notifications</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.notifications ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.notifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Auto Sync */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Auto Sync</label>
              <p className="text-xs opacity-70">Automatically sync data</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, autoSync: !settings.autoSync })}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.autoSync ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.autoSync ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ 
                borderColor: config.theme.primary,
                focusRingColor: config.theme.primary 
              }}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          {/* Data Retention */}
          <div>
            <label className="block text-sm font-medium mb-2">Data Retention (days)</label>
            <select
              value={settings.dataRetention}
              onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ 
                borderColor: config.theme.primary,
                focusRingColor: config.theme.primary 
              }}
            >
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
              <option value="0">Forever</option>
            </select>
          </div>

          {/* Message */}
          {message && (
            <div className={`text-sm p-2 rounded ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="flex-1 py-2 px-4 border rounded-md font-medium"
              style={{ borderColor: config.theme.primary, color: config.theme.primary }}
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 py-2 px-4 rounded-md text-white font-medium disabled:opacity-50"
              style={{ backgroundColor: config.theme.primary }}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownPopup; 