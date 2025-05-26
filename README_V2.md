# SwipeOS Wallet V2 - TreeAI Edition

A modern, **vertically-stacked** digital wallet interface built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. Version 2 transforms the horizontal swipe experience into an elegant card stack with expanded card types and full Supabase backend integration.

## 🆕 What's New in V2

### ✨ Vertical Stack Architecture
- Cards stack vertically with beautiful peek-through design
- Top card fully visible, others partially visible behind
- Smooth spring animations for natural card movements
- 3D perspective effects and tilt animations

### 🎴 10+ New Card Types
Beyond the original 4 cards, V2 introduces:
- **Loyalty Cards** - Store rewards programs with point tracking
- **Gift Cards** - Digital gift card balances with PIN protection
- **Membership Cards** - Gym, clubs, subscriptions with QR codes
- **Transit Cards** - Public transport passes
- **Event Tickets** - Concerts, movies with dynamic QR
- **Insurance Cards** - Health/auto insurance info
- **ID Cards** - Digital identification (non-official)
- **Key Cards** - Hotel keys, access cards
- **Coupon Cards** - Discount codes and offers
- **Crypto Wallets** - Wallet addresses and balances

### 🚀 Enhanced Features
- **Drag to dismiss** - Swipe cards up to archive
- **Card management** - Add, remove, reorder cards
- **Real-time sync** - Powered by Supabase
- **Activity tracking** - Log all card interactions
- **Offline support** - Works without internet
- **Search & filter** - Find cards quickly
- **Favorites** - Pin important cards

## 📸 Screenshots

### Vertical Stack View
```
┌─────────────────┐
│   Profile Card  │ ← Active card (full size)
└────┬────────────┘
     │ Loyalty     │ ← Peeking card
     └─┬───────────┘
       │ Gift Card │ ← Stacked behind
       └───────────┘
```

## 🛠️ Technical Stack

- **Frontend**: Next.js 14, React 18, TypeScript 5
- **Styling**: Tailwind CSS 3, Framer Motion 10
- **State**: Zustand for global state management
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Gestures**: @use-gesture/react for advanced interactions
- **UI Components**: Radix UI for accessible components

## 📁 V2 Project Structure

```
TreeAi/
├── src/
│   ├── components/
│   │   ├── wallet/
│   │   │   ├── WalletContainer.tsx    # Main container
│   │   │   ├── CardStack.tsx          # Vertical stack logic
│   │   │   └── CardPlaceholder.tsx    # Empty states
│   │   ├── cards/
│   │   │   ├── base/
│   │   │   │   └── WalletCard.tsx     # Enhanced base card
│   │   │   ├── digital/               # New card types
│   │   │   │   ├── LoyaltyCard.tsx
│   │   │   │   ├── GiftCard.tsx
│   │   │   │   └── MembershipCard.tsx
│   │   │   └── [original cards]
│   │   └── ui/                        # Shared UI components
│   └── store/
│       └── walletStore.ts             # Zustand store
├── pages/
│   ├── index.tsx                      # V1 (preserved)
│   └── v2.tsx                         # V2 (new)
├── database/
│   ├── schema.sql                     # V1 schema
│   └── schema_v2.sql                  # V2 schema
└── PLAN_V2.md                         # Development plan
```

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up V2 database** (run in Supabase SQL editor):
   ```bash
   # Copy contents of database/schema_v2.sql
   ```

3. **Configure environment** (same as V1):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_role_key
   ```

4. **Start development**:
   ```bash
   npm run dev
   ```

5. **View V2**:
   ```
   http://localhost:3002/v2
   ```

## 🎮 V2 Interactions

### Card Navigation
- **Drag Up**: Archive/dismiss card
- **Drag Down**: Pull to refresh (future feature)
- **Click Card**: Bring to front if not active
- **Long Press**: Card options menu (coming soon)
- **Pinch**: Zoom card details (coming soon)

### Gesture Physics
- **Spring animations**: Natural, bouncy movements
- **Drag threshold**: 100px to trigger actions
- **Momentum**: Velocity-based interactions
- **Constraints**: Cards snap back if not dismissed

## 🗄️ Database Schema V2

### New Tables

#### `card_types`
Defines available card templates:
```sql
- id (UUID)
- name (TEXT)
- icon (TEXT)
- category (TEXT)
- template_config (JSONB)
```

#### `user_cards`
Flexible card storage with JSONB:
```sql
- id (UUID)
- user_id (UUID)
- card_type_id (UUID)
- name (TEXT)
- data (JSONB) -- Flexible card data
- position (INTEGER)
- is_favorite (BOOLEAN)
- is_archived (BOOLEAN)
- expires_at (TIMESTAMP)
```

#### `card_transactions`
Activity logging:
```sql
- id (UUID)
- card_id (UUID)
- action (TEXT) -- 'used', 'updated', 'shared'
- metadata (JSONB)
- created_at (TIMESTAMP)
```

## 🎨 Creating Custom Cards

1. **Create card component**:
   ```typescript
   // src/components/cards/digital/CustomCard.tsx
   export const CustomCard: React.FC<CustomCardProps> = ({
     theme,
     // your props
   }) => {
     return (
       <div className="relative w-full h-full p-6">
         {/* Your card design */}
       </div>
     );
   };
   ```

2. **Add to card types** in database:
   ```sql
   INSERT INTO card_types (name, icon, category, template_config)
   VALUES ('custom', 'icon-name', 'category', '{"fields": [...]}');
   ```

3. **Use in wallet**:
   ```typescript
   const card: CardData = {
     id: 'unique-id',
     type: 'custom',
     position: 0,
     component: <CustomCard {...props} />
   };
   ```

## 🔐 Security Notes

- No actual payment card data storage
- Sensitive fields encrypted in database
- Row-level security enabled
- Biometric lock for sensitive cards (planned)
- Activity audit trail

## 🚀 Deployment

Same as V1, with additional considerations:
- Ensure Zustand works with SSR
- Configure Supabase realtime for production
- Set up proper CORS for card assets

## 📊 Performance

- **60fps animations** with hardware acceleration
- **< 100ms** card switching time
- **Virtual list** for 100+ cards
- **Lazy loading** for card content
- **Image optimization** with Next.js

## 🔮 Future Roadmap

- [ ] NFC support for transit cards
- [ ] Barcode scanner for adding cards
- [ ] Card sharing via secure links
- [ ] Apple/Google Wallet import
- [ ] Backup & restore functionality
- [ ] Multi-device sync
- [ ] Card templates marketplace

## 🤝 Contributing

V2 is in active development. Please:
1. Keep V1 intact on the main branch
2. Work on `v2-*` branches
3. Test thoroughly with multiple card types
4. Ensure backwards compatibility

## 📝 Migration from V1

Users can migrate by:
1. Exporting V1 data
2. Running migration script (coming soon)
3. Or starting fresh with V2's expanded features

---

Built with ❤️ for TreeAI Services | [V1 Docs](./README.md) | [Development Plan](./PLAN_V2.md) 