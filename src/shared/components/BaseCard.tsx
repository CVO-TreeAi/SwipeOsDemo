import { motion } from 'framer-motion';
import { BaseCardProps } from '../../deck/types';

interface Props extends BaseCardProps {
  children: React.ReactNode;
  'aria-label': string;
}

export default function BaseCard({ 
  children, 
  position, 
  theme, 
  onSwipe,
  'aria-label': ariaLabel 
}: Props) {
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        const threshold = 100;
        if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
          // Horizontal swipe
          if (info.offset.x > threshold) onSwipe('right');
          else if (info.offset.x < -threshold) onSwipe('left');
        } else {
          // Vertical swipe
          if (info.offset.y > threshold) onSwipe('down');
          else if (info.offset.y < -threshold) onSwipe('up');
        }
      }}
      className={`
        w-[300px] h-[200px]
        rounded-[1.5rem]
        shadow-lg
        ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-neutral-800 text-white'}
        flex flex-col p-4
        touch-pan-x touch-pan-y
        transition-colors duration-200
        cursor-grab active:cursor-grabbing
      `}
      role="group"
      aria-label={ariaLabel}
    >
      {children}
    </motion.div>
  );
}
