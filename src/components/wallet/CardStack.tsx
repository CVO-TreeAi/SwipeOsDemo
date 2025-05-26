import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Theme } from '../cards/BaseCard/types';
import { SwipeableCard, SwipeAction } from '../cards/SwipeableCard';
import { useRouter } from 'next/router';
import { 
  Mail, 
  Plus, 
  Inbox, 
  Edit, 
  FileText,
  User,
  Settings,
  CreditCard,
  MessageCircle,
  Building,
  Phone,
  AtSign,
  Camera,
  Share2,
  Archive,
  Trash2
} from 'lucide-react';

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

// Card type specific swipe actions
const getCardSwipeActions = (type: string, router: any): SwipeAction[] => {
  switch (type.toLowerCase()) {
    case 'profile':
      return [
        {
          direction: 'up',
          label: 'Edit Profile',
          icon: <Edit size={16} />,
          action: () => router.push('/profile/edit')
        },
        {
          direction: 'right',
          label: 'Share',
          icon: <Share2 size={16} />,
          action: () => router.push('/profile/share')
        },
        {
          direction: 'down',
          label: 'View Details',
          icon: <User size={16} />,
          action: () => router.push('/profile')
        },
        {
          direction: 'left',
          label: 'Settings',
          icon: <Settings size={16} />,
          action: () => router.push('/settings')
        }
      ];
    
    case 'email':
      return [
        {
          direction: 'up',
          label: 'New Email',
          icon: <Plus size={16} />,
          action: () => router.push('/email/compose')
        },
        {
          direction: 'right',
          label: 'Inbox',
          icon: <Inbox size={16} />,
          action: () => router.push('/email/inbox')
        },
        {
          direction: 'down',
          label: 'Personal',
          icon: <Mail size={16} />,
          action: () => router.push('/email/personal')
        },
        {
          direction: 'left',
          label: 'Drafts',
          icon: <FileText size={16} />,
          action: () => router.push('/email/drafts')
        }
      ];
    
    case 'ai_assistant':
    case 'ai':
      return [
        {
          direction: 'up',
          label: 'New Chat',
          icon: <MessageCircle size={16} />,
          action: () => router.push('/ai/chat')
        },
        {
          direction: 'right',
          label: 'History',
          icon: <Archive size={16} />,
          action: () => router.push('/ai/history')
        }
      ];
    
    case 'business_id':
    case 'businessid':
      return [
        {
          direction: 'up',
          label: 'Edit Info',
          icon: <Edit size={16} />,
          action: () => router.push('/business/edit')
        },
        {
          direction: 'right',
          label: 'Contact',
          icon: <Phone size={16} />,
          action: () => router.push('/business/contact')
        },
        {
          direction: 'down',
          label: 'View Details',
          icon: <Building size={16} />,
          action: () => router.push('/business')
        }
      ];
    
    case 'settings':
      return [
        {
          direction: 'up',
          label: 'Preferences',
          icon: <Settings size={16} />,
          action: () => router.push('/settings/preferences')
        },
        {
          direction: 'right',
          label: 'Account',
          icon: <User size={16} />,
          action: () => router.push('/settings/account')
        }
      ];
    
    default:
      return [
        {
          direction: 'up',
          label: 'Open',
          icon: <CreditCard size={16} />,
          action: () => router.push(`/cards/${type}`)
        }
      ];
  }
};

// Back content for different card types
const getCardBackContent = (type: string, theme: Theme) => {
  const baseClasses = `p-6 h-full flex flex-col ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`;
  
  switch (type.toLowerCase()) {
    case 'profile':
      return (
        <div className={baseClasses}>
          <h3 className="text-lg font-bold mb-4">Profile Stats</h3>
          <div className="space-y-3 flex-1">
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
          <div className="text-xs opacity-50 mt-4">Last updated 2 hours ago</div>
        </div>
      );
    
    case 'ai_assistant':
    case 'ai':
      return (
        <div className={baseClasses}>
          <h3 className="text-lg font-bold mb-4">AI Assistant</h3>
          <div className="space-y-3 flex-1">
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Messages Today</span>
              <span className="font-medium">42</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Tasks Completed</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Avg Response</span>
              <span className="font-medium">1.2s</span>
            </div>
          </div>
          <div className="text-xs opacity-50 mt-4">Always here to help</div>
        </div>
      );
    
    default:
      return (
        <div className={baseClasses}>
          <h3 className="text-lg font-bold mb-4 capitalize">{type.replace('_', ' ')} Info</h3>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm opacity-70 text-center">
              Double tap to flip back
            </p>
          </div>
        </div>
      );
  }
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
  const router = useRouter();

  // Sort cards by position
  const sortedCards = [...cards].sort((a, b) => a.position - b.position);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardHeight = container.firstElementChild?.clientHeight || 400;
      const scrollTop = container.scrollTop;
      const centerIndex = Math.round(scrollTop / (cardHeight + 32)); // 32px gap
      setSelectedCard(Math.min(Math.max(0, centerIndex), sortedCards.length - 1));
    }
  }, [sortedCards.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const scrollToCard = useCallback((index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardHeight = container.firstElementChild?.clientHeight || 400;
      const targetScroll = index * (cardHeight + 32); // 32px gap
      
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6 px-4">
        <h1 className="text-4xl font-bold text-white mb-2">Digital Wallet</h1>
        <p className="text-gray-300">
          {sortedCards.length} cards • Scroll to navigate
        </p>
      </div>

      {/* Cards Container */}
      <div className="flex-1 relative">
        <div 
          ref={scrollContainerRef}
          className="h-full overflow-y-auto scrollbar-hide px-8 pb-8"
          style={{ 
            scrollSnapType: 'y mandatory',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="space-y-8">
            {sortedCards.map((card, index) => (
              <div
                key={card.id}
                className="h-[400px] scroll-snap-align-center"
                style={{ scrollSnapAlign: 'center' }}
              >
                <SwipeableCard
                  id={card.id}
                  type={card.type}
                  theme={theme}
                  frontContent={card.component}
                  backContent={getCardBackContent(card.type, theme)}
                  swipeActions={getCardSwipeActions(card.type, router)}
                  onSwipeComplete={(direction) => onCardSwipe?.(card.id, direction)}
                  className={`
                    transition-all duration-300
                    ${selectedCard === index 
                      ? 'scale-100 opacity-100' 
                      : 'scale-95 opacity-60'
                    }
                  `}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicators */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {sortedCards.map((_, index) => (
            <button
              key={index}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${selectedCard === index 
                  ? 'bg-white w-3 h-8' 
                  : 'bg-white/30 hover:bg-white/50'
                }
              `}
              onClick={() => scrollToCard(index)}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 