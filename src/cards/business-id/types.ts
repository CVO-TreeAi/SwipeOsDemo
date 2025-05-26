import { BaseCardProps } from '../../deck/types';

export interface BusinessIdCardProps extends BaseCardProps {
  companyLogoUrl?: string;
  companyName: string;
  contactEmail: string;
  phone: string;
}
