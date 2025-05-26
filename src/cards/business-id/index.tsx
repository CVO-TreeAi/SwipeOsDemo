import BaseCard from '../../shared/components/BaseCard';
import { useSwipe } from '../../shared/hooks/useSwipe';
import { BusinessIdCardProps } from './types';

export default function BusinessIdCard({
  companyLogoUrl,
  companyName,
  contactEmail,
  phone,
  position,
  theme,
  onSwipe
}: BusinessIdCardProps) {
  // Enable keyboard navigation
  useSwipe(onSwipe);
  
  return (
    <BaseCard 
      position={position} 
      theme={theme} 
      onSwipe={onSwipe}
      aria-label="Business ID Card"
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center mr-3">
          {companyLogoUrl ? (
            <img src={companyLogoUrl} className="w-12 h-12 rounded" alt="" />
          ) : (
            <span className="text-gray-500 font-bold">{companyName.charAt(0)}</span>
          )}
        </div>
        <h2 className="text-xl font-semibold">{companyName}</h2>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm">
          <span className="opacity-70">Email:</span> {contactEmail}
        </p>
        <p className="text-sm">
          <span className="opacity-70">Phone:</span> {phone}
        </p>
      </div>
      
      <div className="mt-auto flex justify-between text-xs opacity-50">
        <span>← Swipe back</span>
        <span>Swipe next →</span>
      </div>
    </BaseCard>
  );
}
