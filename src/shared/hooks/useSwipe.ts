import { useEffect } from 'react';
import { SwipeDirection } from '../../deck/types';

export function useSwipe(onSwipe: (direction: SwipeDirection) => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          onSwipe('right');
          break;
        case 'ArrowLeft':
          onSwipe('left');
          break;
        case 'ArrowUp':
          onSwipe('up');
          break;
        case 'ArrowDown':
          onSwipe('down');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSwipe]);
}
