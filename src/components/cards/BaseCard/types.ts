export type SwipeDirection = 'left' | 'right' | 'up' | 'down';
export type Theme = 'light' | 'dark';

export interface BaseCardProps {
  position: number;
  theme: Theme;
  onSwipe: (direction: SwipeDirection) => void;
  className?: string;
}

export interface ProfileCardProps extends BaseCardProps {
  userName: string;
  avatarUrl: string;
  companyName: string;
}

export interface BusinessIdCardProps extends BaseCardProps {
  companyLogoUrl: string;
  contactEmail: string;
  phone: string;
}

export interface SettingsCardProps extends BaseCardProps {
  settings: Record<string, boolean>;
  onToggle: (key: string) => void;
}

export interface AiAssistantCardProps extends BaseCardProps {
  unreadCount: number;
  onOpenChat: () => void;
} 