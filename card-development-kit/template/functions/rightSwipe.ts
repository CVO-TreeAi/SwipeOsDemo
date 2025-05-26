import { SwipeFunctionProps } from '../components/types';

/**
 * Right Swipe Function - Share Action
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

    // Check if Web Share API is available
    const canShare = navigator.share && navigator.canShare && navigator.canShare(shareData);
    
    // Prepare share options
    const shareOptions = [
      {
        id: 'native',
        label: 'Native Share',
        available: canShare,
        icon: 'Share'
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
        canNativeShare: canShare
      },
      message: 'Share options prepared!'
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