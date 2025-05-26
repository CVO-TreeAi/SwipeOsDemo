import React, { useState } from 'react';
import { PopupProps } from '../components/types';

/**
 * Up Popup - Create New Item
 * 
 * This popup is triggered by the up swipe gesture.
 * Customize this to implement your card's create functionality.
 */
const UpPopup: React.FC<PopupProps> = ({ config, isDark = false, onClose, data }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new item
      const newItem = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        cardId: config.id
      };

      // Save to storage
      const existingItems = JSON.parse(localStorage.getItem(`${config.id}_items`) || '[]');
      existingItems.push(newItem);
      localStorage.setItem(`${config.id}_items`, JSON.stringify(existingItems));

      setMessage('Item created successfully!');
      
      // Close popup after success
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      setMessage('Failed to create item. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          <h2 className="text-xl font-semibold">Create New Item</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ 
                borderColor: config.theme.primary,
                focusRingColor: config.theme.primary 
              }}
              placeholder="Enter item title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 h-20"
              style={{ 
                borderColor: config.theme.primary,
                focusRingColor: config.theme.primary 
              }}
              placeholder="Enter description (optional)"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ 
                borderColor: config.theme.primary,
                focusRingColor: config.theme.primary 
              }}
            >
              <option value="general">General</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <div className="flex space-x-2">
              {['low', 'medium', 'high'].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`px-3 py-1 rounded-full text-sm capitalize ${
                    formData.priority === priority 
                      ? 'text-white' 
                      : 'border'
                  }`}
                  style={{
                    backgroundColor: formData.priority === priority ? config.theme.primary : 'transparent',
                    borderColor: config.theme.primary
                  }}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`text-sm p-2 rounded ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !formData.title}
            className="w-full py-2 px-4 rounded-md text-white font-medium disabled:opacity-50"
            style={{ backgroundColor: config.theme.primary }}
          >
            {isLoading ? 'Creating...' : 'Create Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpPopup; 