import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { WalletContainer } from '../src/components/wallet/WalletContainer';
import { Theme } from '../src/components/cards/BaseCard/types';
import { CardData } from '../src/components/wallet/CardStack';
import { useWalletStore } from '../src/store/walletStore';

// Import existing cards
import { ProfileCard } from '../src/components/cards/ProfileCard';
import { BusinessIdCard } from '../src/components/cards/BusinessIdCard';
import { SettingsCard } from '../src/components/cards/SettingsCard';
import { AiAssistantCard } from '../src/components/cards/AiAssistantCard';

// Import new cards
import { LoyaltyCard } from '../src/components/cards/digital/LoyaltyCard';

const V2Page: NextPage = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const { cards, addCard } = useWalletStore();

  // Clean sample data - just 4 essential cards
  const sampleCards: CardData[] = [
    {
      id: '1',
      type: 'profile',
      position: 1,
      component: (
        <ProfileCard
          theme={theme}
          name="Alex Chen"
          company="TreeAI"
          avatarUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
          completionPercentage={92}
        />
      ),
    },
    {
      id: '2',
      type: 'loyalty',
      position: 2,
      component: (
        <LoyaltyCard
          theme={theme}
          storeName="Coffee & Co"
          memberNumber="CC-2024-8901"
          points={850}
          pointsToNextReward={1000}
          barcode="850123456789"
          backgroundColor="#8B4513"
        />
      ),
    },
    {
      id: '3',
      type: 'business_id',
      position: 3,
      component: (
        <BusinessIdCard
          theme={theme}
          companyName="TreeAI"
          logoUrl="https://api.dicebear.com/7.x/identicon/svg?seed=TreeAI"
          email="hello@treeai.com"
          phone="+1 (555) 123-4567"
        />
      ),
    },
    {
      id: '4',
      type: 'ai_assistant',
      position: 4,
      component: (
        <AiAssistantCard
          theme={theme}
          unreadCount={0}
          lastMessage="Ready to help with your tree services!"
          onOpen={() => console.log('Opening AI chat')}
        />
      ),
    },
  ];

  // Initialize with sample cards
  useEffect(() => {
    if (cards.length === 0) {
      sampleCards.forEach(card => addCard(card));
    }
  }, [cards.length, addCard]);

  // Prevent overscroll bounce on iOS
  useEffect(() => {
    document.body.style.overscrollBehavior = 'none';
    return () => {
      document.body.style.overscrollBehavior = '';
    };
  }, []);

  return (
    <>
      <Head>
        <title>SwipeOS Wallet V2 - TreeAI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content={theme === 'dark' ? '#111827' : '#F9FAFB'} />
      </Head>
      
      <div className={`fixed inset-0 safe-area-top safe-area-bottom safe-area-left safe-area-right ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Theme Toggle */}
        <motion.button
          className={`fixed top-16 right-6 z-50 p-3 rounded-full backdrop-blur-md ${
            theme === 'dark' 
              ? 'bg-gray-800/80 text-yellow-400' 
              : 'bg-white/80 text-gray-800'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" fillRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </motion.button>

        {/* Version Badge */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`fixed top-16 left-6 z-50 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-md ${
            theme === 'dark' 
              ? 'bg-purple-900/30 text-purple-300 border border-purple-700/50' 
              : 'bg-purple-100/80 text-purple-800 border border-purple-200'
          }`}
        >
          v2.0
        </motion.div>

        {/* Main Wallet Container */}
        <WalletContainer theme={theme} userId="demo-user" />
      </div>
    </>
  );
};

export default V2Page; 