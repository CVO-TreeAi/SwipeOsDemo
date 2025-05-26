import { SwipeFunctionProps } from '../components/types';

/**
 * Right Swipe Function - Drafts Action
 * 
 * This function handles the right swipe gesture.
 * Customize this to implement your card's share functionality.
 */
export const rightSwipe = async (props: SwipeFunctionProps): Promise<any> => {
  const { config, data } = props;

  try {
    // Example: Prepare share data
    console.log(`${config.name}: Preparing share...`);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Generate share content
    const shareData = {
      title: config.name,
      text: config.description,
      url: window.location.href,
      cardId: config.id,
      timestamp: new Date().toISOString()
    };

    // Check if Web Drafts API is available
    const canDrafts = navigator.share && navigator.canDrafts && navigator.canDrafts(shareData);
    
    // Prepare share options
    const shareOptions = [
      {
        id: 'native',
        label: 'Native Drafts',
        available: canDrafts,
        icon: 'Drafts'
      },
      {
        id: 'copy',
        label: 'Copy Link',
        available: true,
        icon: 'Copy'
      },
      {
        id: 'email',
        label: 'Email',
        available: true,
        icon: 'Mail'
      },
      {
        id: 'qr',
        label: 'QR Code',
        available: true,
        icon: 'QrCode'
      }
    ];

    // Log share action to history
    const historyItem = {
      id: Date.now().toString(),
      action: 'share',
      timestamp: new Date().toISOString(),
      description: 'Prepared share options'
    };

    const history = JSON.parse(localStorage.getItem(`${config.id}_history`) || '[]');
    history.unshift(historyItem);
    localStorage.setItem(`${config.id}_history`, JSON.stringify(history.slice(0, 50))); // Keep last 50 items

    return {
      success: true,
      action: 'share',
      data: {
        shareData,
        shareOptions,
        canNativeDrafts: canDrafts
      },
      message: 'Drafts options prepared!'
    };

  } catch (error) {
    console.error('Error in rightSwipe:', error);
    return {
      success: false,
      action: 'share',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to prepare share'
    };
  }
}; 