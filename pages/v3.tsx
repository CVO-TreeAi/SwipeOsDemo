import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { InfiniteScrollWallet, WalletCard, WalletConfig } from '../src/components/wallet/InfiniteScrollWallet';
import { ProfileCard } from '../src/components/cards/ProfileCard';
import { AiAssistantCard } from '../src/components/cards/AiAssistantCard';
import { BusinessIdCard } from '../src/components/cards/BusinessIdCard';
import { SettingsCard } from '../src/components/cards/SettingsCard';
import { Theme } from '../src/components/cards/BaseCard/types';

export default function V3Page() {
  const [theme, setTheme] = useState<Theme>('dark');
  const router = useRouter();

  // Initialize demo cards directly
  const cards: WalletCard[] = [
    {
      id: 'profile-1',
      type: 'profile',
      position: 0,
      component: (
        <ProfileCard
          userName="John Doe"
          avatarUrl="/api/placeholder/150/150"
          companyName="TreeAI"
          theme={theme}
        />
      ),
    },
    {
      id: 'ai-1',
      type: 'ai_assistant',
      position: 1,
      component: (
        <AiAssistantCard
          unreadCount={3}
          theme={theme}
        />
      ),
    },
    {
      id: 'business-1',
      type: 'business_id',
      position: 2,
      component: (
        <BusinessIdCard
          companyLogoUrl="/api/placeholder/100/100"
          contactEmail="contact@treeai.com"
          phone="+1 (555) 123-4567"
          theme={theme}
        />
      ),
    },
    {
      id: 'settings-1',
      type: 'settings',
      position: 3,
      component: (
        <SettingsCard
          settings={{
            notifications: true,
            darkMode: theme === 'dark',
            autoSync: true,
          }}
          onToggle={(key) => {
            if (key === 'darkMode') {
              setTheme(theme === 'dark' ? 'light' : 'dark');
            }
          }}
          theme={theme}
        />
      ),
    },
  ];

  const handleCardSwipe = (cardId: string, direction: any) => {
    console.log(`Card ${cardId} swiped ${direction}`);
  };

  const handleCardSelect = (card: WalletCard, index: number) => {
    console.log(`Selected card: ${card.type} at index ${index}`);
  };

  // Configure the wallet
  const config: WalletConfig = {
    title: 'Digital Wallet V3 Alpha',
    subtitle: `${cards.length} cards • Scroll to navigate • Double-tap to flip`,
    cardHeight: 320,
    cardGap: 32,
    maxWidth: 'max-w-md',
    showScrollIndicators: true,
    showFooter: true,
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <InfiniteScrollWallet
        cards={cards}
        config={config}
        theme={theme}
        onCardSwipe={handleCardSwipe}
        onCardSelect={handleCardSelect}
      />
      
      {/* Version indicator */}
      <div className="absolute top-14 right-6 z-50">
        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          V3 Alpha
        </div>
      </div>
    </div>
  );
} 