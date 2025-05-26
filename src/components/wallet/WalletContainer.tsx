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
  const [showMenu, setShowMenu] = useState(false);

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
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-900/20 to-black">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-20 h-20 rounded-full border-4 border-purple-500 border-t-transparent" />
          <motion.div
            className="absolute inset-0 w-20 h-20 rounded-full border-4 border-purple-300 border-t-transparent"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-screen overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 via-purple-900/10 to-black' 
        : 'bg-gradient-to-b from-gray-50 via-purple-100 to-white'
    }`}>
      {/* Status Bar Overlay - for iPhone */}
      <div className="absolute top-0 left-0 right-0 h-12 z-50 bg-gradient-to-b from-black/20 to-transparent" />

      {/* Header - Minimal and Floating */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-14 left-6 right-6 z-40 flex justify-between items-center"
      >
        <div>
          <motion.h1 
            className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            My Wallet
          </motion.h1>
          <motion.p 
            className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {cards.length} {cards.length === 1 ? 'card' : 'cards'} • Swipe up to archive
          </motion.p>
        </div>
      </motion.div>

      {/* Card Stack - Full Height */}
      <div className="absolute inset-0 pt-32 pb-24">
        <CardStack
          cards={cards}
          theme={theme}
          onCardSwipe={handleCardSwipe}
          onCardReorder={reorderCards}
        />
      </div>

      {/* Bottom Action Bar - Floating */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="absolute bottom-8 left-6 right-6 z-40"
      >
        <div className="relative">
          {/* Blur background */}
          <div className={`absolute inset-0 rounded-3xl ${
            theme === 'dark' 
              ? 'bg-gray-900/80' 
              : 'bg-white/80'
          }`} style={{ backdropFilter: 'blur(20px)' }} />
          
          {/* Action buttons */}
          <div className="relative flex items-center justify-between p-2">
            {/* Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMenu(!showMenu)}
              className={`p-4 rounded-2xl ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-gray-300' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>

            {/* Main Add Button - Centered and Prominent */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddCard}
              className={`absolute left-1/2 transform -translate-x-1/2 -top-8 p-5 rounded-full shadow-2xl ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              }`}
              style={{
                boxShadow: '0 10px 40px -10px rgba(147, 51, 234, 0.5)',
              }}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </motion.button>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-2xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800 text-gray-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-2xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800 text-gray-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`absolute bottom-32 left-6 z-50 p-4 rounded-2xl shadow-2xl ${
              theme === 'dark' 
                ? 'bg-gray-800' 
                : 'bg-white'
            }`}
            style={{
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="space-y-3 min-w-[200px]">
              <button className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700 text-white' 
                  : 'hover:bg-gray-100 text-gray-900'
              }`}>
                <span className="flex items-center">
                  <span className="mr-3">⭐</span> Favorites
                </span>
              </button>
              <button className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700 text-white' 
                  : 'hover:bg-gray-100 text-gray-900'
              }`}>
                <span className="flex items-center">
                  <span className="mr-3">🗂️</span> Categories
                </span>
              </button>
              <button className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700 text-white' 
                  : 'hover:bg-gray-100 text-gray-900'
              }`}>
                <span className="flex items-center">
                  <span className="mr-3">🗄️</span> Archived
                </span>
              </button>
              <hr className={`${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} />
              <button className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700 text-white' 
                  : 'hover:bg-gray-100 text-gray-900'
              }`}>
                <span className="flex items-center">
                  <span className="mr-3">⚙️</span> Settings
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 