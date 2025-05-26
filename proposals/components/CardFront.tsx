import React from 'react';
import { CardConfig } from './types';

interface CardFrontProps {
  config: CardConfig;
  isDark?: boolean;
  data?: any;
}

/**
 * Card Front Face Component
 * 
 * This component renders the front face of the card.
 * Customize this to match your card's design and functionality.
 */
const CardFront: React.FC<CardFrontProps> = ({ config, isDark = false, data }) => {
  return (
    <div className="w-full h-full p-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold truncate">
            {config.name}
          </h3>
          <p className="text-sm opacity-70 truncate">
            {config.description}
          </p>
        </div>
        
        {/* Status Indicator */}
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: config.theme.primary }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center">
        {/* Icon or Logo */}
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${config.theme.primary}20` }}
        >
          <div 
            className="w-8 h-8 rounded"
            style={{ backgroundColor: config.theme.primary }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs opacity-60">
        <span>v{config.version}</span>
        <span>{config.category}</span>
      </div>

      {/* Data Display (if available) */}
      {data && (
        <div className="absolute top-2 right-2">
          <div 
            className="px-2 py-1 rounded text-xs"
            style={{ 
              backgroundColor: `${config.theme.accent}20`,
              color: config.theme.accent 
            }}
          >
            {typeof data === 'object' ? JSON.stringify(data).slice(0, 10) + '...' : String(data)}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardFront; 