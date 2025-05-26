# SwipeOS Wallet Version 2 - Plan

## Overview
Version 2 transforms the horizontal swipe interface into a **vertical card stack** with expanded card types and full Supabase integration. This wallet can hold various digital assets except credit/debit cards.

## Key Changes from V1

### 1. **Vertical Stack Layout**
- Cards stacked vertically with peek-through design
- Top card fully visible, others partially visible behind
- Smooth spring animations when cards move up/down
- Card spread animation on load

### 2. **Expanded Card Types**
Beyond the 4 original cards, we'll add:

#### Digital Asset Cards
- **Loyalty Card** - Store loyalty programs (Starbucks, Airlines, etc.)
- **Gift Card** - Digital gift card balances and barcodes
- **Membership Card** - Gym, clubs, subscriptions with QR codes
- **Transit Card** - Public transport passes with NFC data
- **Event Ticket** - Concert/movie tickets with dynamic QR
- **Insurance Card** - Health/auto insurance info
- **ID Card** - Driver's license, student ID (non-official)
- **Key Card** - Digital hotel keys, access cards
- **Coupon Card** - Discount codes and offers
- **Crypto Wallet** - Wallet addresses and balances

### 3. **Enhanced Features**

#### Card Management
- Add/Remove cards dynamically
- Reorder cards by drag and drop
- Search and filter cards
- Card categories/folders
- Quick access favorites

#### Visual Enhancements
- 3D card flip animations
- Card backgrounds based on type
- Dynamic gradients and patterns
- Card wear effects (used vs new)
- Holographic effects for premium cards

#### Interactions
- Pull to refresh card data
- Long press for quick actions
- Double tap to expand card
- Pinch to zoom card details
- Shake to shuffle cards

### 4. **Database Schema Expansion**

```sql
-- New tables for V2
CREATE TABLE card_types (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  category TEXT,
  template_config JSONB
);

CREATE TABLE user_cards (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  card_type_id UUID REFERENCES card_types(id),
  name TEXT NOT NULL,
  data JSONB, -- Flexible storage for different card data
  position INTEGER,
  is_favorite BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE TABLE card_transactions (
  id UUID PRIMARY KEY,
  card_id UUID REFERENCES user_cards(id),
  action TEXT, -- 'used', 'updated', 'shared'
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. **Component Architecture**

```
src/
├── components/
│   ├── wallet/
│   │   ├── WalletContainer.tsx    // Main container with vertical stack
│   │   ├── CardStack.tsx          // Manages card positions
│   │   └── CardPlaceholder.tsx    // Empty state
│   ├── cards/
│   │   ├── base/
│   │   │   ├── WalletCard.tsx     // Enhanced base card
│   │   │   └── CardTemplate.tsx   // Reusable templates
│   │   ├── digital/
│   │   │   ├── LoyaltyCard.tsx
│   │   │   ├── GiftCard.tsx
│   │   │   ├── MembershipCard.tsx
│   │   │   ├── TransitCard.tsx
│   │   │   ├── EventTicket.tsx
│   │   │   ├── InsuranceCard.tsx
│   │   │   ├── IDCard.tsx
│   │   │   ├── KeyCard.tsx
│   │   │   ├── CouponCard.tsx
│   │   │   └── CryptoWallet.tsx
│   │   └── [existing cards updated]
│   └── ui/
│       ├── SearchBar.tsx
│       ├── CategoryFilter.tsx
│       └── AddCardModal.tsx
```

### 6. **Technical Implementation**

#### Vertical Stack Physics
- Use `framer-motion` layout animations
- Spring physics for natural movement
- Gesture-based card dismissal
- Momentum scrolling through stack

#### State Management
- Zustand for global wallet state
- Optimistic updates for all actions
- Real-time sync with Supabase
- Offline support with sync queue

#### Performance
- Virtual list for large card collections
- Lazy loading card content
- Image optimization and caching
- Progressive enhancement

### 7. **Security Considerations**
- No storage of actual payment card data
- Encrypted sensitive fields in database
- Biometric lock for sensitive cards
- Share cards with expiring links
- Activity logs for all card usage

## Implementation Priority

1. **Phase 1**: Vertical stack layout with existing 4 cards
2. **Phase 2**: Add 3 most useful cards (Loyalty, Gift, Membership)
3. **Phase 3**: Implement card management features
4. **Phase 4**: Add remaining card types
5. **Phase 5**: Polish animations and interactions

## Success Metrics
- Smooth 60fps animations
- < 100ms card switching
- Support 100+ cards without lag
- Offline-first architecture
- Full keyboard/screen reader support 