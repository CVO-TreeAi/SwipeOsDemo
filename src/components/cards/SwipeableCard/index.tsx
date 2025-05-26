import React, { useState, useRef } from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { SwipeDirection, Theme } from '../BaseCard/types';

export interface SwipeAction {
  direction: SwipeDirection;
  label: string;
  icon?: React.ReactNode;
  action: () => void;
}

interface SwipeableCardProps {
  id: string;
  type: string;
  theme: Theme;
  frontContent: React.ReactNode;
  backContent?: React.ReactNode;
  swipeActions?: SwipeAction[];
  onSwipeComplete?: (direction: SwipeDirection) => void;
  className?: string;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  id,
  type,
  theme,
  frontContent,
  backContent,
  swipeActions = [],
  onSwipeComplete,
  className = '',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(null);
  const [lastTap, setLastTap] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Get available actions for each direction
  const getAction = (direction: SwipeDirection) => {
    return swipeActions.find(action => action.direction === direction);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset } = info;
    const threshold = 0.25; // 25% of card dimension
    
    if (!cardRef.current) return;
    
    const cardWidth = cardRef.current.offsetWidth;
    const cardHeight = cardRef.current.offsetHeight;
    
    // Determine swipe direction based on offset
    let direction: SwipeDirection | null = null;
    
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe
      if (offset.x > cardWidth * threshold) {
        direction = 'right';
      } else if (offset.x < -cardWidth * threshold) {
        direction = 'left';
      }
    } else {
      // Vertical swipe
      if (offset.y > cardHeight * threshold) {
        direction = 'down';
      } else if (offset.y < -cardHeight * threshold) {
        direction = 'up';
      }
    }
    
    setSwipeDirection(direction);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (swipeDirection && getAction(swipeDirection)) {
      const action = getAction(swipeDirection);
      action?.action();
      onSwipeComplete?.(swipeDirection);
    }
    setSwipeDirection(null);
  };

  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected - flip the card
      setIsFlipped(!isFlipped);
    }
    
    setLastTap(now);
  };

  // Visual feedback for swipe direction
  const getSwipeIndicatorPosition = () => {
    switch (swipeDirection) {
      case 'up':
        return { top: '10px', left: '50%', transform: 'translateX(-50%)' };
      case 'down':
        return { bottom: '10px', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { left: '10px', top: '50%', transform: 'translateY(-50%)' };
      case 'right':
        return { right: '10px', top: '50%', transform: 'translateY(-50%)' };
      default:
        return {};
    }
  };

  const cardVariants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.6, type: "spring", damping: 20 }
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.6, type: "spring", damping: 20 }
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`relative w-full h-full preserve-3d ${className}`}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        drag
        dragElastic={0.2}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onClick={handleTap}
        animate={isFlipped ? "back" : "front"}
        variants={cardVariants}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ transformStyle: 'preserve-3d' }}
        whileDrag={{ scale: 0.95 }}
      >
        {/* Front of card */}
        <div 
          className={`
            absolute inset-0 w-full h-full rounded-2xl overflow-hidden
            ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
            shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
          `}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {frontContent}
          
          {/* Swipe direction indicators */}
          <AnimatePresence>
            {swipeDirection && getAction(swipeDirection) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute z-10 bg-white/90 dark:bg-gray-900/90 rounded-full p-3 shadow-lg"
                style={getSwipeIndicatorPosition()}
              >
                <div className="flex items-center gap-2">
                  {getAction(swipeDirection)?.icon}
                  <span className="text-sm font-medium">
                    {getAction(swipeDirection)?.label}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Available swipe indicators (subtle) */}
          <div className="absolute inset-0 pointer-events-none">
            {getAction('up') && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2">
                <div className="w-8 h-1 bg-gray-300/50 dark:bg-gray-600/50 rounded-full" />
              </div>
            )}
            {getAction('down') && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <div className="w-8 h-1 bg-gray-300/50 dark:bg-gray-600/50 rounded-full" />
              </div>
            )}
            {getAction('left') && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <div className="w-1 h-8 bg-gray-300/50 dark:bg-gray-600/50 rounded-full" />
              </div>
            )}
            {getAction('right') && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <div className="w-1 h-8 bg-gray-300/50 dark:bg-gray-600/50 rounded-full" />
              </div>
            )}
          </div>
        </div>

        {/* Back of card */}
        {backContent && (
          <div 
            className={`
              absolute inset-0 w-full h-full rounded-2xl overflow-hidden
              ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
              shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
            `}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {backContent}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SwipeableCard; 