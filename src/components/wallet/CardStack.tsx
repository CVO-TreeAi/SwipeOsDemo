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
  maxVisibleCards = 5,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const visibleCards = cards.slice(0, maxVisibleCards);

  const handleSwipe = useCallback((cardId: string, direction: SwipeDirection) => {
    if (direction === 'up') {
      // Remove card from stack
      onCardSwipe(cardId, direction);
      
      // If we removed the active card, reset to 0
      if (activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    }
  }, [activeIndex, onCardSwipe]);

  const handleCardClick = useCallback((index: number) => {
    if (!isDragging && index !== activeIndex) {
      setActiveIndex(index);
    }
  }, [activeIndex, isDragging]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Stack container with perspective for 3D effect */}
      <div 
        className="relative"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Background glow effect */}
        <motion.div
          className={`absolute inset-0 blur-3xl opacity-20 ${
            theme === 'dark' ? 'bg-blue-500' : 'bg-blue-300'
          }`}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: '350px',
            height: '250px',
            left: '-25px',
            top: '-25px',
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
              isActive={index === activeIndex}
              onSwipe={(direction) => handleSwipe(card.id, direction)}
              onDragEnd={handleDragEnd}
              onClick={() => handleCardClick(index)}
              onDragStart={handleDragStart}
              layoutId={card.id}
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
            className={`w-[300px] h-[200px] rounded-[1.5rem] border-2 border-dashed flex items-center justify-center ${
              theme === 'dark' 
                ? 'border-gray-600 text-gray-400' 
                : 'border-gray-300 text-gray-500'
            }`}
          >
            <div className="text-center">
              <p className="text-lg font-medium">No cards yet</p>
              <p className="text-sm mt-1">Add your first card</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Card counter */}
      {cards.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
            theme === 'dark'
              ? 'bg-gray-800 text-gray-300'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {activeIndex + 1} / {cards.length}
        </motion.div>
      )}
    </div>
  );
}; 