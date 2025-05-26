import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Theme, SwipeDirection } from '../cards/BaseCard/types';
import { WalletCard } from '../cards/base/WalletCard';

export interface CardData {
  id: string;
  type: string;
  component: React.ReactNode;
  position: number;
}

interface CardStackProps {
  cards: CardData[];
  theme: Theme;
  onCardSwipe: (cardId: string, direction: SwipeDirection) => void;
  onCardReorder?: (cards: CardData[]) => void;
  maxVisibleCards?: number;
}

export const CardStack: React.FC<CardStackProps> = ({
  cards,
  theme,
  onCardSwipe,
  onCardReorder,
  maxVisibleCards = 4,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const visibleCards = cards.slice(activeIndex, activeIndex + maxVisibleCards);

  const handleSwipe = useCallback((cardId: string, direction: SwipeDirection) => {
    if (direction === 'up') {
      // Remove card from stack
      onCardSwipe(cardId, direction);
      
      // Move to next card
      if (activeIndex < cards.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    }
  }, [activeIndex, cards.length, onCardSwipe]);

  const handleCardClick = useCallback((index: number) => {
    if (!isDragging && index !== 0) {
      // Bring clicked card to front
      const newActiveIndex = activeIndex + index;
      if (newActiveIndex < cards.length) {
        setActiveIndex(newActiveIndex);
      }
    }
  }, [activeIndex, cards.length, isDragging]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center px-4">
      {/* Stack container */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{
          perspective: '2000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Ambient glow effect */}
        <motion.div
          className={`absolute blur-[100px] opacity-30 ${
            theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
          }`}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: '500px',
            height: '500px',
            borderRadius: '50%',
          }}
        />

        {/* Cards */}
        <AnimatePresence mode="popLayout">
          {visibleCards.map((card, index) => (
            <WalletCard
              key={card.id}
              index={index}
              totalCards={visibleCards.length}
              theme={theme}
              isActive={index === 0}
              onSwipe={(direction) => handleSwipe(card.id, direction)}
              onDragEnd={handleDragEnd}
              onClick={() => handleCardClick(index)}
              onDragStart={handleDragStart}
              layoutId={card.id}
              cardHeight={560}
            >
              {card.component}
            </WalletCard>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {cards.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-[calc(100vw-2rem)] max-w-[398px] h-[560px] rounded-[2rem] border-2 border-dashed flex items-center justify-center ${
              theme === 'dark' 
                ? 'border-gray-600 text-gray-400 bg-gray-800/50' 
                : 'border-gray-300 text-gray-500 bg-white/50'
            }`}
            style={{
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="text-center p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-6xl mb-4"
              >
                💳
              </motion.div>
              <p className="text-2xl font-bold mb-2">No cards yet</p>
              <p className="text-lg opacity-75">Tap + to add your first card</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Progress indicator */}
      {cards.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2`}
        >
          {cards.map((_, index) => (
            <motion.div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? theme === 'dark' ? 'bg-white w-8' : 'bg-gray-800 w-8'
                  : index < activeIndex
                  ? theme === 'dark' ? 'bg-gray-600 w-2' : 'bg-gray-400 w-2'
                  : theme === 'dark' ? 'bg-gray-700 w-2' : 'bg-gray-300 w-2'
              }`}
              whileHover={{ scale: 1.2 }}
              onClick={() => setActiveIndex(index)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </motion.div>
      )}

      {/* Card counter badge */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`absolute top-4 right-4 px-4 py-2 rounded-full backdrop-blur-md ${
          theme === 'dark'
            ? 'bg-gray-800/80 text-white'
            : 'bg-white/80 text-gray-800'
        }`}
        style={{
          fontSize: '14px',
          fontWeight: '600',
        }}
      >
        {activeIndex + 1} / {cards.length}
      </motion.div>
    </div>
  );
}; 