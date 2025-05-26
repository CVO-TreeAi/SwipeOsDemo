import { BaseCardProps } from '../../deck/types';

export interface AiAssistantCardProps extends BaseCardProps {
  unreadCount: number;
  onOpenChat: () => void;
}
