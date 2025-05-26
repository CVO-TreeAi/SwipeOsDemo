import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardDefinition, SwipeDirection } from './types';
import ProfileCard from '../cards/profile';
import BusinessIdCard from '../cards/business-id';
import SettingsCard from '../cards/settings';
import AiAssistantCard from '../cards/ai-assistant';

interface DeckManagerProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export default function DeckManager({ theme, onThemeToggle }: DeckManagerProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: theme === 'dark',
    autoSync: false,
    locationServices: true,
  });

  // Sample data
  const userData = {
    userName: "John Doe",
    avatarUrl: "",
    companyName: "Tech Solutions Inc",
    companyLogoUrl: "",
    contactEmail: "contact@techsolutions.com",
    phone: "+1 (555) 123-4567",
  };

  const cards: CardDefinition[] = [
    { id: 'profile', level: 1, position: 0, feature: 'Profile' },
    { id: 'business-id', level: 1, position: 1, feature: 'Business ID' },
    { id: 'settings', level: 1, position: 2, feature: 'Settings' },
    { id: 'ai-assistant', level: 1, position: 3, feature: 'AI Assistant' },
  ];

  const handleSwipe = useCallback((direction: SwipeDirection) => {
    switch (direction) {
      case 'right':
        if (currentCardIndex < cards.length - 1) {
          setCurrentCardIndex(currentCardIndex + 1);
        }
        break;
      case 'left':
        if (currentCardIndex > 0) {
          setCurrentCardIndex(currentCardIndex - 1);
        }
        break;
      case 'up':
        // Future: Navigate to level 2 cards
        console.log('Navigate up to level 2');
        break;
      case 'down':
        // Future: Navigate to level 0 or special actions
        console.log('Navigate down');
        break;
    }
  }, [currentCardIndex, cards.length]);

  const handleSettingsToggle = useCallback((key: string) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: !prev[key] };
      
      // Handle special settings
      if (key === 'darkMode') {
        onThemeToggle();
      }
      
      return newSettings;
    });
  }, [onThemeToggle]);

  const handleOpenChat = useCallback(() => {
    console.log('Opening AI chat...');
    // Future implementation: Open chat modal or navigate to chat
  }, []);

  const renderCurrentCard = () => {
    const currentCard = cards[currentCardIndex];
    const baseProps = {
      position: currentCard.position,
      theme,
      onSwipe: handleSwipe,
    };

    switch (currentCard.id) {
      case 'profile':
        return (
          <ProfileCard
            {...baseProps}
            userName={userData.userName}
            avatarUrl={userData.avatarUrl}
            companyName={userData.companyName}
          />
        );
      case 'business-id':
        return (
          <BusinessIdCard
            {...baseProps}
            companyLogoUrl={userData.companyLogoUrl}
            companyName={userData.companyName}
            contactEmail={userData.contactEmail}
            phone={userData.phone}
          />
        );
      case 'settings':
        return (
          <SettingsCard
            {...baseProps}
            settings={settings}
            onToggle={handleSettingsToggle}
          />
        );
      case 'ai-assistant':
        return (
          <AiAssistantCard
            {...baseProps}
            unreadCount={2}
            onOpenChat={handleOpenChat}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Card Display Area */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCardIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentCard()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Indicators */}
      <div className="mt-6 flex space-x-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentCardIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentCardIndex
                ? 'bg-blue-500'
                : theme === 'light'
                ? 'bg-gray-300'
                : 'bg-gray-600'
            }`}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className={`mt-4 text-center text-sm ${
        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
      }`}>
        <p>Swipe or use arrow keys to navigate</p>
        <p className="text-xs mt-1">
          {currentCardIndex + 1} of {cards.length}
        </p>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={onThemeToggle}
        className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          theme === 'light'
            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
        }`}
      >
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </div>
  );
}
