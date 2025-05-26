export interface CardDefinition {
  id: string;
  level: 1 | 2 | 3;
  position: number;
  feature: string;
}

export interface BaseCardProps {
  position: number;
  theme: 'light' | 'dark';
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
}

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';
