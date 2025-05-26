# SwipeOS Wallet - TreeAI Edition

A modern, swipe-based wallet interface built with Next.js, TypeScript, Tailwind CSS, and Framer Motion for TreeAI services.

## 🚀 Features

- **4 Interactive Cards**: Profile, Business ID, Settings, and AI Assistant
- **Swipe Gestures**: Left/right navigation with 100px threshold
- **Keyboard Navigation**: Arrow key support for accessibility
- **Theme Support**: Light and dark mode toggle
- **Responsive Design**: 3:2 aspect ratio cards (300×200px)
- **Smooth Animations**: Framer Motion powered transitions
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
   http://localhost:3002
   ```

6. **Optional: Use Setup Page**:
   Visit `http://localhost:3002/setup` to insert sample data via the API

## 🎮 Usage

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

## 🎯 Next Steps

- [ ] Add user authentication with Supabase Auth
- [ ] Implement actual AI chat functionality
- [ ] Add more card types and customization options
- [ ] Progressive Web App (PWA) features
- [ ] Unit tests with Jest/Vitest
- [ ] Row Level Security (RLS) policies for multi-tenancy

---

Built with ❤️ for TreeAi Services
