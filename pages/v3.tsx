import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { InfiniteScrollWallet, WalletCard, WalletConfig } from '../src/components/wallet/InfiniteScrollWallet';
import { ProfileCard } from '../src/components/cards/ProfileCard';
import { AiAssistantCard } from '../src/components/cards/AiAssistantCard';
import { BusinessIdCard } from '../src/components/cards/BusinessIdCard';
import { SettingsCard } from '../src/components/cards/SettingsCard';
import { Theme } from '../src/components/cards/BaseCard/types';
import { SwipeAction } from '../src/components/cards/SwipeableCard';
import {
  Edit,
  BarChart3,
  Users,
  Share2,
  MessageSquare,
  History,
  Settings,
  HelpCircle,
  Phone,
  Mail,
  Eye,
  UserPlus,
  Save,
  RotateCcw,
  Download,
  Upload
} from 'lucide-react';

// Import popup components
import { EditProfilePopup, ViewAnalyticsPopup, PreviousUserPopup, ShareProfilePopup } from '../src/components/cards/ProfileCard/ProfilePopups';
import { NewConversationPopup, ViewHistoryPopup, AiSettingsPopup, QuickAskPopup } from '../src/components/cards/AiAssistantCard/AiPopups';
import { CallContactPopup, SendEmailPopup, ViewDetailsPopup, AddToCrmPopup } from '../src/components/cards/BusinessIdCard/BusinessPopups';
import { BackupSettingsPopup, ResetToDefaultPopup, ImportConfigPopup, ExportConfigPopup } from '../src/components/cards/SettingsCard/SettingsPopups';

export default function V3Page() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [swipedCards, setSwipedCards] = useState<Set<string>>(new Set());
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const router = useRouter();

  const handleCardSwipe = (cardId: string, direction: any) => {
    console.log(`Card ${cardId} swiped ${direction}`);
    
    // Temporarily hide the card to simulate "swipe out"
    setSwipedCards(prev => new Set(prev).add(cardId));
    
    // Bring the card back after a short delay
    setTimeout(() => {
      setSwipedCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(cardId);
        return newSet;
      });
    }, 800); // Card returns after 800ms
  };

  const handleCardSelect = (card: WalletCard, index: number) => {
    console.log(`Selected card: ${card.type} at index ${index}`);
  };

  // Define swipe actions for each card type
  const profileSwipeActions: SwipeAction[] = [
    {
      direction: 'up',
      label: 'Edit Profile',
      icon: <Edit size={24} />,
      color: 'bg-blue-500',
      action: () => setActivePopup('edit-profile')
    },
    {
      direction: 'down',
      label: 'View Analytics',
      icon: <BarChart3 size={24} />,
      color: 'bg-green-500',
      action: () => setActivePopup('view-analytics')
    },
    {
      direction: 'left',
      label: 'Previous User',
      icon: <Users size={24} />,
      color: 'bg-orange-500',
      action: () => setActivePopup('previous-user')
    },
    {
      direction: 'right',
      label: 'Share Profile',
      icon: <Share2 size={24} />,
      color: 'bg-purple-500',
      action: () => setActivePopup('share-profile')
    }
  ];

  const aiSwipeActions: SwipeAction[] = [
    {
      direction: 'up',
      label: 'New Conversation',
      icon: <MessageSquare size={24} />,
      color: 'bg-green-500',
      action: () => setActivePopup('new-conversation')
    },
    {
      direction: 'down',
      label: 'View History',
      icon: <History size={24} />,
      color: 'bg-blue-500',
      action: () => setActivePopup('view-history')
    },
    {
      direction: 'left',
      label: 'AI Settings',
      icon: <Settings size={24} />,
      color: 'bg-orange-500',
      action: () => setActivePopup('ai-settings')
    },
    {
      direction: 'right',
      label: 'Quick Ask',
      icon: <HelpCircle size={24} />,
      color: 'bg-purple-500',
      action: () => setActivePopup('quick-ask')
    }
  ];

  const businessSwipeActions: SwipeAction[] = [
    {
      direction: 'up',
      label: 'Call Contact',
      icon: <Phone size={24} />,
      color: 'bg-green-500',
      action: () => setActivePopup('call-contact')
    },
    {
      direction: 'down',
      label: 'Send Email',
      icon: <Mail size={24} />,
      color: 'bg-blue-500',
      action: () => setActivePopup('send-email')
    },
    {
      direction: 'left',
      label: 'View Details',
      icon: <Eye size={24} />,
      color: 'bg-orange-500',
      action: () => setActivePopup('view-details')
    },
    {
      direction: 'right',
      label: 'Add to CRM',
      icon: <UserPlus size={24} />,
      color: 'bg-purple-500',
      action: () => setActivePopup('add-to-crm')
    }
  ];

  const settingsSwipeActions: SwipeAction[] = [
    {
      direction: 'up',
      label: 'Backup Settings',
      icon: <Save size={24} />,
      color: 'bg-green-500',
      action: () => setActivePopup('backup-settings')
    },
    {
      direction: 'down',
      label: 'Reset to Default',
      icon: <RotateCcw size={24} />,
      color: 'bg-red-500',
      action: () => setActivePopup('reset-to-default')
    },
    {
      direction: 'left',
      label: 'Import Config',
      icon: <Upload size={24} />,
      color: 'bg-orange-500',
      action: () => setActivePopup('import-config')
    },
    {
      direction: 'right',
      label: 'Export Config',
      icon: <Download size={24} />,
      color: 'bg-purple-500',
      action: () => setActivePopup('export-config')
    }
  ];

  // Initialize demo cards with swipe actions
  const cards: WalletCard[] = [
    {
      id: 'profile-1',
      type: 'profile',
      position: 0,
      component: (
        <div className={`transition-opacity duration-300 ${swipedCards.has('profile-1') ? 'opacity-30' : 'opacity-100'}`}>
          <ProfileCard
            userName="John Doe"
            avatarUrl="/api/placeholder/150/150"
            companyName="TreeAI"
            theme={theme}
          />
        </div>
      ),
      swipeActions: profileSwipeActions,
    },
    {
      id: 'ai-1',
      type: 'ai_assistant',
      position: 1,
      component: (
        <div className={`transition-opacity duration-300 ${swipedCards.has('ai-1') ? 'opacity-30' : 'opacity-100'}`}>
          <AiAssistantCard
            unreadCount={3}
            theme={theme}
          />
        </div>
      ),
      swipeActions: aiSwipeActions,
    },
    {
      id: 'business-1',
      type: 'business_id',
      position: 2,
      component: (
        <div className={`transition-opacity duration-300 ${swipedCards.has('business-1') ? 'opacity-30' : 'opacity-100'}`}>
          <BusinessIdCard
            companyLogoUrl="/api/placeholder/100/100"
            contactEmail="contact@treeai.com"
            phone="+1 (555) 123-4567"
            theme={theme}
          />
        </div>
      ),
      swipeActions: businessSwipeActions,
    },
    {
      id: 'settings-1',
      type: 'settings',
      position: 3,
      component: (
        <div className={`transition-opacity duration-300 ${swipedCards.has('settings-1') ? 'opacity-30' : 'opacity-100'}`}>
          <SettingsCard
            settings={{
              notifications: true,
              darkMode: theme === 'dark',
              autoSync: true,
            }}
            onToggle={(key) => {
              if (key === 'darkMode') {
                setTheme(theme === 'dark' ? 'light' : 'dark');
              }
            }}
            theme={theme}
          />
        </div>
      ),
      swipeActions: settingsSwipeActions,
    },
  ];

  // Configure the wallet
  const config: WalletConfig = {
    title: 'Digital Wallet V3 Alpha',
    subtitle: `${cards.length} cards • Scroll to navigate • Swipe center card for actions`,
    cardHeight: 320,
    cardGap: 32,
    maxWidth: 'max-w-md',
    showScrollIndicators: true,
    showFooter: true,
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <InfiniteScrollWallet
        cards={cards}
        config={config}
        theme={theme}
        onCardSwipe={handleCardSwipe}
        onCardSelect={handleCardSelect}
      />
      
      {/* Version indicator */}
      <div className="absolute top-14 right-6 z-50">
        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          V3 Alpha
        </div>
      </div>

      {/* Popup Modal Overlay */}
      {activePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`w-full max-w-md h-[80vh] rounded-2xl shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Profile Card Popups */}
            {activePopup === 'edit-profile' && <EditProfilePopup theme={theme} onClose={() => setActivePopup(null)} />}
            {activePopup === 'view-analytics' && <ViewAnalyticsPopup theme={theme} onClose={() => setActivePopup(null)} />}
            {activePopup === 'previous-user' && <PreviousUserPopup theme={theme} onClose={() => setActivePopup(null)} />}
            {activePopup === 'share-profile' && <ShareProfilePopup theme={theme} onClose={() => setActivePopup(null)} />}
            
            {/* AI Assistant Card Popups */}
            {activePopup === 'new-conversation' && <NewConversationPopup theme={theme} onClose={() => setActivePopup(null)} />}
            {activePopup === 'view-history' && <ViewHistoryPopup theme={theme} onClose={() => setActivePopup(null)} />}
            {activePopup === 'ai-settings' && <AiSettingsPopup theme={theme} onClose={() => setActivePopup(null)} />}
            {activePopup === 'quick-ask' && <QuickAskPopup theme={theme} onClose={() => setActivePopup(null)} />}
            
            {/* Business Card Popups */}
            {activePopup === 'call-contact' && <CallContactPopup theme={theme} onClose={() => setActivePopup(null)} />}
            {activePopup === 'send-email' && <SendEmailPopup theme={theme} onClose={() => setActivePopup(null)} />}
            {activePopup === 'view-details' && <ViewDetailsPopup theme={theme} onClose={() => setActivePopup(null)} />}
            {activePopup === 'add-to-crm' && <AddToCrmPopup theme={theme} onClose={() => setActivePopup(null)} />}
            
            {/* Settings Card Popups */}
            {activePopup === 'backup-settings' && <BackupSettingsPopup theme={theme} onClose={() => setActivePopup(null)} />}
            {activePopup === 'reset-to-default' && <ResetToDefaultPopup theme={theme} onClose={() => setActivePopup(null)} />}
            {activePopup === 'import-config' && <ImportConfigPopup theme={theme} onClose={() => setActivePopup(null)} />}
            {activePopup === 'export-config' && <ExportConfigPopup theme={theme} onClose={() => setActivePopup(null)} />}
          </div>
        </div>
      )}
    </div>
  );
} 