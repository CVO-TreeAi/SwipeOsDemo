import { BaseCardProps } from '../../deck/types';

export interface ProfileCardProps extends BaseCardProps {
  userName: string;
  avatarUrl?: string;
  companyName: string;
}
