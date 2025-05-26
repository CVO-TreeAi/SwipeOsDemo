# SwipeOS Wallet - TreeAI Edition (V3 Alpha)

A production-ready infinite scroll wallet interface with 3D card animations, built with Next.js, TypeScript, Tailwind CSS, and Framer Motion for TreeAI services.

> **🚀 V3 Alpha Release**: This branch contains the complete infinite scroll wallet implementation with production-ready template system.

## 🚀 V3 Alpha Features

### ✅ Infinite Scroll System
- **Seamless looping**: Cards repeat infinitely without boundaries
- **60fps performance**: Hardware-accelerated scrolling
- **Touch/trackpad support**: Native scroll behavior with gesture recognition
- **Position tracking**: Automatic card selection based on scroll position

### ✅ 3D Card Flip Animations
- **Double-tap to flip**: Intuitive gesture for revealing card backs
- **Custom back content**: Unique information for each card type
- **Smooth transitions**: CSS3 transforms with hardware acceleration

### ✅ Production-Ready Template System
- **Reusable components**: Fully configurable InfiniteScrollWallet template
- **TypeScript support**: Complete type safety with interfaces
- **Event handling**: Comprehensive callback system for interactions
- **Documentation**: Detailed implementation guide and examples

### ✅ Legacy Features (V1/V2)
- **4 Interactive Cards**: Profile, Business ID, Settings, and AI Assistant
- **Theme Support**: Light and dark mode toggle
- **Responsive Design**: Adapts to viewport dimensions
- **TypeScript**: Fully typed for production readiness

## 📁 Project Structure

```
TreeAi/
├── src/
│   └── components/
│       └── cards/
│           ├── BaseCard/
│           │   ├── index.tsx      # Base card component with swipe logic
│           │   └── types.ts       # TypeScript interfaces
│           ├── ProfileCard/
│           │   └── index.tsx      # User profile card
│           ├── BusinessIdCard/
│           │   └── index.tsx      # Company information card
│           ├── SettingsCard/
│           │   └── index.tsx      # Settings toggles card
│           └── AiAssistantCard/
│               └── index.tsx      # AI chat interface card
├── pages/
│   ├── _app.tsx                   # App configuration
│   └── index.tsx                  # Main deck page
├── styles/
│   └── globals.css                # Global styles with Tailwind
└── package.json
```

## 🛠️ Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Supabase Database**:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `database/schema.sql`
   - Run the SQL to create tables and sample data

3. **Configure Environment Variables**:
   Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_role_key
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   ```
   http://localhost:3000  (or 3001/3002 if port is in use)
   ```

6. **Access V3 Alpha Wallet**:
   ```
   http://localhost:3000/v3
   ```

7. **Optional: Use Setup Page**:
   Visit `http://localhost:3000/setup` to insert sample data via the API

## 🎮 V3 Alpha Usage

### Infinite Scroll Navigation
- **Scroll/Swipe**: Vertical scrolling through cards with infinite loop
- **Double-tap**: Flip cards to reveal back content with stats/info
- **Scroll indicators**: Right-side dots for quick navigation
- **Auto-selection**: Cards automatically select based on scroll position

### V3 Alpha Template System
Access the new infinite scroll wallet at `/v3`:
- **InfiniteScrollWallet**: Main template component
- **WalletExample**: Complete usage example
- **Custom configuration**: Fully configurable sizing, spacing, and behavior

## 🎮 Legacy Usage (V1/V2)

### Navigation
- **Swipe Left/Right**: Navigate between cards
- **Arrow Keys**: Keyboard navigation (←/→)
- **Card Indicators**: Click dots to jump to specific cards
- **Theme Toggle**: Click sun/moon icon to switch themes

### Card Features
- **Profile Card**: Shows user avatar, name, and company with completion progress
- **Business ID Card**: Displays company logo, contact email, and phone
- **Settings Card**: Interactive toggles for app preferences
- **AI Assistant Card**: Unread message count and chat access

### Swipe Gestures
- **Threshold**: 100px movement required to trigger navigation
- **Directions**: 
  - Left/Right: Card navigation
  - Up/Down: Available for card-specific actions
- **Fallback**: Arrow key navigation for accessibility

## 🎨 Customization

### Adding New Cards
1. Create new card component in `src/components/cards/NewCard/`
2. Add props interface to `BaseCard/types.ts`
3. Import and add to cards array in `pages/index.tsx`

### Styling
- **Theme Colors**: Modify theme classes in each component
- **Card Size**: Update `w-[300px] h-[200px]` in BaseCard
- **Animations**: Customize Framer Motion variants

### Data Source
Replace the stub data in `getServerSideProps` with actual API calls:

```typescript
export const getServerSideProps: GetServerSideProps<DeckPageProps> = async (context) => {
  // Replace with actual API calls
  const data = await fetchUserData();
  return { props: { data } };
};
```

## 🔧 Dependencies

- **Next.js 14**: React framework
- **React 18**: UI library
- **TypeScript 5**: Type safety
- **Framer Motion 10**: Animations and gestures
- **Tailwind CSS 3**: Utility-first styling
- **Supabase JS**: Database client and authentication

## 📱 Browser Support

- Modern browsers with touch/pointer events
- Keyboard navigation fallback
- Responsive design for mobile and desktop

## 🚀 Production Build

```bash
npm run build
npm start
```

## 📚 V3 Alpha Documentation

### Core Documentation Files
- **`INFINITE_SCROLL_WALLET_TEMPLATE.md`**: Complete template documentation with examples
- **`V3_ALPHA_SUMMARY.md`**: Technical implementation details and performance metrics
- **`V3_WALLET_IMPLEMENTATION.md`**: Development notes and implementation guide

### Template Files
- **`src/components/wallet/InfiniteScrollWallet.tsx`**: Main template component (269 lines)
- **`src/components/wallet/examples/WalletExample.tsx`**: Usage example (170 lines)
- **`pages/v3.tsx`**: Production implementation (112 lines)

## 🗄️ Backend Integration

The application now includes full Supabase integration:

### Database Schema
- **users**: User profiles and authentication data
- **companies**: Company information linked to users
- **user_settings**: User preferences with real-time updates
- **ai_conversations**: AI chat history and unread counts

### API Endpoints
- `GET /api/user/dashboard-data` - Fetch all dashboard data
- `POST /api/user/update-settings` - Update user preferences
- `POST /api/setup-database` - Initialize sample data

### Features
- ✅ Real-time settings persistence
- ✅ Dynamic data loading from Supabase
- ✅ Fallback to static data if database unavailable
- ✅ TypeScript interfaces for all database operations

## 🎯 V3 Alpha Status

### ✅ Completed Features
- [x] Infinite scroll with seamless looping
- [x] 3D card flip animations with double-tap
- [x] Production-ready template system
- [x] Complete TypeScript support
- [x] 60fps performance optimization
- [x] Responsive design with theme support
- [x] Comprehensive documentation and examples

### 🔮 V4 Roadmap
- [ ] Virtual scrolling for 500+ cards
- [ ] Drag-and-drop card reordering
- [ ] Advanced animation effects
- [ ] Accessibility improvements
- [ ] PWA integration with offline caching
- [ ] User authentication with Supabase Auth
- [ ] Unit tests with Jest/Vitest

## 🏷️ Version Information

- **Current Version**: V3 Alpha (3.0.0-alpha)
- **Branch**: `alpha`
- **Status**: Production-ready template
- **Next Release**: V4 Beta (Q2 2025)

---

Built with ❤️ for TreeAi Services | V3 Alpha Release
