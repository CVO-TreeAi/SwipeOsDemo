# SwipeOS Card Development Kit (CDK) - Developer Guide

## 🎯 Overview

The SwipeOS Card Development Kit provides everything you need to create custom cards for the SwipeOS wallet. Each card follows the **L1, L2, L3 architecture**:

- **L1 (Card)**: Visual component that displays in the wallet
- **L2 (Functions)**: Business logic triggered by swipe gestures  
- **L3 (Popups)**: Full-screen interfaces for complex interactions

## 🚀 Quick Start

### 1. Create a New Card

```bash
# Navigate to your development directory
cd /path/to/your/projects

# Create a new card
node card-development-kit/tools/create-card.js

# Follow the interactive prompts
```

### 2. Develop Your Card

```bash
# Navigate to your new card
cd your-card-name

# Customize components
# Edit components/CardFront.tsx for the main display
# Edit functions/*.ts for swipe actions
# Edit popups/*.tsx for full-screen interfaces
```

### 3. Test and Validate

```bash
# Validate your card structure
node ../card-development-kit/tools/validate-card.js

# Fix any errors or warnings
```

### 4. Package for Installation

```bash
# Create installable package
node ../card-development-kit/tools/package-card.js

# Upload the .swipecard file to SwipeOS
```

## 📁 Card Structure

```
your-card/
├── config.json              # Card configuration
├── package.json             # Dependencies and metadata
├── README.md                # Card documentation
├── components/              # L1 - Visual Components
│   ├── index.tsx           # Main card component
│   ├── types.ts            # TypeScript definitions
│   ├── CardFront.tsx       # Front face display
│   └── CardBack.tsx        # Back face display (optional)
├── functions/              # L2 - Swipe Functions
│   ├── index.ts            # Function exports
│   ├── upSwipe.ts          # Up swipe handler
│   ├── downSwipe.ts        # Down swipe handler
│   ├── leftSwipe.ts        # Left swipe handler
│   └── rightSwipe.ts       # Right swipe handler
├── popups/                 # L3 - Popup Pages
│   ├── index.tsx           # Popup exports
│   ├── UpPopup.tsx         # Up swipe popup
│   ├── DownPopup.tsx       # Down swipe popup
│   ├── LeftPopup.tsx       # Left swipe popup
│   └── RightPopup.tsx      # Right swipe popup
└── assets/                 # Optional assets
    ├── icons/
    ├── images/
    └── styles/
```

## 🔧 Configuration

### config.json

The main configuration file defines your card's behavior:

```json
{
  "id": "my-awesome-card",
  "name": "My Awesome Card",
  "version": "1.0.0",
  "description": "An awesome card for SwipeOS",
  "author": "Your Name",
  "category": "productivity",
  "tags": ["productivity", "tools"],
  "theme": {
    "primary": "#3B82F6",
    "secondary": "#1E40AF",
    "accent": "#60A5FA",
    "background": "#F8FAFC",
    "backgroundDark": "#1E293B",
    "text": "#1F2937",
    "textDark": "#F9FAFB"
  },
  "swipeActions": {
    "up": {
      "label": "Create",
      "icon": "Plus",
      "description": "Create new item"
    },
    "down": {
      "label": "Settings",
      "icon": "Settings", 
      "description": "Open settings"
    },
    "left": {
      "label": "History",
      "icon": "Clock",
      "description": "View history"
    },
    "right": {
      "label": "Share",
      "icon": "Share2",
      "description": "Share content"
    }
  },
  "dimensions": {
    "width": 320,
    "height": 200,
    "borderRadius": 12
  },
  "permissions": ["storage", "network"],
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

## 🎨 L1 - Card Components

### Main Card Component (components/index.tsx)

```tsx
import React from 'react';
import { CardProps } from './types';
import CardFront from './CardFront';

const MyCard: React.FC<CardProps> = ({ 
  config, 
  isDark, 
  isActive, 
  onSwipe, 
  data 
}) => {
  return (
    <div className="card-container">
      <CardFront 
        config={config}
        isDark={isDark}
        data={data}
      />
    </div>
  );
};

export default MyCard;
```

### Card Front (components/CardFront.tsx)

Design the main visual display of your card:

```tsx
import React from 'react';

const CardFront: React.FC<CardFrontProps> = ({ config, isDark, data }) => {
  return (
    <div className="w-full h-full p-4">
      <h3 className="text-lg font-semibold">{config.name}</h3>
      <p className="text-sm opacity-70">{config.description}</p>
      {/* Your custom content here */}
    </div>
  );
};
```

## ⚡ L2 - Swipe Functions

### Function Structure

Each swipe function should be async and return a result object:

```tsx
import { SwipeFunctionProps } from '../components/types';

export const upSwipe = async (props: SwipeFunctionProps): Promise<any> => {
  const { config, data } = props;

  try {
    // Your business logic here
    const result = await performAction();
    
    return {
      success: true,
      action: 'create',
      data: result,
      message: 'Action completed successfully!'
    };
  } catch (error) {
    return {
      success: false,
      action: 'create',
      error: error.message,
      message: 'Action failed'
    };
  }
};
```

### Data Persistence

Use localStorage for simple data storage:

```tsx
// Save data
const items = JSON.parse(localStorage.getItem(`${config.id}_items`) || '[]');
items.push(newItem);
localStorage.setItem(`${config.id}_items`, JSON.stringify(items));

// Load data
const items = JSON.parse(localStorage.getItem(`${config.id}_items`) || '[]');
```

## 🖼️ L3 - Popup Pages

### Popup Structure

Popups provide full-screen interfaces for complex interactions:

```tsx
import React, { useState } from 'react';
import { PopupProps } from '../components/types';

const UpPopup: React.FC<PopupProps> = ({ config, isDark, onClose, data }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Perform action
      await performAction();
      onClose(); // Close popup on success
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        {/* Your popup content */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
```

## 🎨 Theming

### Using Theme Colors

Access theme colors from the config:

```tsx
const themeColors = isDark ? {
  background: config.theme.backgroundDark,
  text: config.theme.textDark,
} : {
  background: config.theme.background,
  text: config.theme.text,
};

return (
  <div style={{ 
    backgroundColor: themeColors.background,
    color: themeColors.text 
  }}>
    Content
  </div>
);
```

### Responsive Design

Cards should work on all screen sizes:

```tsx
<div className="w-full h-full p-2 sm:p-4">
  <h3 className="text-sm sm:text-lg font-semibold truncate">
    {config.name}
  </h3>
</div>
```

## 🧪 Testing

### Manual Testing

1. Create test data in your functions
2. Test all swipe directions
3. Test both light and dark themes
4. Test on different screen sizes

### Validation

Run the validator before packaging:

```bash
node ../card-development-kit/tools/validate-card.js
```

## 📦 Packaging & Distribution

### Create Package

```bash
node ../card-development-kit/tools/package-card.js
```

This creates a `.swipecard` file that can be installed in SwipeOS.

### Installation Process

1. Upload the `.swipecard` file to SwipeOS
2. SwipeOS validates the package
3. Card is extracted and integrated into the wallet
4. Card appears in the user's wallet

## 🔍 Best Practices

### Performance

- Keep card components lightweight
- Use lazy loading for heavy assets
- Minimize re-renders with React.memo

### User Experience

- Provide clear visual feedback for actions
- Use consistent iconography
- Follow SwipeOS design patterns
- Handle loading and error states gracefully

### Security

- Validate all user inputs
- Sanitize data before storage
- Don't store sensitive information in localStorage
- Follow React security best practices

### Accessibility

- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation works
- Test with screen readers

## 🛠️ Development Tools

### Available Scripts

```bash
# Create new card
node tools/create-card.js

# Validate card structure
node tools/validate-card.js [card-directory]

# Package card for distribution
node tools/package-card.js [card-directory] [output-directory]
```

### Dependencies

The CDK requires:
- Node.js 16+
- npm or yarn
- archiver (for packaging)

## 🐛 Troubleshooting

### Common Issues

**Card not displaying correctly:**
- Check config.json syntax
- Verify all required files exist
- Run validation script

**Swipe functions not working:**
- Ensure functions are async
- Check return value format
- Verify function exports

**Popup not opening:**
- Check popup component exports
- Verify onClose handler
- Test popup component isolation

**Packaging fails:**
- Run validation first
- Check file permissions
- Ensure all dependencies are installed

### Getting Help

1. Check this developer guide
2. Run the validation script
3. Review the template examples
4. Check SwipeOS documentation

## 📚 Examples

See the `template/` directory for a complete working example that demonstrates all features of the CDK.

---

Happy coding! 🚀 