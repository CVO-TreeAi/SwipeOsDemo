import BaseCard from '../../shared/components/BaseCard';
import { useSwipe } from '../../shared/hooks/useSwipe';
import { AiAssistantCardProps } from './types';

export default function AiAssistantCard({
  unreadCount,
  onOpenChat,
  position,
  theme,
  onSwipe
}: AiAssistantCardProps) {
  // Enable keyboard navigation
  useSwipe(onSwipe);
  
  return (
    <BaseCard 
      position={position} 
      theme={theme} 
      onSwipe={onSwipe}
      aria-label="AI Assistant Card"
    >
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-3">
          <span className="text-white font-bold">AI</span>
        </div>
        <h2 className="text-xl font-semibold">Alex</h2>
        {unreadCount > 0 && (
          <div className="ml-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </div>
        )}
      </div>
      
      <p className="text-sm mb-4 opacity-70">
        How can I help you today?
      </p>
      
      <button
        onClick={onOpenChat}
        className={`mt-auto py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
          theme === 'light' 
            ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
            : 'bg-purple-900 text-purple-100 hover:bg-purple-800'
        }`}
      >
        Start Chat
      </button>
    </BaseCard>
  );
}
