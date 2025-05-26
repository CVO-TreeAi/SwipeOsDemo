import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '../src/components/cards/BaseCard/types';
import { ProfileCard } from '../src/components/cards/ProfileCard';
import { AiAssistantCard } from '../src/components/cards/AiAssistantCard';
import { BusinessIdCard } from '../src/components/cards/BusinessIdCard';
import { SettingsCard } from '../src/components/cards/SettingsCard';
import { SupabaseCard } from '../src/components/cards/SupabaseCard';
import { SwipeWizardCard } from '../src/components/cards/SwipeWizardCard';
import { PopupModal } from '../src/components/cards/PopupModal';
import { supabaseMCP } from '../src/lib/supabase';
import {
  ProfileEditPopup,
  ProfileAnalyticsPopup,
  ProfileUsersPopup,
  ProfileSharePopup
} from '../src/components/cards/ProfileCard/ProfilePopups';
import {
  AiNewConversationPopup,
  AiHistoryPopup,
  AiSettingsPopup,
  AiQuickAskPopup
} from '../src/components/cards/AiAssistantCard/AiAssistantPopups';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Edit,
  BarChart3,
  Users,
  Share2,
  Phone,
  Mail,
  Eye,
  UserPlus,
  MessageSquare,
  History,
  Settings,
  HelpCircle,
  Save,
  RotateCcw,
  Download,
  Upload,
  Database,
  Shield,
  Key,
  Server
} from 'lucide-react';

export interface SwipeAction {
  direction: 'up' | 'down' | 'left' | 'right';
  label: string;
  icon: React.ReactNode;
  color: string;
  action: () => Promise<void> | void;
}

export interface V4Card {
  id: string;
  type: string;
  title: string;
  component: React.ReactNode;
  actions: SwipeAction[];
}

export default function V4Page() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isSwipeInProgress, setIsSwipeInProgress] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState({
    direction: null as 'up' | 'down' | 'left' | 'right' | null,
    percentage: 0,
    isConfirming: false,
    isExecuting: false
  });
  const [activePopup, setActivePopup] = useState<{
    isOpen: boolean;
    direction: 'up' | 'down' | 'left' | 'right' | null;
    cardType: string | null;
  }>({
    isOpen: false,
    direction: null,
    cardType: null
  });
  const [profileData, setProfileData] = useState({
    userName: 'John Doe',
    companyName: 'TreeAI',
    avatarUrl: '/api/placeholder/150/150',
    email: 'john.doe@treeai.com',
    phone: '+1 (555) 123-4567'
  });
  const router = useRouter();

  // Sample actions for each card
  const profileActions: SwipeAction[] = [
    {
      direction: 'up',
      label: 'Edit Profile',
      icon: <Edit size={20} />,
      color: 'bg-blue-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'up', cardType: 'profile' });
      }
    },
    {
      direction: 'down',
      label: 'View Analytics',
      icon: <BarChart3 size={20} />,
      color: 'bg-green-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'down', cardType: 'profile' });
      }
    },
    {
      direction: 'left',
      label: 'Previous User',
      icon: <Users size={20} />,
      color: 'bg-orange-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'left', cardType: 'profile' });
      }
    },
    {
      direction: 'right',
      label: 'Share Profile',
      icon: <Share2 size={20} />,
      color: 'bg-purple-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'right', cardType: 'profile' });
      }
    }
  ];

  const businessActions: SwipeAction[] = [
    {
      direction: 'up',
      label: 'Call Contact',
      icon: <Phone size={20} />,
      color: 'bg-green-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'up', cardType: 'business_id' });
      }
    },
    {
      direction: 'down',
      label: 'Send Email',
      icon: <Mail size={20} />,
      color: 'bg-blue-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'down', cardType: 'business_id' });
      }
    },
    {
      direction: 'left',
      label: 'View Details',
      icon: <Eye size={20} />,
      color: 'bg-orange-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'left', cardType: 'business_id' });
      }
    },
    {
      direction: 'right',
      label: 'Add to CRM',
      icon: <UserPlus size={20} />,
      color: 'bg-purple-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'right', cardType: 'business_id' });
      }
    }
  ];

  const aiActions: SwipeAction[] = [
    {
      direction: 'up',
      label: 'New Conversation',
      icon: <MessageSquare size={20} />,
      color: 'bg-green-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'up', cardType: 'ai_assistant' });
      }
    },
    {
      direction: 'down',
      label: 'View History',
      icon: <History size={20} />,
      color: 'bg-blue-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'down', cardType: 'ai_assistant' });
      }
    },
    {
      direction: 'left',
      label: 'Settings',
      icon: <Settings size={20} />,
      color: 'bg-orange-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'left', cardType: 'ai_assistant' });
      }
    },
    {
      direction: 'right',
      label: 'Quick Ask',
      icon: <HelpCircle size={20} />,
      color: 'bg-purple-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'right', cardType: 'ai_assistant' });
      }
    }
  ];

  const settingsActions: SwipeAction[] = [
    {
      direction: 'up',
      label: 'Backup Settings',
      icon: <Save size={20} />,
      color: 'bg-green-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'up', cardType: 'settings' });
      }
    },
    {
      direction: 'down',
      label: 'Reset to Default',
      icon: <RotateCcw size={20} />,
      color: 'bg-red-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'down', cardType: 'settings' });
      }
    },
    {
      direction: 'left',
      label: 'Import Config',
      icon: <Upload size={20} />,
      color: 'bg-orange-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'left', cardType: 'settings' });
      }
    },
    {
      direction: 'right',
      label: 'Export Config',
      icon: <Download size={20} />,
      color: 'bg-purple-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'right', cardType: 'settings' });
      }
    }
  ];

  const supabaseActions: SwipeAction[] = [
    {
      direction: 'up',
      label: 'Query Database',
      icon: <Database size={20} />,
      color: 'bg-green-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'up', cardType: 'supabase' });
      }
    },
    {
      direction: 'down',
      label: 'Manage Tables',
      icon: <Server size={20} />,
      color: 'bg-blue-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'down', cardType: 'supabase' });
      }
    },
    {
      direction: 'left',
      label: 'Security Settings',
      icon: <Shield size={20} />,
      color: 'bg-orange-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'left', cardType: 'supabase' });
      }
    },
    {
      direction: 'right',
      label: 'API Access',
      icon: <Key size={20} />,
      color: 'bg-purple-500',
      action: async () => {
        setActivePopup({ isOpen: true, direction: 'right', cardType: 'supabase' });
      }
    }
  ];

  // Initialize cards with their actions
  const cards: V4Card[] = [
    {
      id: 'profile-1',
      type: 'profile',
      title: 'Profile Card',
      component: (
        <ProfileCard
          userName={profileData.userName}
          avatarUrl={profileData.avatarUrl}
          companyName={profileData.companyName}
          theme={theme}
        />
      ),
      actions: profileActions
    },
    {
      id: 'ai-1',
      type: 'ai_assistant',
      title: 'AI Assistant Card',
      component: (
        <AiAssistantCard
          unreadCount={3}
          theme={theme}
        />
      ),
      actions: aiActions
    },
    {
      id: 'business-1',
      type: 'business_id',
      title: 'Business Card',
      component: (
        <BusinessIdCard
          companyLogoUrl="/api/placeholder/100/100"
          contactEmail="contact@treeai.com"
          phone="+1 (555) 123-4567"
          theme={theme}
        />
      ),
      actions: businessActions
    },
    {
      id: 'settings-1',
      type: 'settings',
      title: 'Settings Card',
      component: (
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
      ),
      actions: settingsActions
    },
    {
      id: 'supabase-1',
      type: 'supabase',
      title: 'Supabase Database',
      component: (
        <SupabaseCard
          theme={theme}
          isLocked={true}
          pin="1234"
        />
      ),
      actions: supabaseActions
    }
  ];

  const currentCard = cards[currentCardIndex];

  const handleCardNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
    } else {
      setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    }
  };

  const handleSwipeAction = async (action: SwipeAction) => {
    setIsSwipeInProgress(true);
    try {
      await action.action();
    } catch (error) {
      console.error('Swipe action failed:', error);
    } finally {
      setIsSwipeInProgress(false);
      setSwipeProgress({
        direction: null,
        percentage: 0,
        isConfirming: false,
        isExecuting: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="text-center py-6 px-6">
        <h1 className="text-4xl font-bold text-white mb-2">SwipeOS V4.1</h1>
        <p className="text-gray-300 text-lg">Card Create Wizard • Swipe Actions • Supabase Integration</p>
        <div className="mt-4 flex justify-center items-center gap-4">
          <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            V4.1 Alpha
          </div>
          <div className="text-gray-300 text-sm">
            Card {currentCardIndex + 1} of {cards.length}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="relative w-full max-w-2xl">
          
          {/* Card Navigation */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => handleCardNavigation('prev')}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-1">
                {currentCard.title}
              </h2>
              <p className="text-gray-300 text-sm">
                Swipe in any direction to perform actions
              </p>
            </div>
            
            <button
              onClick={() => handleCardNavigation('next')}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Center Card with Swipe Wizard */}
          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard.id}
                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                transition={{ duration: 0.5, type: "spring", damping: 20 }}
                className="w-[90vw] max-w-md"
              >
                <SwipeWizardCard
                  card={currentCard}
                  theme={theme}
                  onSwipeAction={handleSwipeAction}
                  swipeProgress={swipeProgress}
                  onSwipeProgress={setSwipeProgress}
                  isSwipeInProgress={isSwipeInProgress}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Indicators */}
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
            {currentCard.actions.map((action) => (
              <div
                key={action.direction}
                className={`
                  p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20
                  flex items-center gap-3 text-white text-sm
                  ${swipeProgress.direction === action.direction ? action.color : ''}
                  transition-all duration-200
                `}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                  {action.direction === 'up' && <ChevronUp size={16} />}
                  {action.direction === 'down' && <ChevronDown size={16} />}
                  {action.direction === 'left' && <ChevronLeft size={16} />}
                  {action.direction === 'right' && <ChevronRight size={16} />}
                </div>
                <div className="flex items-center gap-2">
                  {action.icon}
                  <span>{action.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 max-w-md mx-auto">
          <h3 className="text-white text-sm font-semibold mb-2">Swipe Instructions</h3>
          <p className="text-gray-300 text-xs leading-relaxed">
            Drag the card 25% for confirmation, 50% to execute action. 
            Use navigation buttons or keyboard arrows to switch cards.
          </p>
        </div>
      </div>

      {/* Popup Modals */}
      {activePopup.cardType === 'profile' && (
        <>
          <PopupModal
            isOpen={activePopup.isOpen && activePopup.direction === 'up'}
            onClose={() => setActivePopup({ isOpen: false, direction: null, cardType: null })}
            title="Edit Profile"
            theme={theme}
          >
            <ProfileEditPopup 
              theme={theme} 
              profileData={profileData}
              onUpdate={(data) => setProfileData(data)}
            />
          </PopupModal>

          <PopupModal
            isOpen={activePopup.isOpen && activePopup.direction === 'down'}
            onClose={() => setActivePopup({ isOpen: false, direction: null, cardType: null })}
            title="Profile Analytics"
            theme={theme}
          >
            <ProfileAnalyticsPopup theme={theme} />
          </PopupModal>

          <PopupModal
            isOpen={activePopup.isOpen && activePopup.direction === 'left'}
            onClose={() => setActivePopup({ isOpen: false, direction: null, cardType: null })}
            title="Browse Users"
            theme={theme}
          >
            <ProfileUsersPopup theme={theme} />
          </PopupModal>

          <PopupModal
            isOpen={activePopup.isOpen && activePopup.direction === 'right'}
            onClose={() => setActivePopup({ isOpen: false, direction: null, cardType: null })}
            title="Share Profile"
            theme={theme}
          >
            <ProfileSharePopup theme={theme} />
          </PopupModal>
        </>
      )}

      {/* AI Assistant Popup Modals */}
      {activePopup.cardType === 'ai_assistant' && (
        <>
          <PopupModal
            isOpen={activePopup.isOpen && activePopup.direction === 'up'}
            onClose={() => setActivePopup({ isOpen: false, direction: null, cardType: null })}
            title="New AI Conversation"
            theme={theme}
          >
            <AiNewConversationPopup theme={theme} />
          </PopupModal>

          <PopupModal
            isOpen={activePopup.isOpen && activePopup.direction === 'down'}
            onClose={() => setActivePopup({ isOpen: false, direction: null, cardType: null })}
            title="Conversation History"
            theme={theme}
          >
            <AiHistoryPopup theme={theme} />
          </PopupModal>

          <PopupModal
            isOpen={activePopup.isOpen && activePopup.direction === 'left'}
            onClose={() => setActivePopup({ isOpen: false, direction: null, cardType: null })}
            title="AI Settings"
            theme={theme}
          >
            <AiSettingsPopup theme={theme} />
          </PopupModal>

          <PopupModal
            isOpen={activePopup.isOpen && activePopup.direction === 'right'}
            onClose={() => setActivePopup({ isOpen: false, direction: null, cardType: null })}
            title="Quick Ask AI"
            theme={theme}
          >
            <AiQuickAskPopup theme={theme} />
          </PopupModal>
        </>
      )}
    </div>
  );
} 