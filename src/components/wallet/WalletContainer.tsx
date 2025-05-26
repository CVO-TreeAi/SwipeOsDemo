import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme, SwipeDirection } from '../cards/BaseCard/types';
import { CardStack, CardData } from './CardStack';
import { useWalletStore } from '../../store/walletStore';
import { supabase } from '../../lib/supabase';

interface WalletContainerProps {
  theme: Theme;
  userId?: string;
}

export const WalletContainer: React.FC<WalletContainerProps> = ({ theme, userId }) => {
  const { cards, addCard, removeCard, reorderCards, fetchCards } = useWalletStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // Fetch user's cards from Supabase
    const loadCards = async () => {
      if (userId) {
        setIsLoading(true);
        await fetchCards(userId);
        setIsLoading(false);
      }
    };

    loadCards();
  }, [userId, fetchCards]);

  const handleCardSwipe = useCallback(async (cardId: string, direction: SwipeDirection) => {
    if (direction === 'up') {
      // Archive the card instead of deleting
      const { error } = await supabase
        .from('user_cards')
        .update({ is_archived: true })
        .eq('id', cardId);

      if (!error) {
        removeCard(cardId);
      }
    }
  }, [removeCard]);

  const handleAddCard = useCallback(() => {
    setShowAddModal(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              My Wallet
            </h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {cards.length} cards
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddCard}
            className={`p-3 rounded-full shadow-lg ${
              theme === 'dark' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Card Stack */}
      <div className="h-full pt-24 pb-16">
        <CardStack
          cards={cards}
          theme={theme}
          onCardSwipe={handleCardSwipe}
          onCardReorder={reorderCards}
        />
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-full ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-300' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-full ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-300' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-full ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-300' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}; 