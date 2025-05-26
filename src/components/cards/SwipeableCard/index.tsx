import React, { useState, useRef } from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { SwipeDirection, Theme } from '../BaseCard/types';

export interface SwipeAction {
  direction: SwipeDirection;
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  color?: string;
}

interface SwipeableCardProps {
  id: string;
  type: string;
  theme: Theme;
  frontContent: React.ReactNode;
  backContent?: React.ReactNode;
  swipeActions?: SwipeAction[];
  onSwipeComplete?: (direction: SwipeDirection) => void;
  onSwipe?: (cardId: string, direction: SwipeDirection) => void;
  className?: string;
  isSelected?: boolean; // Only selected cards can be swiped
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  id,
  type,
  theme,
  frontContent,
  backContent,
  swipeActions = [],
  onSwipeComplete,
  onSwipe,
  className = '',
  isSelected = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const [isSwipeComplete, setIsSwipeComplete] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Get available actions for each direction
  const getAction = (direction: SwipeDirection) => {
    return swipeActions.find(action => action.direction === direction);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Only allow swiping if this card is selected
    if (!isSelected) return;
    
    const { offset } = info;
    
    if (!cardRef.current) return;
    
    const cardWidth = cardRef.current.offsetWidth;
    const cardHeight = cardRef.current.offsetHeight;
    
    // Determine swipe direction and progress
    let direction: SwipeDirection | null = null;
    let progress = 0;
    
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe
      if (offset.x > 0) {
        direction = 'right';
        progress = Math.min(Math.abs(offset.x) / (cardWidth * 0.5), 1);
      } else {
        direction = 'left';
        progress = Math.min(Math.abs(offset.x) / (cardWidth * 0.5), 1);
      }
    } else {
      // Vertical swipe
      if (offset.y > 0) {
        direction = 'down';
        progress = Math.min(Math.abs(offset.y) / (cardHeight * 0.5), 1);
      } else {
        direction = 'up';
        progress = Math.min(Math.abs(offset.y) / (cardHeight * 0.5), 1);
      }
    }
    
    // Only set direction if we have an action for it
    if (direction && getAction(direction)) {
      setSwipeDirection(direction);
      setSwipeProgress(progress);
    } else {
      setSwipeDirection(null);
      setSwipeProgress(0);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isSelected) return;
    
    // Execute action if swipe is far enough (50% threshold)
    if (swipeDirection && getAction(swipeDirection) && swipeProgress >= 0.5) {
      setIsSwipeComplete(true);
      
      // Execute the action
      const action = getAction(swipeDirection);
      action?.action();
      onSwipeComplete?.(swipeDirection);
      onSwipe?.(id, swipeDirection);
      
      // Reset after animation
      setTimeout(() => {
        setIsSwipeComplete(false);
        setSwipeDirection(null);
        setSwipeProgress(0);
      }, 300);
    } else {
      // Reset if not far enough
      setSwipeDirection(null);
      setSwipeProgress(0);
    }
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

  // Get transform for the main card based on swipe
  const getCardTransform = () => {
    if (!swipeDirection || !isSelected) return {};
    
    const intensity = swipeProgress * 50; // Max 50px movement
    
    switch (swipeDirection) {
      case 'up':
        return { y: -intensity };
      case 'down':
        return { y: intensity };
      case 'left':
        return { x: -intensity };
      case 'right':
        return { x: intensity };
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
      {/* Legend Cards - Show underneath when swiping */}
      <AnimatePresence>
        {isSelected && swipeDirection && getAction(swipeDirection) && swipeProgress > 0.1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: Math.min(swipeProgress * 2, 0.8),
              scale: 0.95 + (swipeProgress * 0.05)
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`
              absolute inset-0 w-full h-full rounded-2xl overflow-hidden
              ${getAction(swipeDirection)?.color || 'bg-blue-500'}
              shadow-lg border-2 border-white/20 z-0
            `}
          >
            <div className="h-full flex flex-col items-center justify-center text-white p-6">
              <div className="text-4xl mb-4">
                {getAction(swipeDirection)?.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">
                {getAction(swipeDirection)?.label}
              </h3>
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-100"
                  style={{ width: `${swipeProgress * 100}%` }}
                />
              </div>
              <p className="text-sm opacity-80">
                {swipeProgress < 0.5 ? 'Keep swiping...' : 'Release to execute!'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        drag={isSelected}
        dragElastic={0.2}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onClick={handleTap}
        animate={{
          ...getCardTransform(),
          ...(isFlipped ? cardVariants.back : cardVariants.front),
          scale: isSwipeComplete ? 0.9 : 1,
          opacity: isSwipeComplete ? 0.8 : 1
        }}
        className={`
          w-full h-full relative z-10
          ${isSelected ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
        `}
        style={{ transformStyle: 'preserve-3d' }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
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
          
          {/* Swipe indicators - only show on selected card */}
          {isSelected && (
            <div className="absolute inset-0 pointer-events-none">
              {getAction('up') && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className={`
                    w-8 h-1 rounded-full transition-all duration-200
                    ${swipeDirection === 'up' ? 'bg-white' : 'bg-gray-300/50 dark:bg-gray-600/50'}
                  `} />
                  <span className={`
                    text-xs font-medium mt-1 px-2 py-0.5 rounded-full transition-all duration-200
                    ${swipeDirection === 'up' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-900/20 text-gray-600 dark:bg-white/10 dark:text-gray-400'
                    }
                  `}>
                    {getAction('up')?.label}
                  </span>
                </div>
              )}
              {getAction('down') && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <span className={`
                    text-xs font-medium mb-1 px-2 py-0.5 rounded-full transition-all duration-200
                    ${swipeDirection === 'down' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-900/20 text-gray-600 dark:bg-white/10 dark:text-gray-400'
                    }
                  `}>
                    {getAction('down')?.label}
                  </span>
                  <div className={`
                    w-8 h-1 rounded-full transition-all duration-200
                    ${swipeDirection === 'down' ? 'bg-white' : 'bg-gray-300/50 dark:bg-gray-600/50'}
                  `} />
                </div>
              )}
              {getAction('left') && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center">
                  <div className={`
                    w-1 h-8 rounded-full transition-all duration-200
                    ${swipeDirection === 'left' ? 'bg-white' : 'bg-gray-300/50 dark:bg-gray-600/50'}
                  `} />
                  <span className={`
                    text-xs font-medium ml-1 px-2 py-0.5 rounded-full transition-all duration-200 whitespace-nowrap
                    ${swipeDirection === 'left' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-900/20 text-gray-600 dark:bg-white/10 dark:text-gray-400'
                    }
                  `}>
                    {getAction('left')?.label}
                  </span>
                </div>
              )}
              {getAction('right') && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                  <span className={`
                    text-xs font-medium mr-1 px-2 py-0.5 rounded-full transition-all duration-200 whitespace-nowrap
                    ${swipeDirection === 'right' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-900/20 text-gray-600 dark:bg-white/10 dark:text-gray-400'
                    }
                  `}>
                    {getAction('right')?.label}
                  </span>
                  <div className={`
                    w-1 h-8 rounded-full transition-all duration-200
                    ${swipeDirection === 'right' ? 'bg-white' : 'bg-gray-300/50 dark:bg-gray-600/50'}
                  `} />
                </div>
              )}
            </div>
          )}
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