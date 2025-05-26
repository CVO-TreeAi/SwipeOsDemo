# SwipeOS Implementation Plan

## Project Setup

1. Initialize Next.js project with TypeScript
   ```bash
   npx create-next-app swipe-os --typescript
   cd swipe-os
   npm install framer-motion
   ```

2. Set up Tailwind CSS
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. Configure Tailwind CSS in `tailwind.config.js`
   ```javascript
   module.exports = {
     content: [
       "./pages/**/*.{js,ts,jsx,tsx}",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

## Implementation Steps

### 1. Create Core Types and Base Components

First, let's establish the core types and the base card component:

1. Create shared types
   ```typescript
   // src/deck/types.ts
   export interface CardDefinition {
     id: string;
     level: 1 | 2 | 3;
     position: number;
     feature: string;
   }

   export interface BaseCardProps {
     position: number;
     theme: 'light' | 'dark';
     onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
   }

   export type SwipeDirection = 'left' | 'right' | 'up' | 'down';
   ```

2. Create base card component
   ```typescript
   // src/shared/components/BaseCard.tsx
   import { motion } from 'framer-motion';
   import { BaseCardProps } from '../../deck/types';
   
   interface Props extends BaseCardProps {
     children: React.ReactNode;
     'aria-label': string;
   }
   
   export default function BaseCard({ 
     children, 
     position, 
     theme, 
     onSwipe,
     'aria-label': ariaLabel 
   }: Props) {
     return (
       <motion.div
         drag
         dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
         dragElastic={0.2}
         onDragEnd={(_, info) => {
           const threshold = 100;
           if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
             // Horizontal swipe
             if (info.offset.x > threshold) onSwipe('right');
             else if (info.offset.x < -threshold) onSwipe('left');
           } else {
             // Vertical swipe
             if (info.offset.y > threshold) onSwipe('down');
             else if (info.offset.y < -threshold) onSwipe('up');
           }
         }}
         className={`
           w-[300px] h-[200px]
           rounded-[1.5rem]
           shadow-lg
           ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-neutral-800 text-white'}
           flex flex-col p-4
           touch-pan-x touch-pan-y
           transition-colors duration-200
         `}
         role="group"
         aria-label={ariaLabel}
       >
         {children}
       </motion.div>
     );
   }
   ```

3. Create swipe hook for gesture handling
   ```typescript
   // src/shared/hooks/useSwipe.ts
   import { useEffect } from 'react';
   import { SwipeDirection } from '../../deck/types';
   
   export function useSwipe(onSwipe: (direction: SwipeDirection) => void) {
     useEffect(() => {
       const handleKeyDown = (e: KeyboardEvent) => {
         switch (e.key) {
           case 'ArrowRight':
             onSwipe('right');
             break;
           case 'ArrowLeft':
             onSwipe('left');
             break;
           case 'ArrowUp':
             onSwipe('up');
             break;
           case 'ArrowDown':
             onSwipe('down');
             break;
         }
       };
       
       window.addEventListener('keydown', handleKeyDown);
       return () => window.removeEventListener('keydown', handleKeyDown);
     }, [onSwipe]);
   }
   ```

### 2. Implement Level 1 Cards

Now let's implement the first four cards following our vertical slice architecture:

1. Profile Card
   ```typescript
   // src/cards/profile/types.ts
   import { BaseCardProps } from '../../deck/types';
   
   export interface ProfileCardProps extends BaseCardProps {
     userName: string;
     avatarUrl: string;
     companyName: string;
   }
   ```

   ```typescript
   // src/cards/profile/index.tsx
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
   ```

2. Business ID Card
   ```typescript
   // src/cards/business-id/types.ts
   import { BaseCardProps } from '../../deck/types';
   
   export interface BusinessIdCardProps extends BaseCardProps {
     companyLogoUrl: string;
     companyName: string;
     contactEmail: string;
     phone: string;
   }
   ```

   ```typescript
   // src/cards/business-id/index.tsx
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
   ```

3. Settings Card
   ```typescript
   // src/cards/settings/types.ts
   import { BaseCardProps } from '../../deck/types';
   
   export interface SettingsCardProps extends BaseCardProps {
     settings: Record<string, boolean>;
     onToggle: (key: string) => void;
   }
   ```

   ```typescript
   // src/cards/settings/index.tsx
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
               <span className="text-sm">{key}</span>
               <button
                 onClick={() => onToggle(key)}
                 className={`w-10 h-5 rounded-full p-0.5 ${
                   value ? 'bg-blue-500' : 'bg-gray-300'
                 }`}
                 aria-checked={value}
                 role="switch"
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
   ```

4. AI Assistant Card
   ```typescript
   // src/cards/ai-assistant/types.ts
   import { BaseCardProps } from '../../deck/types';
   
   export interface AiAssistantCardProps extends BaseCardProps {
     unreadCount: number;
     onOpenChat: () => void;
   }
   ```

   ```typescript
   // src/cards/ai-assistant/index.tsx
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
         
         <p className="text-sm mb-4">
           How can I help you today?
         </p>
         
         <button
           onClick={onOpenChat}
           className="mt-auto py-2 px-4 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-lg text-sm font-medium"
         >
           Start Chat
         </button>
       </BaseCard>
     );
   }
   ```

### 3. Implement Deck Manager

Now let's create the deck manager to handle card navigation:

