import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps, PanInfo } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { SwipeDirection, Theme } from '../BaseCard/types';

interface WalletCardProps extends HTMLMotionProps<"div"> {
  index: number;
  totalCards: number;
  theme: Theme;
  onSwipe?: (direction: SwipeDirection) => void;
  onDragEnd?: (offset: number) => void;
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
  cardHeight?: number;
}

export const WalletCard = forwardRef<HTMLDivElement, WalletCardProps>(({
  index,
  totalCards,
  theme,
  onSwipe,
  onDragEnd,
  isActive,
  children,
  className = '',
  cardHeight = 560,
  ...motionProps
}, ref) => {
  const CARD_OFFSET = 80;
  const SCALE_FACTOR = 0.03;
  const DRAG_THRESHOLD = 150;

  const yOffset = isActive ? 0 : index * CARD_OFFSET;
  const scale = isActive ? 1 : 1 - (index * SCALE_FACTOR);
  const zIndex = totalCards - index;
  
  const rotation = isActive ? 0 : index * 1.5;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    
    if (Math.abs(offset.y) > DRAG_THRESHOLD || Math.abs(velocity.y) > 500) {
      if (offset.y < 0) {
        onSwipe?.('up');
      } else {
        onSwipe?.('down');
      }
    }
    
    onDragEnd?.(offset.y);
  };

  return (
    <motion.div
      ref={ref}
      className={`absolute w-[calc(100vw-2rem)] max-w-[398px] h-[${cardHeight}px] cursor-grab active:cursor-grabbing ${className}`}
      initial={false}
      animate={{
        y: yOffset,
        scale,
        rotateZ: rotation,
        rotateX: isActive ? 0 : -10,
      }}
      style={{
        zIndex: isActive ? 100 : zIndex,
        transformOrigin: 'center bottom',
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      drag={isActive ? "y" : false}
      dragConstraints={{ top: -300, bottom: 300 }}
      dragElastic={0.3}
      onDragEnd={handleDragEnd}
      whileDrag={{
        scale: 1.02,
        rotateZ: 0,
        rotateX: 0,
        zIndex: 101,
        transition: {
          duration: 0.2,
        }
      }}
      whileHover={!isActive ? {
        y: yOffset - 10,
        scale: scale + 0.02,
        transition: {
          duration: 0.2,
        }
      } : undefined}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
      }}
      {...motionProps}
    >
      <div
        className={`
          w-full h-full rounded-[2rem] overflow-hidden
          ${isActive 
            ? 'shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]' 
            : 'shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)]'
          }
          transition-all duration-300
          ${theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50' 
            : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/50'
          }
        `}
        style={{
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        {!isActive && (
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10"
            style={{
              backdropFilter: 'blur(0.5px)',
            }}
          />
        )}
        
        <div className={`relative w-full h-full ${!isActive ? 'scale-[0.98]' : ''}`}>
          {children}
        </div>
      </div>
    </motion.div>
  );
});

WalletCard.displayName = 'WalletCard'; 