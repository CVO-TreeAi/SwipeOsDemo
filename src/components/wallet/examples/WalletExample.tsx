import React from 'react';
import { InfiniteScrollWallet, WalletCard, WalletConfig } from '../InfiniteScrollWallet';
import { ProfileCard } from '../../cards/ProfileCard';
import { AiAssistantCard } from '../../cards/AiAssistantCard';
import { BusinessIdCard } from '../../cards/BusinessIdCard';
import { SettingsCard } from '../../cards/SettingsCard';

// Custom back content for different card types
const getCustomBackContent = (type: string, theme: 'dark' | 'light') => {
  const baseClasses = `p-4 h-full flex flex-col justify-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`;
  
  switch (type.toLowerCase()) {
    case 'profile':
      return (
        <div className={baseClasses}>
          <h3 className="text-lg font-bold mb-3 text-center">Profile Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Connections</span>
              <span className="font-medium">245</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Profile Views</span>
              <span className="font-medium">1,234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Completion</span>
              <span className="font-medium">75%</span>
            </div>
          </div>
        </div>
      );
    
    case 'ai_assistant':
      return (
        <div className={baseClasses}>
          <h3 className="text-lg font-bold mb-3 text-center">AI Assistant</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Messages Today</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Total Chats</span>
              <span className="font-medium">89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Tokens Used</span>
              <span className="font-medium">15.2K</span>
            </div>
          </div>
        </div>
      );
    
    case 'business_id':
      return (
        <div className={baseClasses}>
          <h3 className="text-lg font-bold mb-3 text-center">Business Info</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Employees</span>
              <span className="font-medium">25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Founded</span>
              <span className="font-medium">2019</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Revenue</span>
              <span className="font-medium">$2.5M</span>
            </div>
          </div>
        </div>
      );
    
    case 'settings':
      return (
        <div className={baseClasses}>
          <h3 className="text-lg font-bold mb-3 text-center">Quick Settings</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-70">Dark Mode</span>
              <div className="w-8 h-5 bg-blue-500 rounded-full relative">
                <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-70">Notifications</span>
              <div className="w-8 h-5 bg-gray-300 rounded-full relative">
                <div className="w-3 h-3 bg-white rounded-full absolute top-1 left-1"></div>
              </div>
            </div>
          </div>
        </div>
      );
    
    default:
      return null;
  }
};

export const WalletExample: React.FC = () => {
  // Define your cards
  const cards: WalletCard[] = [
    {
      id: 'profile',
      type: 'profile',
      position: 0,
      component: <ProfileCard theme="dark" />,
      backContent: getCustomBackContent('profile', 'dark'),
    },
    {
      id: 'ai_assistant',
      type: 'ai_assistant',
      position: 1,
      component: <AiAssistantCard theme="dark" />,
      backContent: getCustomBackContent('ai_assistant', 'dark'),
    },
    {
      id: 'business_id',
      type: 'business_id',
      position: 2,
      component: <BusinessIdCard theme="dark" />,
      backContent: getCustomBackContent('business_id', 'dark'),
    },
    {
      id: 'settings',
      type: 'settings',
      position: 3,
      component: <SettingsCard theme="dark" />,
      backContent: getCustomBackContent('settings', 'dark'),
    },
  ];

  // Configure the wallet
  const config: WalletConfig = {
    title: 'Digital Wallet V3 Alpha',
    subtitle: 'Scroll through your cards • Double-tap to flip',
    cardHeight: 320,
    cardGap: 32,
    maxWidth: 'max-w-md',
    showScrollIndicators: true,
    showFooter: true,
    footerContent: (selectedCard) => (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <h3 className="text-white text-sm font-semibold mb-1">Selected Card</h3>
        <p className="text-gray-300 text-xs">{selectedCard?.type}</p>
      </div>
    ),
  };

  // Event handlers
  const handleCardSwipe = (cardId: string, direction: any) => {
    console.log(`Card ${cardId} swiped ${direction}`);
  };

  const handleCardSelect = (card: WalletCard, index: number) => {
    console.log(`Selected card: ${card.type} at index ${index}`);
  };

  return (
    <InfiniteScrollWallet
      cards={cards}
      config={config}
      theme="dark"
      onCardSwipe={handleCardSwipe}
      onCardSelect={handleCardSelect}
    />
  );
}; 