/**
 * L3 - Popup Pages Export
 * 
 * This file exports all popup page components.
 * Each popup corresponds to a swipe direction and provides full-screen functionality.
 */

import UpPopup from './UpPopup';
import DownPopup from './DownPopup';
import LeftPopup from './LeftPopup';
import RightPopup from './RightPopup';
import { SwipeDirection } from '../components/types';

// Export individual popups
export { UpPopup, DownPopup, LeftPopup, RightPopup };

// Popup component mapping
export const popupComponents = {
  up: UpPopup,
  down: DownPopup,
  left: LeftPopup,
  right: RightPopup
};

// Get popup component by direction
export const getPopupComponent = (direction: SwipeDirection) => {
  return popupComponents[direction];
};

// Popup metadata for validation
export const popupMetadata = {
  up: {
    component: UpPopup,
    title: 'Create New Item',
    description: 'Create and configure new items',
    icon: 'Plus'
  },
  down: {
    component: DownPopup,
    title: 'Settings',
    description: 'Configure card settings and preferences',
    icon: 'Settings'
  },
  left: {
    component: LeftPopup,
    title: 'History',
    description: 'View activity history and past actions',
    icon: 'Clock'
  },
  right: {
    component: RightPopup,
    title: 'Share',
    description: 'Share content and generate links',
    icon: 'Share2'
  }
}; 