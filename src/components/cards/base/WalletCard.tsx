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
  cardHeight = 200,
  ...motionProps
}, ref) => {
  const CARD_OFFSET = 15; // Vertical offset between cards
  const SCALE_FACTOR = 0.05; // How much cards scale down
  const DRAG_THRESHOLD = 100;

  // Calculate position based on index
  const yOffset = index * CARD_OFFSET;
  const scale = 1 - (index * SCALE_FACTOR);
  const zIndex = totalCards - index;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    
    // Vertical swipe detection
    if (Math.abs(offset.y) > DRAG_THRESHOLD || Math.abs(velocity.y) > 500) {
      if (offset.y < 0) {
        // Swiped up - dismiss card
        onSwipe?.('up');
      } else {
        // Swiped down - could be used for refresh or other action
        onSwipe?.('down');
      }
    }
    
    onDragEnd?.(offset.y);
  };

  return (
    <motion.div
      ref={ref}
      className={`absolute w-[300px] h-[${cardHeight}px] cursor-grab active:cursor-grabbing ${className}`}
      initial={false}
      animate={{
        y: yOffset,
        scale,
        rotateX: index * -2, // Slight 3D tilt
      }}
      style={{
        zIndex,
        transformOrigin: 'center bottom',
        transformStyle: 'preserve-3d',
      }}
      drag={isActive ? "y" : false}
      dragConstraints={{ top: -200, bottom: 200 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileDrag={{
        scale: 1.05,
        rotateX: 0,
        zIndex: totalCards + 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      {...motionProps}
    >
      <div
        className={`
          w-full h-full rounded-[1.5rem] shadow-2xl overflow-hidden
          ${theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
            : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
          }
          ${isActive ? 'shadow-2xl' : 'shadow-lg'}
          transition-all duration-300
        `}
        style={{
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)', // Hardware acceleration
        }}
      >
        {children}
      </div>
    </motion.div>
  );
});

WalletCard.displayName = 'WalletCard'; 