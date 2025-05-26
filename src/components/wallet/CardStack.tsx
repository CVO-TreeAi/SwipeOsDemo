import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Theme } from '../cards/BaseCard/types';
import { Wallet } from 'lucide-react';

export interface CardData {
  id: string;
  type: string;
  component: React.ReactNode;
  position: number;
}

interface CardStackProps {
  cards: CardData[];
  theme: Theme;
  onCardSwipe?: (cardId: string, direction: any) => void;
  onCardReorder?: (cards: CardData[]) => void;
  maxCards?: number;
}

// Gradient mappings for different card types
const cardGradients: Record<string, string> = {
  'profile': 'bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800',
  'loyalty': 'bg-gradient-to-br from-amber-600 via-orange-600 to-red-700',
  'gift_card': 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600',
  'membership': 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-700',
  'business_id': 'bg-gradient-to-br from-slate-600 via-gray-700 to-zinc-800',
  'businessid': 'bg-gradient-to-br from-slate-600 via-gray-700 to-zinc-800',
  'settings': 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800',
  'ai_assistant': 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600',
  'ai': 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600',
  'default': 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800'
};

export const CardStack: React.FC<CardStackProps> = ({
  cards,
  theme,
  onCardSwipe,
  onCardReorder,
  maxCards = 100,
}) => {
  const [selectedCard, setSelectedCard] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Sort cards by position
  const sortedCards = [...cards].sort((a, b) => a.position - b.position);
  
  // Create infinite scroll by tripling the cards array
  const infiniteCards = [...sortedCards, ...sortedCards, ...sortedCards];
  const totalCards = sortedCards.length;

  const handleCardSelect = useCallback((cardIndex: number) => {
    const actualIndex = cardIndex % totalCards;
    setSelectedCard(actualIndex);
  }, [totalCards]);

  // Smooth scroll handling with human-friendly physics
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current && !isScrollingRef.current) {
      const container = scrollContainerRef.current;
      const cardHeight = 320; // Slightly larger for better spacing
      const scrollTop = container.scrollTop;
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Debounce scroll to prevent rapid updates
      scrollTimeoutRef.current = setTimeout(() => {
        const centerIndex = Math.round(scrollTop / cardHeight);
        const actualIndex = centerIndex % totalCards;
        setSelectedCard(actualIndex);

        // Check if we need to reset scroll position for infinite effect
        const maxScroll = totalCards * cardHeight;

        if (scrollTop >= maxScroll * 2) {
          // If we're at the end of the third set, jump back to the second set
          isScrollingRef.current = true;
          container.scrollTop = scrollTop - maxScroll;
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 50);
        } else if (scrollTop <= 0) {
          // If we're at the beginning of the first set, jump to the second set
          isScrollingRef.current = true;
          container.scrollTop = scrollTop + maxScroll;
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 50);
        }
      }, 100); // 100ms debounce for smoother experience
    }
  }, [totalCards]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Start in the middle set of cards
      const cardHeight = 320;
      container.scrollTop = totalCards * cardHeight + (selectedCard * cardHeight);
      
      // Add passive scroll listener for better performance
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        container.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [totalCards, selectedCard, handleScroll]);

  const getCardGradient = (type: string) => {
    return cardGradients[type.toLowerCase()] || cardGradients.default;
  };

  const scrollToCard = useCallback((index: number) => {
    if (scrollContainerRef.current) {
      const cardHeight = 320;
      const targetScroll = (totalCards + index) * cardHeight;
      
      scrollContainerRef.current.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [totalCards]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-4">Digital Wallet</h1>
          <p className="text-gray-300 text-base md:text-lg">
            {totalCards} {totalCards === 1 ? 'card' : 'cards'} • Scroll to navigate
          </p>
        </div>

        {/* Scrollable Cards Container */}
        <div className="relative flex justify-center">
          <div 
            ref={scrollContainerRef}
            className="h-[500px] md:h-[600px] overflow-y-auto scrollbar-hide space-y-8 px-4 py-12"
            style={{ 
              scrollSnapType: 'y proximity', // Changed from mandatory for smoother scrolling
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth'
            }}
          >
            {infiniteCards.map((card, index) => {
              const actualIndex = index % totalCards;
              const isSelected = selectedCard === actualIndex;
              const distanceFromSelected = Math.abs(selectedCard - actualIndex);
              
              return (
                <div
                  key={`${card.id}-${Math.floor(index / totalCards)}`}
                  className="flex justify-center"
                  style={{ scrollSnapAlign: 'center' }}
                >
                  <div
                    className={`
                      relative w-full max-w-sm h-64 md:h-72 rounded-2xl cursor-pointer transition-all duration-500 ease-out transform
                      ${getCardGradient(card.type)}
                      ${isSelected 
                        ? 'scale-105 shadow-2xl z-20 ring-2 ring-white/20' 
                        : 'hover:scale-102 shadow-lg hover:shadow-xl'
                      }
                      backdrop-blur-sm border border-white/20
                    `}
                    style={{
                      transform: isSelected 
                        ? 'translateX(-8px) scale(1.05)' 
                        : `translateX(${distanceFromSelected * 4}px) scale(${1 - distanceFromSelected * 0.02})`,
                      zIndex: isSelected ? 20 : 10 - distanceFromSelected,
                      opacity: isSelected ? 1 : Math.max(0.6, 1 - distanceFromSelected * 0.1)
                    }}
                    onClick={() => {
                      handleCardSelect(index);
                      scrollToCard(actualIndex);
                    }}
                  >
                    {/* Card Background Pattern */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-12 translate-y-12"></div>
                    </div>

                    {/* Card Content */}
                    <div className="relative z-10 p-6 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm font-medium text-white/90 capitalize">
                            {card.type.replace('_', ' ')} Card
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Wallet size={16} className="text-white/70" />
                            <span className="text-xs text-white/60">TreeAI Wallet</span>
                          </div>
                        </div>
                        <div className="w-10 h-6 bg-white/20 rounded flex items-center justify-center">
                          <div className="w-5 h-3 bg-white/40 rounded-sm"></div>
                        </div>
                      </div>

                      {/* Main Content Area - Render the card component */}
                      <div className="flex-1 overflow-hidden">
                        <div className="transform scale-[0.85] origin-top-left">
                          {card.component}
                        </div>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute right-0 md:right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-3">
            {sortedCards.map((_, index) => (
              <button
                key={index}
                className={`
                  w-2 h-8 rounded-full transition-all duration-300 ease-out
                  ${selectedCard === index 
                    ? 'bg-white scale-125 shadow-lg' 
                    : 'bg-white/30 hover:bg-white/50 hover:scale-110'
                  }
                `}
                onClick={() => {
                  setSelectedCard(index);
                  scrollToCard(index);
                }}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Selected Card Info */}
        <div className="mt-6 md:mt-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 max-w-md mx-auto border border-white/20">
            <h3 className="text-white text-lg font-semibold mb-2">Selected Card</h3>
            <p className="text-gray-300 capitalize">
              {sortedCards[selectedCard]?.type.replace('_', ' ')} Card
            </p>
            <p className="text-white/80 text-sm mt-1">
              Card {selectedCard + 1} of {totalCards}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 