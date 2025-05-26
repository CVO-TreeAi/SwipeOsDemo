import { SwipeFunctionProps } from '../components/types';

/**
 * Left Swipe Function - History Action
 * 
 * This function handles the left swipe gesture.
 * Customize this to implement your card's history functionality.
 */
export const leftSwipe = async (props: SwipeFunctionProps): Promise<any> => {
  const { config, data } = props;

  try {
    // Example: Load history logic
    console.log(`${config.name}: Loading history...`);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Load history from storage
    const historyItems = JSON.parse(localStorage.getItem(`${config.id}_history`) || '[]');
    
    // If no history exists, create some sample data
    if (historyItems.length === 0) {
      const sampleHistory = [
        {
          id: '1',
          action: 'create',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          description: 'Created new item'
        },
        {
          id: '2',
          action: 'update',
          timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
          description: 'Updated settings'
        },
        {
          id: '3',
          action: 'share',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          description: 'Shared content'
        }
      ];
      
      localStorage.setItem(`${config.id}_history`, JSON.stringify(sampleHistory));
      
      return {
        success: true,
        action: 'history',
        data: sampleHistory,
        message: 'History loaded successfully!'
      };
    }

    // Return existing history
    return {
      success: true,
      action: 'history',
      data: historyItems,
      message: `Loaded ${historyItems.length} history items`
    };

  } catch (error) {
    console.error('Error in leftSwipe:', error);
    return {
      success: false,
      action: 'history',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to load history'
    };
  }
}; 