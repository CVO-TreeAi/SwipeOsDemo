import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps, PanInfo } from 'framer-motion';
import { SwipeDirection, Theme } from '../BaseCard/types';

interface WalletCardProps extends Omit<HTMLMotionProps<"div">, 'onDragEnd'> {
  index: number;
  totalCards: number;
  theme: Theme;
  onSwipe?: (direction: SwipeDirection) => void;
  onDragComplete?: (offset: number) => void;
  onTap?: () => void;
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
  onDragComplete,
  onTap,
  isActive,
  children,
  className = '',
  cardHeight = 560,
  ...motionProps
}, ref) => {
  const CARD_OFFSET = 60; // Reduced for tighter stacking
  const SCALE_FACTOR = 0.04; // Slightly more pronounced scaling
  const DRAG_THRESHOLD = 80; // Lower threshold for easier swiping
  const VELOCITY_THRESHOLD = 300; // Lower velocity threshold

  const yOffset = isActive ? 0 : index * CARD_OFFSET;
  const scale = isActive ? 1 : Math.max(0.85, 1 - (index * SCALE_FACTOR));
  const zIndex = totalCards - index;
  const rotation = isActive ? 0 : Math.min(index * 2, 8); // Cap rotation
  const opacity = isActive ? 1 : Math.max(0.7, 1 - (index * 0.15));

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const absOffsetY = Math.abs(offset.y);
    const absVelocityY = Math.abs(velocity.y);
    
    // More sensitive swipe detection
    if (absOffsetY > DRAG_THRESHOLD || absVelocityY > VELOCITY_THRESHOLD) {
      if (offset.y < -DRAG_THRESHOLD || velocity.y < -VELOCITY_THRESHOLD) {
        onSwipe?.('up');
      } else if (offset.y > DRAG_THRESHOLD || velocity.y > VELOCITY_THRESHOLD) {
        onSwipe?.('down');
      }
    }
    
    onDragComplete?.(offset.y);
  };

  const handleTap = () => {
    if (!isActive) {
      onTap?.();
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`wallet-card absolute w-[calc(100vw-2rem)] max-w-[398px] cursor-pointer ${className}`}
      style={{
        height: `${cardHeight}px`,
        zIndex: isActive ? 100 : zIndex,
        transformOrigin: 'center bottom',
        transformStyle: 'preserve-3d',
      }}
      initial={false}
      animate={{
        y: yOffset,
        scale,
        rotateZ: rotation,
        rotateX: isActive ? 0 : -8,
        opacity,
      }}
      drag={isActive ? "y" : false}
      dragConstraints={{ top: -400, bottom: 400 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      whileDrag={{
        scale: 1.05,
        rotateZ: 0,
        rotateX: 0,
        zIndex: 101,
        cursor: 'grabbing',
        transition: {
          duration: 0.1,
        }
      }}
      whileHover={!isActive ? {
        y: yOffset - 15,
        scale: scale + 0.03,
        rotateX: -5,
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      } : {
        scale: 1.02,
        transition: {
          duration: 0.2,
        }
      }}
      whileTap={!isActive ? {
        scale: scale + 0.05,
        transition: {
          duration: 0.1,
        }
      } : undefined}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8,
      }}
      {...motionProps}
    >
      <div
        className={`
          w-full h-full rounded-[2rem] overflow-hidden relative
          ${isActive 
            ? 'shadow-[0_25px_80px_-15px_rgba(0,0,0,0.6)]' 
            : 'shadow-[0_15px_50px_-15px_rgba(0,0,0,0.4)]'
          }
          transition-all duration-500 ease-out
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
        {/* Overlay for non-active cards */}
        {!isActive && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              backdropFilter: 'blur(1px)',
            }}
          />
        )}
        
        {/* Card content */}
        <div className={`relative w-full h-full transition-transform duration-300 ${!isActive ? 'scale-[0.96]' : ''}`}>
          {children}
        </div>

        {/* Active card indicator */}
        {isActive && (
          <motion.div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          />
        )}
      </div>
    </motion.div>
  );
});

WalletCard.displayName = 'WalletCard'; 