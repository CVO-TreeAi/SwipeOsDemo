import React, { useState, useEffect } from 'react';
import { PopupProps } from '../components/types';

/**
 * Left Popup - History
 * 
 * This popup is triggered by the left swipe gesture.
 * Customize this to implement your card's history functionality.
 */
const LeftPopup: React.FC<PopupProps> = ({ config, isDark = false, onClose, data }) => {
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [config.id]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load history from storage
      const history = JSON.parse(localStorage.getItem(`${config.id}_history`) || '[]');
      setHistoryItems(history);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.setItem(`${config.id}_history`, '[]');
      setHistoryItems([]);
    }
  };

  const filteredItems = historyItems.filter(item => {
    if (filter === 'all') return true;
    return item.action === filter;
  });

  const themeColors = isDark ? {
    background: config.theme.backgroundDark,
    text: config.theme.textDark,
  } : {
    background: config.theme.background,
    text: config.theme.text,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'text-green-500';
      case 'update': return 'text-blue-500';
      case 'delete': return 'text-red-500';
      case 'share': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: `${themeColors.background}f0` }}
    >
      <div 
        className="w-full max-w-2xl rounded-lg shadow-xl p-6 max-h-[90vh] overflow-hidden flex flex-col"
        style={{ 
          backgroundColor: themeColors.background,
          color: themeColors.text 
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Activity History</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-4">
          {['all', 'create', 'update', 'share'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                filter === filterOption 
                  ? 'text-white' 
                  : 'border'
              }`}
              style={{
                backgroundColor: filter === filterOption ? config.theme.primary : 'transparent',
                borderColor: config.theme.primary
              }}
            >
              {filterOption}
            </button>
          ))}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: config.theme.primary }}></div>
              <p className="mt-2 text-sm opacity-70">Loading history...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg opacity-50">No history found</p>
              {filter !== 'all' && (
                <button 
                  onClick={() => setFilter('all')}
                  className="mt-2 text-sm underline"
                  style={{ color: config.theme.primary }}
                >
                  Show all history
                </button>
              )}
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div 
                key={item.id || index}
                className="p-3 rounded-lg border"
                style={{ borderColor: `${config.theme.primary}30` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium capitalize ${getActionColor(item.action)}`}>
                        {item.action}
                      </span>
                      <span className="text-xs opacity-50">•</span>
                      <span className="text-xs opacity-50">{formatDate(item.timestamp)}</span>
                    </div>
                    <p className="text-sm mt-1 opacity-80">{item.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 flex justify-between items-center pt-4 border-t">
          <span className="text-sm opacity-70">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </span>
          {historyItems.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Clear History
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftPopup; 