import { BaseCardProps } from '../../deck/types';

export interface SettingsCardProps extends BaseCardProps {
  settings: Record<string, boolean>;
  onToggle: (key: string) => void;
}
