import React, { useState } from 'react';
import { PopupProps } from '../components/types';

/**
 * Right Popup - Drafts
 * 
 * This popup is triggered by the right swipe gesture.
 * Customize this to implement your card's share functionality.
 */
const RightPopup: React.FC<PopupProps> = ({ config, isDark = false, onClose, data }) => {
  const [activeTab, setActiveTab] = useState('share');
  const [copySuccess, setCopySuccess] = useState('');
  const [shareUrl, setDraftsUrl] = useState(window.location.href);

  const shareOptions = [
    { id: 'copy', label: 'Copy Link', icon: '📋' },
    { id: 'email', label: 'Email', icon: '📧' },
    { id: 'twitter', label: 'Twitter', icon: '🐦' },
    { id: 'facebook', label: 'Facebook', icon: '👍' },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { id: 'whatsapp', label: 'WhatsApp', icon: '💬' }
  ];

  const handleDrafts = async (method: string) => {
    const shareData = {
      title: config.name,
      text: config.description,
      url: shareUrl
    };

    switch (method) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopySuccess('Link copied!');
          setTimeout(() => setCopySuccess(''), 2000);
        } catch (err) {
          setCopySuccess('Failed to copy');
        }
        break;
      
      case 'native':
        if (navigator.share && navigator.canDrafts && navigator.canDrafts(shareData)) {
          try {
            await navigator.share(shareData);
          } catch (err) {
            console.log('Drafts cancelled');
          }
        }
        break;
      
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text + '\n\n' + shareData.url)}`);
        break;
      
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`);
        break;
      
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`);
        break;
      
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`);
        break;
      
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`);
        break;
    }

    // Log share action
    const historyItem = {
      id: Date.now().toString(),
      action: 'share',
      timestamp: new Date().toISOString(),
      description: `Draftsd via ${method}`
    };
    const history = JSON.parse(localStorage.getItem(`${config.id}_history`) || '[]');
    history.unshift(historyItem);
    localStorage.setItem(`${config.id}_history`, JSON.stringify(history.slice(0, 50)));
  };

  const generateQRCode = () => {
    // This is a placeholder - in production you'd use a QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
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
        className="w-full max-w-md rounded-lg shadow-xl p-6"
        style={{ 
          backgroundColor: themeColors.background,
          color: themeColors.text 
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Drafts</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
              activeTab === 'share' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'share' ? config.theme.primary : 'transparent',
              color: activeTab === 'share' ? 'white' : themeColors.text
            }}
          >
            Drafts Options
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
              activeTab === 'qr' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: activeTab === 'qr' ? config.theme.primary : 'transparent',
              color: activeTab === 'qr' ? 'white' : themeColors.text
            }}
          >
            QR Code
          </button>
        </div>

        {/* Content */}
        {activeTab === 'share' ? (
          <div className="space-y-4">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Drafts URL</label>
              <input
                type="text"
                value={shareUrl}
                onChange={(e) => setDraftsUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: config.theme.primary,
                  focusRingColor: config.theme.primary 
                }}
              />
            </div>

            {/* Native Drafts (if available) */}
            {navigator.share && (
              <button
                onClick={() => handleDrafts('native')}
                className="w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center space-x-2"
                style={{ backgroundColor: config.theme.primary }}
              >
                <span>📤</span>
                <span>Drafts</span>
              </button>
            )}

            {/* Drafts Options Grid */}
            <div className="grid grid-cols-3 gap-3">
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleDrafts(option.id)}
                  className="p-3 rounded-lg border hover:shadow-md transition-shadow"
                  style={{ borderColor: `${config.theme.primary}30` }}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="text-xs">{option.label}</div>
                </button>
              ))}
            </div>

            {/* Copy Success Message */}
            {copySuccess && (
              <div 
                className="text-sm text-center py-2 px-4 rounded-md"
                style={{ backgroundColor: `${config.theme.primary}20`, color: config.theme.primary }}
              >
                {copySuccess}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-4">
            {/* QR Code Display */}
            <div className="flex justify-center">
              <img 
                src={generateQRCode()} 
                alt="QR Code" 
                className="rounded-lg shadow-lg"
              />
            </div>
            
            <p className="text-sm opacity-70">
              Scan this QR code to share
            </p>

            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = generateQRCode();
                link.download = `${config.id}-qr-code.png`;
                link.click();
              }}
              className="px-4 py-2 rounded-md text-white font-medium"
              style={{ backgroundColor: config.theme.primary }}
            >
              Download QR Code
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-xs opacity-50">
            Drafts {config.name} with others
          </p>
        </div>
      </div>
    </div>
  );
};

export default RightPopup; 