# InfiniteScrollWallet Template

A reusable, configurable infinite scroll wallet component for React applications.

## 🎯 Overview

The `InfiniteScrollWallet` is a production-ready template that provides:
- **Infinite vertical scrolling** with seamless looping
- **Configurable card sizing** and spacing
- **3D card flip animations** with custom back content
- **Swipe gesture support** with visual feedback
- **Responsive design** that adapts to viewport size
- **Customizable footer** and header content
- **Scroll indicators** for navigation
- **TypeScript support** with full type safety

## 📦 Installation

```bash
# Copy the template files to your project
cp src/components/wallet/InfiniteScrollWallet.tsx your-project/src/components/
cp src/components/wallet/examples/WalletExample.tsx your-project/src/components/
```

## 🚀 Quick Start

```tsx
import React from 'react';
import { InfiniteScrollWallet, WalletCard, WalletConfig } from './InfiniteScrollWallet';

const MyWallet = () => {
  const cards: WalletCard[] = [
    {
      id: 'card1',
      type: 'profile',
      position: 0,
      component: <YourCardComponent />,
    },
    // ... more cards
  ];

  const config: WalletConfig = {
    title: 'My Digital Wallet',
    subtitle: 'Swipe and scroll through your cards',
  };

  return (
    <InfiniteScrollWallet
      cards={cards}
      config={config}
      theme="dark"
    />
  );
};
```

## 🔧 Configuration Options

### WalletConfig Interface

```tsx
interface WalletConfig {
  title: string;                    // Main title displayed at top
  subtitle?: string;                // Optional subtitle text
  cardHeight?: number;              // Card height in pixels (default: 320)
  cardGap?: number;                 // Gap between cards in pixels (default: 32)
  maxWidth?: string;                // Max width CSS class (default: 'max-w-md')
  showScrollIndicators?: boolean;   // Show right-side scroll dots (default: true)
  showFooter?: boolean;             // Show footer with selected card info (default: true)
  footerContent?: (selectedCard: WalletCard) => React.ReactNode; // Custom footer content
}
```

### WalletCard Interface

```tsx
interface WalletCard {
  id: string;                       // Unique identifier
  type: string;                     // Card type for categorization
  component: React.ReactNode;       // Front face content
  position: number;                 // Sort order (0-based)
  backContent?: React.ReactNode;    // Optional custom back content
}
```

## 🎨 Customization Examples

### Custom Card Sizes

```tsx
const config: WalletConfig = {
  title: 'Large Cards Wallet',
  cardHeight: 400,        // Taller cards
  cardGap: 40,           // More spacing
  maxWidth: 'max-w-lg',  // Wider cards
};
```

### Custom Footer

```tsx
const config: WalletConfig = {
  title: 'Custom Footer Wallet',
  footerContent: (selectedCard) => (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6">
      <h3 className="text-white text-lg font-bold">{selectedCard.type}</h3>
      <p className="text-blue-100">Card ID: {selectedCard.id}</p>
      <button className="mt-2 bg-white text-blue-600 px-4 py-2 rounded-lg">
        View Details
      </button>
    </div>
  ),
};
```

### Minimal Configuration

```tsx
const config: WalletConfig = {
  title: 'Simple Wallet',
  showScrollIndicators: false,
  showFooter: false,
};
```

## 🎭 Event Handlers

### onCardSelect

Triggered when a card becomes the selected/centered card:

```tsx
const handleCardSelect = (card: WalletCard, index: number) => {
  console.log(`Selected: ${card.type} at position ${index}`);
  // Update analytics, trigger animations, etc.
};

<InfiniteScrollWallet
  cards={cards}
  config={config}
  theme="dark"
  onCardSelect={handleCardSelect}
/>
```

### onCardSwipe

Triggered when a card is swiped in any direction:

```tsx
const handleCardSwipe = (cardId: string, direction: 'up' | 'down' | 'left' | 'right') => {
  console.log(`Card ${cardId} swiped ${direction}`);
  
  switch (direction) {
    case 'up':
      // Handle upward swipe
      break;
    case 'down':
      // Handle downward swipe
      break;
    case 'left':
      // Handle left swipe
      break;
    case 'right':
      // Handle right swipe
      break;
  }
};
```

## 🎨 Styling & Theming

### Custom Background

```tsx
<InfiniteScrollWallet
  cards={cards}
  config={config}
  theme="dark"
  className="bg-gradient-to-br from-green-900 via-blue-900 to-purple-900"
/>
```

### Theme Support

The component supports both `'dark'` and `'light'` themes:

```tsx
// Dark theme (default)
<InfiniteScrollWallet theme="dark" ... />

// Light theme
<InfiniteScrollWallet theme="light" ... />
```

## 📱 Responsive Design

The wallet automatically adapts to different screen sizes:

- **Mobile**: Cards use 90% of viewport width
- **Desktop**: Cards are constrained by `maxWidth` config
- **Height**: Uses 70% of viewport height for optimal scrolling

## 🔄 Infinite Scroll Logic

The infinite scroll is achieved by:

1. **Tripling the cards array**: `[...cards, ...cards, ...cards]`
2. **Position tracking**: Monitors scroll position and calculates current card
3. **Seamless reset**: Automatically jumps between sets when reaching boundaries
4. **Smooth transitions**: Uses CSS transforms for fluid animations

## 🎯 Performance Optimizations

- **Will-change properties**: Optimized for smooth scrolling
- **Scroll snap**: Native browser scroll snap for better UX
- **Debounced scroll events**: Prevents excessive re-renders
- **Transform-based animations**: Hardware-accelerated positioning

## 🧪 Testing

### Unit Tests

```tsx
import { render, screen } from '@testing-library/react';
import { InfiniteScrollWallet } from './InfiniteScrollWallet';

test('renders wallet with cards', () => {
  const cards = [
    { id: '1', type: 'test', position: 0, component: <div>Test Card</div> }
  ];
  const config = { title: 'Test Wallet' };
  
  render(<InfiniteScrollWallet cards={cards} config={config} theme="dark" />);
  
  expect(screen.getByText('Test Wallet')).toBeInTheDocument();
  expect(screen.getByText('Test Card')).toBeInTheDocument();
});
```

### Integration Tests

```tsx
import { fireEvent, waitFor } from '@testing-library/react';

test('handles card selection', async () => {
  const onCardSelect = jest.fn();
  // ... render component with onCardSelect
  
  fireEvent.scroll(scrollContainer, { target: { scrollTop: 352 } });
  
  await waitFor(() => {
    expect(onCardSelect).toHaveBeenCalledWith(expect.any(Object), 1);
  });
});
```

## 🔧 Advanced Usage

### Dynamic Card Loading

```tsx
const [cards, setCards] = useState<WalletCard[]>([]);

useEffect(() => {
  // Load cards from API
  fetchCards().then(setCards);
}, []);

// Add loading state
if (!cards.length) {
  return <div>Loading cards...</div>;
}
```

### Card Reordering

```tsx
const handleCardReorder = (newCards: WalletCard[]) => {
  setCards(newCards);
  // Persist new order to backend
  saveCardOrder(newCards);
};

<InfiniteScrollWallet
  cards={cards}
  config={config}
  theme="dark"
  onCardReorder={handleCardReorder}
/>
```

## 📋 Migration Guide

### From SimpleCardStack to InfiniteScrollWallet

1. **Update imports**:
   ```tsx
   // Old
   import { SimpleCardStack } from './SimpleCardStack';
   
   // New
   import { InfiniteScrollWallet } from './InfiniteScrollWallet';
   ```

2. **Update card interface**:
   ```tsx
   // Old
   interface CardData {
     id: string;
     type: string;
     component: React.ReactNode;
     position: number;
   }
   
   // New
   interface WalletCard {
     id: string;
     type: string;
     component: React.ReactNode;
     position: number;
     backContent?: React.ReactNode; // New optional field
   }
   ```

3. **Add configuration**:
   ```tsx
   // Old
   <SimpleCardStack cards={cards} theme="dark" />
   
   // New
   const config = { title: 'Digital Wallet' };
   <InfiniteScrollWallet cards={cards} config={config} theme="dark" />
   ```

## 🚀 Production Checklist

- [ ] Cards load correctly with proper content
- [ ] Infinite scroll works smoothly without glitches
- [ ] Double-tap flip functionality works on all cards
- [ ] Swipe gestures provide appropriate feedback
- [ ] Footer displays correct selected card information
- [ ] Responsive design works on mobile and desktop
- [ ] Performance is smooth with 60fps scrolling
- [ ] Accessibility features work (keyboard navigation)
- [ ] Error boundaries handle edge cases
- [ ] Analytics events fire correctly

## 🔗 Dependencies

- React 18+
- TypeScript 4.5+
- Tailwind CSS 3.0+
- Framer Motion (for SwipeableCard)

## 📄 License

This template is part of the TreeAi project and follows the same open-source license.

---

**Template Version**: V3 Alpha  
**Last Updated**: January 2025  
**Compatibility**: React 18+, TypeScript 4.5+  
**Status**: Alpha Release - Production Ready Template 