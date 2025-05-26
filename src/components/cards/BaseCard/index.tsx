import React, { useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { BaseCardProps, SwipeDirection } from './types';

interface BaseCardComponentProps extends BaseCardProps {
  children: React.ReactNode;
}

export const BaseCard: React.FC<BaseCardComponentProps> = ({
  children,
  theme,
  onSwipe,
  className = '',
}) => {
  const constraintsRef = useRef(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const { offset } = info;

    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe
      if (offset.x > threshold) {
        onSwipe('right');
      } else if (offset.x < -threshold) {
        onSwipe('left');
      }
    } else {
      // Vertical swipe
      if (offset.y > threshold) {
        onSwipe('down');
      } else if (offset.y < -threshold) {
        onSwipe('up');
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        onSwipe('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        onSwipe('right');
        break;
      case 'ArrowUp':
        event.preventDefault();
        onSwipe('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        onSwipe('down');
        break;
    }
  };

  const themeClasses = theme === 'dark' 
    ? 'bg-gray-800 text-white border-gray-700' 
    : 'bg-white text-gray-900 border-gray-200';

  return (
    <div ref={constraintsRef} className="relative">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          w-[300px] h-[200px] 
          rounded-[1.5rem] 
          shadow-lg 
          border 
          cursor-grab 
          active:cursor-grabbing
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500 
          focus:ring-offset-2
          ${themeClasses}
          ${className}
        `}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default BaseCard; 