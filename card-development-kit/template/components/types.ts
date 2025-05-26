import { ReactNode } from 'react';

// Base card configuration interface
export interface CardConfig {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: string;
  tags: string[];
  theme: CardTheme;
  swipeActions: SwipeActions;
  permissions: string[];
  dependencies: CardDependencies;
  dimensions: CardDimensions;
}

// Theme configuration
export interface CardTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundDark: string;
  text: string;
  textDark: string;
}

// Swipe actions configuration
export interface SwipeActions {
  up: SwipeAction;
  down: SwipeAction;
  left: SwipeAction;
  right: SwipeAction;
}

export interface SwipeAction {
  label: string;
  icon: string;
  description: string;
}

// Dependencies
export interface CardDependencies {
  external: string[];
  internal: string[];
}

// Dimensions
export interface CardDimensions {
  width: number;
  height: number;
  borderRadius: number;
}

// Card component props
export interface CardProps {
  config: CardConfig;
  isDark?: boolean;
  isActive?: boolean;
  onSwipe?: (direction: SwipeDirection) => void;
  data?: any;
}

// Popup component props
export interface PopupProps {
  config: CardConfig;
  isDark?: boolean;
  onClose: () => void;
  data?: any;
}

// Swipe function props
export interface SwipeFunctionProps {
  config: CardConfig;
  data?: any;
}

// Swipe directions
export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

// Card state
export interface CardState {
  isLoading?: boolean;
  error?: string;
  data?: any;
}

// Card context
export interface CardContext {
  config: CardConfig;
  state: CardState;
  setState: (state: Partial<CardState>) => void;
  executeSwipe: (direction: SwipeDirection) => Promise<void>;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} 