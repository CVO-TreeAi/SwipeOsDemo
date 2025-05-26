import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { SimpleCardStack, CardData } from '../src/components/wallet/SimpleCardStack';
import { ProfileCard } from '../src/components/cards/ProfileCard';
import { AiAssistantCard } from '../src/components/cards/AiAssistantCard';
import { BusinessIdCard } from '../src/components/cards/BusinessIdCard';
import { SettingsCard } from '../src/components/cards/SettingsCard';
import { Theme } from '../src/components/cards/BaseCard/types';

export default function V3Page() {
  const [theme, setTheme] = useState<Theme>('dark');
  const router = useRouter();

  // Initialize demo cards directly
  const cards: CardData[] = [
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

  return (
    <div className={`relative w-full h-screen overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 via-purple-900/10 to-black' 
        : 'bg-gradient-to-b from-gray-50 via-purple-100 to-white'
    }`}>
      <SimpleCardStack
        cards={cards}
        theme={theme}
        onCardSwipe={handleCardSwipe}
      />
      
      {/* Version indicator */}
      <div className="absolute top-14 right-6 z-50">
        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          v3.0
        </div>
      </div>
    </div>
  );
} 