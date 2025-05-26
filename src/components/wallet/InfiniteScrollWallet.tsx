import React, { useState, useRef, useEffect } from 'react';
import { Theme } from '../cards/BaseCard/types';
import { SwipeableCard, SwipeAction } from '../cards/SwipeableCard';

export interface WalletCard {
  id: string;
  type: string;
  component: React.ReactNode;
  position: number;
  backContent?: React.ReactNode;
  swipeActions?: SwipeAction[];
}

export interface WalletConfig {
  title: string;
  subtitle?: string;
  cardHeight?: number;
  cardGap?: number;
  maxWidth?: string;
  showScrollIndicators?: boolean;
  showFooter?: boolean;
  footerContent?: (selectedCard: WalletCard) => React.ReactNode;
}

interface InfiniteScrollWalletProps {
  cards: WalletCard[];
  config: WalletConfig;
  theme: Theme;
  onCardSwipe?: (cardId: string, direction: any) => void;
  onCardSelect?: (card: WalletCard, index: number) => void;
  onCardReorder?: (cards: WalletCard[]) => void;
  className?: string;
}

// Default back content generator
const getDefaultBackContent = (card: WalletCard, theme: Theme) => {
  if (card.backContent) return card.backContent;
  
  const baseClasses = `p-4 h-full flex flex-col justify-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`;
  
  return (
    <div className={baseClasses}>
      <h3 className="text-lg font-bold mb-3 text-center">{card.type} Details</h3>
      <p className="text-sm opacity-70 text-center">Double-tap to flip back</p>
    </div>
  );
};

// Default footer content
const getDefaultFooterContent = (selectedCard: WalletCard) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
    <h3 className="text-white text-sm font-semibold mb-1">Selected Card</h3>
    <p className="text-gray-300 text-xs">{selectedCard?.type}</p>
  </div>
);

export const InfiniteScrollWallet: React.FC<InfiniteScrollWalletProps> = ({
  cards,
  config,
  theme,
  onCardSwipe,
  onCardSelect,
  onCardReorder,
  className = '',
}) => {
  const {
    title,
    subtitle,
    cardHeight = 320,
    cardGap = 32,
    maxWidth = 'max-w-md',
    showScrollIndicators = true,
    showFooter = true,
    footerContent = getDefaultFooterContent,
  } = config;

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
    
    if (onCardSelect && sortedCards[actualIndex]) {
      onCardSelect(sortedCards[actualIndex], actualIndex);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current && !isScrollingRef.current) {
      const container = scrollContainerRef.current;
      const scrollTop = container.scrollTop;
      const centerIndex = Math.round(scrollTop / (cardHeight + cardGap));
      
      // Calculate the actual card index (modulo to wrap around)
      const actualIndex = centerIndex % totalCards;
      setSelectedCard(actualIndex);

      // Check if we need to reset scroll position for infinite effect
      const maxScroll = totalCards * (cardHeight + cardGap);

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
      container.scrollTop = totalCards * (cardHeight + cardGap);
      
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [totalCards, cardHeight, cardGap]);

  if (!sortedCards.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">No cards available</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col ${className}`}>
      {/* Header */}
      <div className="text-center py-6 px-6">
        <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
        {subtitle && (
          <p className="text-gray-300 text-lg">{subtitle}</p>
        )}
      </div>

      {/* Main Content Area - Cards */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="relative w-full max-w-2xl">
          <div 
            ref={scrollContainerRef}
            className="h-[70vh] overflow-y-auto scrollbar-hide px-4 py-8"
            style={{ 
              scrollSnapType: 'y mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              gap: `${cardGap}px`,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {infiniteCards.map((card, index) => {
              const actualIndex = index % totalCards;
              return (
                <div
                  key={`${card.id}-${Math.floor(index / totalCards)}`}
                  className="flex justify-center"
                  style={{ 
                    scrollSnapAlign: 'center',
                    marginBottom: index < infiniteCards.length - 1 ? `${cardGap}px` : '0'
                  }}
                >
                  <div
                    className={`
                      w-[90vw] ${maxWidth} transition-all duration-300 transform cursor-pointer
                      ${selectedCard === actualIndex 
                        ? 'scale-105 shadow-2xl z-20' 
                        : 'hover:scale-102 shadow-lg'
                      }
                    `}
                    style={{
                      height: `${cardHeight}px`,
                      transform: selectedCard === actualIndex 
                        ? 'translateX(-12px) scale(1.05)' 
                        : `translateX(${Math.abs(selectedCard - actualIndex) * 8}px)`,
                      zIndex: selectedCard === actualIndex ? 20 : 10 - Math.abs(selectedCard - actualIndex)
                    }}
                    onClick={() => handleCardSelect(index)}
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
                      backContent={getDefaultBackContent(card, theme)}
                      swipeActions={card.swipeActions}
                      className="h-full w-full"
                      onSwipe={onCardSwipe}
                      isSelected={selectedCard === actualIndex}
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

          {/* Scroll Indicators */}
          {showScrollIndicators && (
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
                      scrollContainerRef.current.scrollTo({
                        top: (totalCards + index) * (cardHeight + cardGap),
                        behavior: 'smooth'
                      });
                    }
                  }}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {showFooter && sortedCards[selectedCard] && (
        <div className="bg-black/20 backdrop-blur-sm border-t border-white/10 p-4">
          <div className="max-w-2xl mx-auto">
            {/* Default footer content */}
            <div className="text-center mb-4">
              {footerContent(sortedCards[selectedCard])}
            </div>
            
            {/* Swipe Actions Indicator */}
            {sortedCards[selectedCard].swipeActions && sortedCards[selectedCard].swipeActions!.length > 0 && (
              <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                {sortedCards[selectedCard].swipeActions!.map((action) => (
                  <div
                    key={action.direction}
                    className="flex items-center gap-2 text-white/80 text-xs bg-white/10 rounded-lg p-2"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                      {action.direction === 'up' && '↑'}
                      {action.direction === 'down' && '↓'}
                      {action.direction === 'left' && '←'}
                      {action.direction === 'right' && '→'}
                    </div>
                    <span className="truncate">{action.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

 