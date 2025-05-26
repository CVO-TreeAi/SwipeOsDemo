import BaseCard from '../../shared/components/BaseCard';
import { useSwipe } from '../../shared/hooks/useSwipe';
import { ProfileCardProps } from './types';

export default function ProfileCard({
  userName,
  avatarUrl,
  companyName,
  position,
  theme,
  onSwipe
}: ProfileCardProps) {
  // Enable keyboard navigation
  useSwipe(onSwipe);
  
  return (
    <BaseCard 
      position={position} 
      theme={theme} 
      onSwipe={onSwipe}
      aria-label="User Profile Card"
    >
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
          {avatarUrl ? (
            <img src={avatarUrl} className="w-10 h-10 rounded-full" alt="" />
          ) : (
            <span className="text-white font-bold">{userName.charAt(0)}</span>
          )}
        </div>
        <h2 className="text-xl font-semibold">{userName}</h2>
      </div>
      
      <p className="text-sm mb-4">
        <span className="opacity-70">Company:</span> {companyName}
      </p>
      
      <div className="mt-auto text-xs opacity-50 text-right">
        Swipe to continue →
      </div>
    </BaseCard>
  );
}
