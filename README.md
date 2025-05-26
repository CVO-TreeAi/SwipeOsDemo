# SwipeOS - Digital Wallet Platform

A modern, mobile-first digital wallet platform built with Next.js, featuring an infinite scroll interface with card-based interactions and popup functionality.

## 🚀 Features

### Core Functionality
- **Infinite Scroll Wallet**: Smooth, looping card navigation with 60fps performance
- **4-Directional Swipe Actions**: Swipe up/down/left/right on center card for quick actions
- **Popup System**: 16 interactive popup pages across all card types
- **Mobile-First Design**: Optimized for mobile devices (99.9% usage)
- **Dark/Light Theme**: Seamless theme switching

### Card Types
1. **Profile Card**: User management and analytics
2. **AI Assistant Card**: Conversational AI interface
3. **Business Card**: Contact management and CRM integration
4. **Settings Card**: Configuration and backup management

### Popup Pages (4 per card type)
- **Profile**: Edit Profile, View Analytics, Previous User, Share Profile
- **AI Assistant**: New Conversation, View History, AI Settings, Quick Ask
- **Business**: Call Contact, Send Email, View Details, Add to CRM
- **Settings**: Backup Settings, Reset to Default, Import Config, Export Config

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Gestures**: @use-gesture/react
- **Icons**: Lucide React
- **State Management**: Zustand

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SwipeOSV3CreateCard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📱 Usage

### Navigation
- **Scroll**: Navigate through cards vertically
- **Swipe Center Card**: Trigger directional actions
  - **Up**: Primary action (e.g., Edit, New, Call, Backup)
  - **Down**: Secondary action (e.g., Analytics, History, Email, Reset)
  - **Left**: Tertiary action (e.g., Previous, Settings, Details, Import)
  - **Right**: Quaternary action (e.g., Share, Quick Ask, CRM, Export)

### Popup Interactions
- Each popup is a full-screen modal with specific functionality
- Interactive forms, real-time elements, and business logic
- Mobile-optimized touch interfaces

## 🏗 Architecture

### Vertical Slice Design
Each card represents a complete vertical slice:
- **Card Component**: Main interface
- **Popup Components**: 4 dedicated pages
- **Self-contained**: Independent development and testing

### File Structure
```
src/
├── components/
│   ├── cards/
│   │   ├── ProfileCard/
│   │   │   ├── index.tsx
│   │   │   └── ProfilePopups.tsx
│   │   ├── AiAssistantCard/
│   │   ├── BusinessIdCard/
│   │   └── SettingsCard/
│   └── wallet/
│       └── InfiniteScrollWallet/
pages/
├── index.tsx (Main SwipeOS page)
└── v3.tsx (Redirect to main)
```

## 🎯 Business Applications

### Lead Management
- Contact forms and CRM integration
- Email templates and automation
- Call tracking and analytics

### AI Integration
- Conversational interfaces
- History management
- Settings and preferences

### Data Management
- Backup and restore functionality
- Configuration import/export
- User profile management

## 🚀 Performance

- **60fps animations** with optimized rendering
- **Lazy loading** for popup components
- **Efficient state management** with minimal re-renders
- **Mobile-optimized** touch interactions

## 📄 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

The wallet is configured in the main page component:
```typescript
const config: WalletConfig = {
  title: 'SwipeOS Digital Wallet',
  subtitle: '4 cards • Scroll to navigate • Swipe center card for actions',
  cardHeight: 320,
  cardGap: 32,
  maxWidth: 'max-w-md',
  showScrollIndicators: true,
  showFooter: true,
};
```

## 📱 Mobile Optimization

- Touch-friendly interfaces
- Responsive design patterns
- Optimized for portrait orientation
- Smooth gesture recognition
- Fast loading times

## 🎨 Theming

Built-in dark/light theme support with consistent styling across all components and popups.

## 📈 Future Enhancements

- Real backend integration
- User authentication
- Data persistence
- Push notifications
- Offline functionality
- Additional card types

---

**SwipeOS** - The future of mobile digital wallets. Built for speed, designed for touch, optimized for business.
