# SwipeOS Card Development Kit (CDK)

## 🎯 Overview
The SwipeOS Card Development Kit provides a standardized template system for creating cards that seamlessly integrate into the SwipeOS wallet. Each card follows the **L1, L2, L3 format**:

- **L1 (Card)**: The main card component with front/back display
- **L2 (Function Swipe)**: Four directional swipe actions (up, down, left, right)
- **L3 (Pop Page)**: Full-screen popup pages for each swipe action

## 📁 Standardized Folder Structure

```
card-name/
├── README.md                    # Card documentation
├── package.json                 # Card metadata and dependencies
├── config.json                  # Card configuration
├── assets/                      # Card assets
│   ├── icons/
│   ├── images/
│   └── styles/
├── components/                  # L1 - Card Components
│   ├── index.tsx               # Main card component
│   ├── CardFront.tsx           # Front face of card
│   ├── CardBack.tsx            # Back face of card (optional)
│   └── types.ts                # TypeScript types
├── functions/                   # L2 - Swipe Functions
│   ├── index.ts                # Function exports
│   ├── upSwipe.ts              # Up swipe handler
│   ├── downSwipe.ts            # Down swipe handler
│   ├── leftSwipe.ts            # Left swipe handler
│   └── rightSwipe.ts           # Right swipe handler
├── popups/                      # L3 - Popup Pages
│   ├── index.tsx               # Popup exports
│   ├── UpPopup.tsx             # Up swipe popup page
│   ├── DownPopup.tsx           # Down swipe popup page
│   ├── LeftPopup.tsx           # Left swipe popup page
│   └── RightPopup.tsx          # Right swipe popup page
├── hooks/                       # Custom hooks (optional)
│   └── useCardData.ts
├── utils/                       # Utility functions (optional)
│   └── helpers.ts
└── tests/                       # Tests (optional)
    ├── card.test.tsx
    ├── functions.test.ts
    └── popups.test.tsx
```

## 🎨 Design Standards

### Card Dimensions
- **Width**: 320px (fixed)
- **Height**: 200px (fixed)
- **Border Radius**: 16px
- **Aspect Ratio**: 16:10

### Color Scheme
- Primary: Customizable via config.json
- Background: Supports light/dark themes
- Text: High contrast for accessibility

### Typography
- Title: 18px, font-semibold
- Subtitle: 14px, font-medium
- Body: 12px, font-normal

## 🔧 Configuration

### config.json
```json
{
  "id": "unique-card-id",
  "name": "Card Display Name",
  "version": "1.0.0",
  "description": "Brief card description",
  "author": "Developer Name",
  "category": "productivity|social|utility|entertainment|business",
  "tags": ["tag1", "tag2"],
  "theme": {
    "primary": "#3B82F6",
    "secondary": "#1E40AF",
    "accent": "#60A5FA"
  },
  "swipeActions": {
    "up": {
      "label": "Action Name",
      "icon": "IconName",
      "description": "What this action does"
    },
    "down": {
      "label": "Action Name", 
      "icon": "IconName",
      "description": "What this action does"
    },
    "left": {
      "label": "Action Name",
      "icon": "IconName", 
      "description": "What this action does"
    },
    "right": {
      "label": "Action Name",
      "icon": "IconName",
      "description": "What this action does"
    }
  },
  "permissions": ["storage", "network", "notifications"],
  "dependencies": {
    "external": ["axios", "date-fns"],
    "internal": ["@swipeos/core", "@swipeos/ui"]
  }
}
```

## 🚀 Development Workflow

1. **Create Card**: Use `create-card.js` to generate from template
2. **Configure**: Update config.json with card details
3. **Develop**: Build L1 (card), L2 (functions), L3 (popups)
4. **Test**: Use `test-card.js` to validate functionality
5. **Update**: Use `update-card.js` to apply template updates
6. **Package**: Use `package-card.js` to create .swipecard file
7. **Install**: Use `card-installer.js` to install in wallet

## 🛠️ Development Tools

### Create New Card
```bash
node card-development-kit/tools/create-card.js
```

### Validate Card Structure
```bash
node card-development-kit/tools/validate-card.js [card-directory]
```

### Test Card Functionality
```bash
node card-development-kit/tools/test-card.js [card-directory]
```

### Update Existing Card
```bash
node card-development-kit/tools/update-card.js [card-directory]
```

### Package Card for Distribution
```bash
node card-development-kit/tools/package-card.js [card-directory]
```

### Install Card Package
```bash
node card-development-kit/tools/card-installer.js <package.swipecard>
```

## 📦 Installation Process

Cards are installed by:
1. Uploading a zipped card folder
2. Automatic validation of structure and config
3. Integration into the wallet system
4. Registration of swipe actions and popups

## 🎯 Best Practices

- Keep cards lightweight and performant
- Follow accessibility guidelines
- Use TypeScript for type safety
- Implement error boundaries
- Support both light and dark themes
- Make swipe actions intuitive
- Provide clear user feedback

## 🔍 Validation Rules

- All required files must be present
- config.json must be valid JSON
- Components must export default functions
- Swipe functions must return promises
- Popups must accept standard props
- No external network calls without permission 