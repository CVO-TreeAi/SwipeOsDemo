import React from 'react';
import { CardConfig } from './types';

interface CardBackProps {
  config: CardConfig;
  isDark?: boolean;
  data?: any;
}

/**
 * Card Back Face Component (Optional)
 * 
 * This component renders the back face of the card when clicked.
 * Use this to show additional information or controls.
 */
const CardBack: React.FC<CardBackProps> = ({ config, isDark = false, data }) => {
  return (
    <div className="w-full h-full p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium opacity-70">Card Details</h4>
        <div className="text-xs opacity-50">Back</div>
      </div>

      {/* Swipe Actions Preview */}
      <div className="flex-1 space-y-2">
        <div className="text-xs font-medium opacity-70 mb-2">Available Actions:</div>
        
        {/* Up Action */}
        <div className="flex items-center space-x-2 p-2 rounded" style={{ backgroundColor: `${config.theme.primary}10` }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.theme.primary }} />
          <span className="text-xs">{config.swipeActions.up.label}</span>
        </div>

        {/* Down Action */}
        <div className="flex items-center space-x-2 p-2 rounded" style={{ backgroundColor: `${config.theme.secondary}10` }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.theme.secondary }} />
          <span className="text-xs">{config.swipeActions.down.label}</span>
        </div>

        {/* Left Action */}
        <div className="flex items-center space-x-2 p-2 rounded" style={{ backgroundColor: `${config.theme.accent}10` }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.theme.accent }} />
          <span className="text-xs">{config.swipeActions.left.label}</span>
        </div>

        {/* Right Action */}
        <div className="flex items-center space-x-2 p-2 rounded" style={{ backgroundColor: `${config.theme.primary}10` }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.theme.primary }} />
          <span className="text-xs">{config.swipeActions.right.label}</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-xs opacity-50 text-center">
        Tap to flip back
      </div>
    </div>
  );
};

export default CardBack; 