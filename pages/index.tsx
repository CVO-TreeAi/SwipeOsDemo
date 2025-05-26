import React, { useState, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { SwipeDirection, Theme } from '../src/components/cards/BaseCard/types';

// Dynamic imports for cards
const ProfileCard = dynamic(() => import('../src/components/cards/ProfileCard'), { ssr: false });
const BusinessIdCard = dynamic(() => import('../src/components/cards/BusinessIdCard'), { ssr: false });
const SettingsCard = dynamic(() => import('../src/components/cards/SettingsCard'), { ssr: false });
const AiAssistantCard = dynamic(() => import('../src/components/cards/AiAssistantCard'), { ssr: false });

interface DeckData {
  profile: {
    userName: string;
    avatarUrl: string;
    companyName: string;
  };
  business: {
    companyLogoUrl: string;
    contactEmail: string;
    phone: string;
  };
  settings: Record<string, boolean>;
  aiAssistant: {
    unreadCount: number;
  };
}

interface DeckPageProps {
  data: DeckData;
}

const DeckPage: React.FC<DeckPageProps> = ({ data }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [theme, setTheme] = useState<Theme>('light');
  const [settings, setSettings] = useState(data.settings);

  const handleSwipe = useCallback((direction: SwipeDirection) => {
    console.log(`Swiped ${direction} on card ${currentCardIndex}`);
    
    switch (direction) {
      case 'left':
        setCurrentCardIndex((prev) => (prev + 1) % 4);
        break;
      case 'right':
        setCurrentCardIndex((prev) => (prev - 1 + 4) % 4);
        break;
      case 'up':
        // Could trigger card-specific action
        break;
      case 'down':
        // Could trigger card-specific action
        break;
    }
  }, [currentCardIndex]);

  const handleSettingToggle = useCallback(async (key: string) => {
    const newValue = !settings[key];
    
    // Optimistically update the UI
    setSettings(prev => ({
      ...prev,
      [key]: newValue
    }));

    try {
      // Get the first user ID for demo purposes
      const response = await fetch('/api/user/dashboard-data');
      const result = await response.json();
      
      // In a real app, you'd get the user ID from authentication
      const userId = 'demo-user-id'; // This would come from auth context
      
      // Update the setting in the database
      const updateResponse = await fetch('/api/user/update-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          settingKey: key,
          settingValue: newValue
        })
      });

      if (!updateResponse.ok) {
        // Revert the optimistic update if the API call fails
        setSettings(prev => ({
          ...prev,
          [key]: !newValue
        }));
        console.error('Failed to update setting');
      }
    } catch (error) {
      // Revert the optimistic update if there's an error
      setSettings(prev => ({
        ...prev,
        [key]: !newValue
      }));
      console.error('Error updating setting:', error);
    }
  }, [settings]);

  const handleOpenChat = useCallback(() => {
    console.log('Opening AI chat...');
    // Implement chat opening logic
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const cards = [
    {
      id: 'profile',
      position: 0,
      component: (
        <ProfileCard
          position={0}
          theme={theme}
          onSwipe={handleSwipe}
          userName={data.profile.userName}
          avatarUrl={data.profile.avatarUrl}
          companyName={data.profile.companyName}
        />
      )
    },
    {
      id: 'business',
      position: 1,
      component: (
        <BusinessIdCard
          position={1}
          theme={theme}
          onSwipe={handleSwipe}
          companyLogoUrl={data.business.companyLogoUrl}
          contactEmail={data.business.contactEmail}
          phone={data.business.phone}
        />
      )
    },
    {
      id: 'settings',
      position: 2,
      component: (
        <SettingsCard
          position={2}
          theme={theme}
          onSwipe={handleSwipe}
          settings={settings}
          onToggle={handleSettingToggle}
        />
      )
    },
    {
      id: 'ai-assistant',
      position: 3,
      component: (
        <AiAssistantCard
          position={3}
          theme={theme}
          onSwipe={handleSwipe}
          unreadCount={data.aiAssistant.unreadCount}
          onOpenChat={handleOpenChat}
        />
      )
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              SwipeOS Wallet
            </h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              First Login Setup
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Card Indicators */}
        <div className="flex justify-center space-x-2 mb-8">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCardIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentCardIndex 
                  ? 'bg-blue-500' 
                  : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Card Container */}
      <div className="flex justify-center px-6">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCardIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              {cards[currentCardIndex].component}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-6 mt-8">
        <div className={`text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>Swipe left/right or use arrow keys to navigate</p>
          <p className="mt-1">Swipe up/down for card actions</p>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<DeckPageProps> = async (context) => {
  try {
    // Fetch data from our API
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3002';
    
    const response = await fetch(`${baseUrl}/api/user/dashboard-data`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    
    const result = await response.json();
    
    return {
      props: {
        data: result.data
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    // Fallback to stub data if API fails
    const data: DeckData = {
      profile: {
        userName: 'John Doe',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
        companyName: 'TreeAi Services'
      },
      business: {
        companyLogoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop',
        contactEmail: 'contact@treeai.com',
        phone: '+1 (555) 123-4567'
      },
      settings: {
        notifications: true,
        darkMode: false,
        autoSync: true,
        locationServices: false,
        analytics: true
      },
      aiAssistant: {
        unreadCount: 3
      }
    };

    return {
      props: {
        data
      }
    };
  }
};

export default DeckPage;
