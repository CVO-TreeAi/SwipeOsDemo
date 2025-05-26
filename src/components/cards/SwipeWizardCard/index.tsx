import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Theme } from '../BaseCard/types';
import { SwipeAction, V4Card } from '../../../../pages/v4';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Check,
  X
} from 'lucide-react';

interface SwipeWizardCardProps {
  card: V4Card;
  theme: Theme;
  onSwipeAction: (action: SwipeAction) => Promise<void>;
  swipeProgress: {
    direction: 'up' | 'down' | 'left' | 'right' | null;
    percentage: number;
    isConfirming: boolean;
    isExecuting: boolean;
  };
  onSwipeProgress: (progress: {
    direction: 'up' | 'down' | 'left' | 'right' | null;
    percentage: number;
    isConfirming: boolean;
    isExecuting: boolean;
  }) => void;
  isSwipeInProgress: boolean;
}

export const SwipeWizardCard: React.FC<SwipeWizardCardProps> = ({
  card,
  theme,
  onSwipeAction,
  swipeProgress,
  onSwipeProgress,
  isSwipeInProgress
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null);
  const [confirmationTimeout, setConfirmationTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-200, 0, 200], [15, 0, -15]);
  const rotateY = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const scale = useTransform([x, y], ([latestX, latestY]) => {
    const distance = Math.sqrt(latestX * latestX + latestY * latestY);
    return Math.max(0.9, 1 - distance / 1000);
  });

  const cardRef = useRef<HTMLDivElement>(null);

  // Constants for swipe thresholds
  const CONFIRMATION_THRESHOLD = 0.25; // 25% of card size
  const EXECUTION_THRESHOLD = 0.5; // 50% of card size
  const CARD_SIZE = 300; // Approximate card size for calculations

  const getSwipeDirection = (deltaX: number, deltaY: number): 'up' | 'down' | 'left' | 'right' | null => {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    // Minimum threshold to register as a swipe
    if (absX < 20 && absY < 20) return null;
    
    if (absX > absY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  };

  const calculateSwipePercentage = (deltaX: number, deltaY: number): number => {
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return Math.min(distance / CARD_SIZE, 1);
  };

  const getActionForDirection = (direction: 'up' | 'down' | 'left' | 'right'): SwipeAction | null => {
    return card.actions.find(action => action.direction === direction) || null;
  };

  const handleDragStart = () => {
    setIsDragging(true);
    if (confirmationTimeout) {
      clearTimeout(confirmationTimeout);
      setConfirmationTimeout(null);
    }
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const direction = getSwipeDirection(info.offset.x, info.offset.y);
    const percentage = calculateSwipePercentage(info.offset.x, info.offset.y);
    
    setDragDirection(direction);
    
    if (direction) {
      const isConfirming = percentage >= CONFIRMATION_THRESHOLD;
      const isExecuting = percentage >= EXECUTION_THRESHOLD;
      
      onSwipeProgress({
        direction,
        percentage,
        isConfirming,
        isExecuting
      });

      // Haptic feedback on mobile
      if (isConfirming && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    const direction = getSwipeDirection(info.offset.x, info.offset.y);
    const percentage = calculateSwipePercentage(info.offset.x, info.offset.y);
    
    if (direction && percentage >= EXECUTION_THRESHOLD) {
      const action = getActionForDirection(direction);
      if (action) {
        onSwipeProgress({
          direction,
          percentage,
          isConfirming: false,
          isExecuting: true
        });
        
        await onSwipeAction(action);
      }
    }
    
    // Reset position
    x.set(0);
    y.set(0);
    setDragDirection(null);
    
    // Clear progress after a delay
    setTimeout(() => {
      onSwipeProgress({
        direction: null,
        percentage: 0,
        isConfirming: false,
        isExecuting: false
      });
    }, 300);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isSwipeInProgress) return;
      
      let direction: 'up' | 'down' | 'left' | 'right' | null = null;
      
      switch (event.key) {
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
        default:
          return;
      }
      
      event.preventDefault();
      
      if (direction) {
        const action = getActionForDirection(direction);
        if (action) {
          onSwipeAction(action);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSwipeInProgress, card.actions, onSwipeAction]);

  const getSwipeIndicatorStyle = (direction: 'up' | 'down' | 'left' | 'right') => {
    const action = getActionForDirection(direction);
    if (!action) return {};
    
    const isActive = swipeProgress.direction === direction;
    const opacity = isActive ? Math.min(swipeProgress.percentage * 2, 1) : 0.3;
    
    return {
      opacity,
      backgroundColor: isActive ? action.color.replace('bg-', '') : 'rgba(255, 255, 255, 0.1)',
    };
  };

  return (
    <div className="relative">
      {/* Swipe Indicators */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Up Indicator */}
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-4"
          style={getSwipeIndicatorStyle('up')}
          animate={{
            y: swipeProgress.direction === 'up' ? -20 - (swipeProgress.percentage * 30) : -20,
            scale: swipeProgress.direction === 'up' ? 1 + (swipeProgress.percentage * 0.3) : 1,
          }}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
            <ChevronUp size={24} className="text-white" />
          </div>
        </motion.div>

        {/* Down Indicator */}
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-4"
          style={getSwipeIndicatorStyle('down')}
          animate={{
            y: swipeProgress.direction === 'down' ? 20 + (swipeProgress.percentage * 30) : 20,
            scale: swipeProgress.direction === 'down' ? 1 + (swipeProgress.percentage * 0.3) : 1,
          }}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
            <ChevronDown size={24} className="text-white" />
          </div>
        </motion.div>

        {/* Left Indicator */}
        <motion.div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full mr-4"
          style={getSwipeIndicatorStyle('left')}
          animate={{
            x: swipeProgress.direction === 'left' ? -20 - (swipeProgress.percentage * 30) : -20,
            scale: swipeProgress.direction === 'left' ? 1 + (swipeProgress.percentage * 0.3) : 1,
          }}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
            <ChevronLeft size={24} className="text-white" />
          </div>
        </motion.div>

        {/* Right Indicator */}
        <motion.div
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full ml-4"
          style={getSwipeIndicatorStyle('right')}
          animate={{
            x: swipeProgress.direction === 'right' ? 20 + (swipeProgress.percentage * 30) : 20,
            scale: swipeProgress.direction === 'right' ? 1 + (swipeProgress.percentage * 0.3) : 1,
          }}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
            <ChevronRight size={24} className="text-white" />
          </div>
        </motion.div>
      </div>

      {/* Confirmation Overlay */}
      {swipeProgress.isConfirming && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 text-white">
              {swipeProgress.isExecuting ? (
                <>
                  <Check size={24} className="text-green-400" />
                  <span className="text-lg font-semibold">Executing...</span>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-lg font-semibold">Release to confirm</span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Card */}
      <motion.div
        ref={cardRef}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{
          x,
          y,
          rotateX,
          rotateY,
          scale,
        }}
        animate={{
          scale: isDragging ? 1.05 : 1,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
        }}
        className={`
          relative cursor-grab active:cursor-grabbing
          ${isDragging ? 'z-30' : 'z-0'}
          ${swipeProgress.isExecuting ? 'pointer-events-none' : ''}
        `}
        whileTap={{ scale: 0.98 }}
      >
        {/* Progress Ring */}
        {swipeProgress.direction && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="3"
                strokeDasharray={`${swipeProgress.percentage * 301.59} 301.59`}
                strokeDashoffset="75.4"
                transform="rotate(-90 50 50)"
                className="transition-all duration-150"
              />
            </svg>
          </div>
        )}

        {/* Card Content */}
        <div className={`
          relative z-0 transition-all duration-200
          ${swipeProgress.isConfirming ? 'brightness-110' : ''}
        `}>
          {card.component}
        </div>
      </motion.div>

      {/* Action Labels */}
      {swipeProgress.direction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
            <div className="flex items-center gap-2 text-white text-sm">
              {getActionForDirection(swipeProgress.direction)?.icon}
              <span className="font-medium">
                {getActionForDirection(swipeProgress.direction)?.label}
              </span>
              <div className="ml-2 text-xs opacity-70">
                {Math.round(swipeProgress.percentage * 100)}%
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}; 