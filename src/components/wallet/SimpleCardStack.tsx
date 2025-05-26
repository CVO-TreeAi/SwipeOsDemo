import React, { useState, useRef, useEffect } from 'react';
import { Theme } from '../cards/BaseCard/types';
import { SwipeableCard } from '../cards/SwipeableCard';

export interface CardData {
  id: string;
  type: string;
  component: React.ReactNode;
  position: number;
}

interface SimpleCardStackProps {
  cards: CardData[];
  theme: Theme;
  onCardSwipe?: (cardId: string, direction: any) => void;
  onCardReorder?: (cards: CardData[]) => void;
  maxCards?: number;
}

// Back content for different card types
const getCardBackContent = (type: string, theme: Theme) => {
  const baseClasses = `p-4 h-full flex flex-col justify-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`;
  
  switch (type.toLowerCase()) {
    case 'profile':
      return (
        <div className={baseClasses}>
          <h3 className="text-lg font-bold mb-3 text-center">Profile Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Connections</span>
              <span className="font-medium">245</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Profile Views</span>
              <span className="font-medium">1,234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Completion</span>
              <span className="font-medium">75%</span>
            </div>
          </div>
        </div>
      );
    
    case 'ai_assistant':
    case 'ai':
      return (
        <div className={baseClasses}>
          <h3 className="text-lg font-bold mb-3 text-center">AI Assistant</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Messages Today</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Total Chats</span>
              <span className="font-medium">89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Tokens Used</span>
              <span className="font-medium">15.2K</span>
            </div>
          </div>
        </div>
      );
    
    case 'business_id':
    case 'businessid':
      return (
        <div className={baseClasses}>
          <h3 className="text-lg font-bold mb-3 text-center">Business Info</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Employees</span>
              <span className="font-medium">25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Founded</span>
              <span className="font-medium">2019</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Revenue</span>
              <span className="font-medium">$2.5M</span>
            </div>
          </div>
        </div>
      );
    
    case 'settings':
      return (
        <div className={baseClasses}>
          <h3 className="text-lg font-bold mb-3 text-center">Quick Settings</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-70">Dark Mode</span>
              <div className="w-8 h-5 bg-blue-500 rounded-full relative">
                <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-70">Notifications</span>
              <div className="w-8 h-5 bg-gray-300 rounded-full relative">
                <div className="w-3 h-3 bg-white rounded-full absolute top-1 left-1"></div>
              </div>
            </div>
          </div>
        </div>
      );
    
    default:
      return (
        <div className={baseClasses}>
          <h3 className="text-lg font-bold mb-3 text-center">{type} Details</h3>
          <p className="text-sm opacity-70 text-center">Double-tap to flip back</p>
        </div>
      );
  }
};

export const SimpleCardStack: React.FC<SimpleCardStackProps> = ({
  cards,
  theme,
  onCardSwipe,
  onCardReorder,
  maxCards = 100,
}) => {
  const [selectedCard, setSelectedCard] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  // Sort cards by position
  const sortedCards = [...cards].sort((a, b) => a.position - b.position);
  
  // Create infinite scroll by tripling the cards array
  const infiniteCards = [...sortedCards, ...sortedCards, ...sortedCards];
  const totalCards = sortedCards.length;

  const handleCardSelect = (cardIndex: number) => {
    const actualIndex = cardIndex % totalCards;
    setSelectedCard(actualIndex);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current && !isScrollingRef.current) {
      const container = scrollContainerRef.current;
      const cardHeight = 320; // Updated card height
      const gap = 32; // Updated gap between cards
      const scrollTop = container.scrollTop;
      const centerIndex = Math.round(scrollTop / (cardHeight + gap));
      
      // Calculate the actual card index (modulo to wrap around)
      const actualIndex = centerIndex % totalCards;
      setSelectedCard(actualIndex);

      // Check if we need to reset scroll position for infinite effect
      const maxScroll = totalCards * (cardHeight + gap);

      if (scrollTop >= maxScroll * 2) {
        // If we're at the end of the third set, jump back to the second set
        isScrollingRef.current = true;
        container.scrollTop = scrollTop - maxScroll;
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 10);
      } else if (scrollTop <= 0) {
        // If we're at the beginning of the first set, jump to the second set
        isScrollingRef.current = true;
        container.scrollTop = scrollTop + maxScroll;
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 10);
      }
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && totalCards > 0) {
      // Start in the middle set of cards
      const cardHeight = 320;
      const gap = 32;
      container.scrollTop = totalCards * (cardHeight + gap);
      
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [totalCards]);

  if (!sortedCards.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">No cards available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="text-center py-6 px-6">
        <h1 className="text-4xl font-bold text-white mb-4">Digital Wallet</h1>
        <p className="text-gray-300 text-lg">
          {selectedCard + 1} of {totalCards} • Scroll through your cards • Double-tap to flip
        </p>
      </div>

      {/* Main Content Area - Cards */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="relative w-full max-w-2xl">
          <div 
            ref={scrollContainerRef}
            className="h-[70vh] overflow-y-auto scrollbar-hide space-y-8 px-4 py-8"
            style={{ 
              scrollSnapType: 'y mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {infiniteCards.map((card, index) => {
              const actualIndex = index % totalCards;
              return (
                <div
                  key={`${card.id}-${Math.floor(index / totalCards)}`}
                  className="flex justify-center"
                  style={{ scrollSnapAlign: 'center' }}
                >
                  <div
                    className={`
                      w-[90vw] max-w-md h-80 transition-all duration-300 transform cursor-pointer
                      ${selectedCard === actualIndex 
                        ? 'scale-105 shadow-2xl z-20' 
                        : 'hover:scale-102 shadow-lg'
                      }
                    `}
                    onClick={() => handleCardSelect(index)}
                    style={{
                      transform: selectedCard === actualIndex 
                        ? 'translateX(-12px) scale(1.05)' 
                        : `translateX(${Math.abs(selectedCard - actualIndex) * 8}px)`,
                      zIndex: selectedCard === actualIndex ? 20 : 10 - Math.abs(selectedCard - actualIndex)
                    }}
                  >
                    <SwipeableCard
                      id={card.id}
                      type={card.type}
                      theme={theme}
                      frontContent={
                        <div className="h-full">
                          {card.component}
                        </div>
                      }
                      backContent={getCardBackContent(card.type, theme)}
                      swipeActions={[]}
                      className="h-full w-full"
                    />
                    
                    {/* Selection Indicator */}
                    {selectedCard === actualIndex && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center shadow-lg z-30">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
            {sortedCards.map((_, index) => (
              <button
                key={index}
                className={`
                  w-2 h-6 rounded-full transition-all duration-300
                  ${selectedCard === index 
                    ? 'bg-white scale-125 shadow-lg' 
                    : 'bg-white/30 hover:bg-white/50'
                  }
                `}
                onClick={() => {
                  setSelectedCard(index);
                  if (scrollContainerRef.current) {
                    const cardHeight = 320; // Updated for new card height
                    const gap = 32; // Updated for new gap
                    scrollContainerRef.current.scrollTo({
                      top: (totalCards + index) * (cardHeight + gap),
                      behavior: 'smooth'
                    });
                  }
                }}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Selected Card Info */}
      <div className="bg-black/20 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <h3 className="text-white text-sm font-semibold mb-1">Selected Card</h3>
            <p className="text-gray-300 text-xs">{sortedCards[selectedCard]?.type}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 