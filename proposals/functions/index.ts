/**
 * L2 - Swipe Functions Export
 * 
 * This file exports all swipe function handlers.
 * Each function corresponds to a swipe direction and handles the business logic.
 */

import { upSwipe } from './upSwipe';
import { downSwipe } from './downSwipe';
import { leftSwipe } from './leftSwipe';
import { rightSwipe } from './rightSwipe';
import { SwipeDirection, SwipeFunctionProps } from '../components/types';

// Export individual functions
export { upSwipe, downSwipe, leftSwipe, rightSwipe };

// Main swipe handler that routes to appropriate function
export const handleSwipe = async (
  direction: SwipeDirection,
  props: SwipeFunctionProps
): Promise<any> => {
  try {
    switch (direction) {
      case 'up':
        return await upSwipe(props);
      case 'down':
        return await downSwipe(props);
      case 'left':
        return await leftSwipe(props);
      case 'right':
        return await rightSwipe(props);
      default:
        throw new Error(`Unknown swipe direction: ${direction}`);
    }
  } catch (error) {
    console.error(`Error handling ${direction} swipe:`, error);
    throw error;
  }
};

// Function metadata for validation
export const swipeFunctions = {
  up: {
    handler: upSwipe,
    label: 'Create',
    description: 'Create new item',
    icon: 'Plus'
  },
  down: {
    handler: downSwipe,
    label: 'Settings',
    description: 'Open settings',
    icon: 'Settings'
  },
  left: {
    handler: leftSwipe,
    label: 'Directory',
    description: 'View history',
    icon: 'Clock'
  },
  right: {
    handler: rightSwipe,
    label: 'Drafts',
    description: 'Drafts content',
    icon: 'Drafts2'
  }
}; 