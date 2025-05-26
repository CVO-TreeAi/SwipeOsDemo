import BaseCard from '../../shared/components/BaseCard';
import { useSwipe } from '../../shared/hooks/useSwipe';
import { SettingsCardProps } from './types';

export default function SettingsCard({
  settings,
  onToggle,
  position,
  theme,
  onSwipe
}: SettingsCardProps) {
  // Enable keyboard navigation
  useSwipe(onSwipe);
  
  return (
    <BaseCard 
      position={position} 
      theme={theme} 
      onSwipe={onSwipe}
      aria-label="Settings Card"
    >
      <h2 className="text-xl font-semibold mb-3">Settings</h2>
      
      <div className="space-y-3">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            <button
              onClick={() => onToggle(key)}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                value ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              aria-checked={value}
              role="switch"
              aria-label={`Toggle ${key}`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                  value ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-auto flex justify-between text-xs opacity-50">
        <span>← Previous</span>
        <span>Next →</span>
      </div>
    </BaseCard>
  );
}
