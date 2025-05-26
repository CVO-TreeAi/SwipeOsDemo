import { useCallback, useRef, useEffect } from 'react';

export interface GestureCallbacks {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
}

interface GestureOptions {
  threshold?: number;
  velocityThreshold?: number;
  longPressDelay?: number;
  preventScroll?: boolean;
}

export const useGestures = (
  callbacks: GestureCallbacks,
  options: GestureOptions = {}
) => {
  const {
    threshold = 50,
    velocityThreshold = 0.3,
    longPressDelay = 500,
    preventScroll = true,
  } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    isLongPressRef.current = false;

    // Start long press timer
    if (callbacks.onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        callbacks.onLongPress?.();
      }, longPressDelay);
    }

    if (preventScroll) {
      event.preventDefault();
    }
  }, [callbacks.onLongPress, longPressDelay, preventScroll]);

  const handleTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    // Cancel long press if user moves finger
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (preventScroll) {
      event.preventDefault();
    }
  }, [preventScroll]);

  const handleTouchEnd = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // If it was a long press, don't process as swipe/tap
    if (isLongPressRef.current) {
      return;
    }

    const touchStart = touchStartRef.current;
    if (!touchStart) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const deltaTime = Date.now() - touchStart.time;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Check if it's a swipe (distance or velocity threshold met)
    if (distance > threshold || velocity > velocityThreshold) {
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Determine swipe direction
      if (absDeltaY > absDeltaX) {
        // Vertical swipe
        if (deltaY < 0) {
          callbacks.onSwipeUp?.();
        } else {
          callbacks.onSwipeDown?.();
        }
      } else {
        // Horizontal swipe
        if (deltaX < 0) {
          callbacks.onSwipeLeft?.();
        } else {
          callbacks.onSwipeRight?.();
        }
      }
    } else if (distance < 10 && deltaTime < 300) {
      // It's a tap
      callbacks.onTap?.();
    }

    touchStartRef.current = null;
  }, [callbacks, threshold, velocityThreshold]);

  const gestureHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return gestureHandlers;
}; 