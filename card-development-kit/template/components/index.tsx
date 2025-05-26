import React from 'react';
import { CardProps } from './types';
import CardFront from './CardFront';
import CardBack from './CardBack';

/**
 * L1 - Main Card Component
 * 
 * This is the primary card component that displays in the wallet.
 * It handles the front/back display and basic interactions.
 */
const TemplateCard: React.FC<CardProps> = ({
  config,
  isDark = false,
  isActive = false,
  onSwipe,
  data
}) => {
  const [showBack, setShowBack] = React.useState(false);

  const handleCardClick = () => {
    // Toggle between front and back (optional)
    setShowBack(!showBack);
  };

  const cardStyle = {
    width: `${config.dimensions.width}px`,
    height: `${config.dimensions.height}px`,
    borderRadius: `${config.dimensions.borderRadius}px`,
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
      className={`
        relative overflow-hidden cursor-pointer transition-all duration-300
        ${isActive ? 'scale-105 shadow-lg' : 'scale-100 shadow-md'}
        ${isDark ? 'shadow-gray-900/20' : 'shadow-gray-500/20'}
      `}
      style={{
        ...cardStyle,
        backgroundColor: themeColors.background,
        color: themeColors.text,
      }}
      onClick={handleCardClick}
    >
      {/* Card Content */}
      <div className="relative w-full h-full">
        {showBack ? (
          <CardBack 
            config={config} 
            isDark={isDark} 
            data={data} 
          />
        ) : (
          <CardFront 
            config={config} 
            isDark={isDark} 
            data={data} 
          />
        )}
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div 
          className="absolute inset-0 border-2 rounded-inherit pointer-events-none"
          style={{ borderColor: config.theme.primary }}
        />
      )}

      {/* Swipe Indicators (when active) */}
      {isActive && (
        <>
          {/* Up Swipe Indicator */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 opacity-70">
            <div className="bg-black/20 rounded-full px-2 py-1">
              <span className="text-xs text-white">
                {config.swipeActions.up.label}
              </span>
            </div>
          </div>

          {/* Down Swipe Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-70">
            <div className="bg-black/20 rounded-full px-2 py-1">
              <span className="text-xs text-white">
                {config.swipeActions.down.label}
              </span>
            </div>
          </div>

          {/* Left Swipe Indicator */}
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-70">
            <div className="bg-black/20 rounded-full px-2 py-1">
              <span className="text-xs text-white">
                {config.swipeActions.left.label}
              </span>
            </div>
          </div>

          {/* Right Swipe Indicator */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-70">
            <div className="bg-black/20 rounded-full px-2 py-1">
              <span className="text-xs text-white">
                {config.swipeActions.right.label}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplateCard; 