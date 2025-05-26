#!/usr/bin/env node

/**
 * SwipeOS Card Generator
 * 
 * This script creates a new card from the template with customized configuration.
 * Usage: node create-card.js <card-name> [options]
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function pascalCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

function copyTemplate(templateDir, targetDir, replacements) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const items = fs.readdirSync(templateDir);

  for (const item of items) {
    const templatePath = path.join(templateDir, item);
    const targetPath = path.join(targetDir, item);
    const stat = fs.statSync(templatePath);

    if (stat.isDirectory()) {
      copyTemplate(templatePath, targetPath, replacements);
    } else {
      let content = fs.readFileSync(templatePath, 'utf8');
      
      // Apply replacements
      for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(key, 'g');
        content = content.replace(regex, value);
      }

      fs.writeFileSync(targetPath, content);
    }
  }
}

async function generateCard() {
  console.log('🎯 SwipeOS Card Generator\n');

  // Get card name
  const cardName = await question('Card name (e.g., "Todo Manager"): ');
  if (!cardName.trim()) {
    console.log('❌ Card name is required');
    process.exit(1);
  }

  const cardId = kebabCase(cardName);
  const cardClass = pascalCase(cardName);

  // Get other details
  const description = await question('Description: ') || `A ${cardName} card for SwipeOS`;
  const author = await question('Author: ') || 'SwipeOS Developer';
  const category = await question('Category (productivity/social/utility/entertainment/business): ') || 'utility';
  
  // Get swipe actions
  console.log('\n🔄 Configure swipe actions:');
  const upAction = await question('Up swipe action (default: Create): ') || 'Create';
  const downAction = await question('Down swipe action (default: Settings): ') || 'Settings';
  const leftAction = await question('Left swipe action (default: History): ') || 'History';
  const rightAction = await question('Right swipe action (default: Share): ') || 'Share';

  // Get theme colors
  console.log('\n🎨 Theme colors (press enter for defaults):');
  const primaryColor = await question('Primary color (#3B82F6): ') || '#3B82F6';
  const secondaryColor = await question('Secondary color (#1E40AF): ') || '#1E40AF';
  const accentColor = await question('Accent color (#60A5FA): ') || '#60A5FA';

  rl.close();

  // Create replacements map
  const replacements = {
    'template-card': cardId,
    'Template Card': cardName,
    'TemplateCard': cardClass,
    'A template card for SwipeOS development': description,
    'SwipeOS Team': author,
    'template': category,
    'Create': upAction,
    'Settings': downAction,
    'History': leftAction,
    'Share': rightAction,
    '#3B82F6': primaryColor,
    '#1E40AF': secondaryColor,
    '#60A5FA': accentColor
  };

  // Paths
  const templateDir = path.join(__dirname, '../template');
  const outputDir = path.join(process.cwd(), cardId);

  // Check if output directory exists
  if (fs.existsSync(outputDir)) {
    console.log(`❌ Directory "${cardId}" already exists`);
    process.exit(1);
  }

  // Copy template
  console.log('\n📁 Creating card structure...');
  copyTemplate(templateDir, outputDir, replacements);

  // Create README for the new card
  const readmeContent = `# ${cardName}

${description}

## 🚀 Quick Start

1. Customize the card components in \`components/\`
2. Implement swipe functions in \`functions/\`
3. Design popup pages in \`popups/\`
4. Update \`config.json\` as needed
5. Test your card
6. Package and install

## 📁 Structure

- **L1 (Card)**: \`components/index.tsx\` - Main card display
- **L2 (Functions)**: \`functions/\` - Swipe action handlers
- **L3 (Popups)**: \`popups/\` - Full-screen popup pages

## 🎯 Swipe Actions

- **Up**: ${upAction}
- **Down**: ${downAction}
- **Left**: ${leftAction}
- **Right**: ${rightAction}

## 🔧 Development

\`\`\`bash
# Validate card structure
npm run validate

# Test card
npm test

# Build card
npm run build
\`\`\`

## 📦 Installation

1. Zip the entire card folder
2. Upload to SwipeOS wallet
3. Card will be automatically validated and installed

---

Generated with SwipeOS Card Development Kit
`;

  fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent);

  console.log('✅ Card created successfully!');
  console.log(`📁 Location: ${outputDir}`);
  console.log('\n🎯 Next steps:');
  console.log(`1. cd ${cardId}`);
  console.log('2. Customize your card components');
  console.log('3. Implement swipe functions');
  console.log('4. Design popup pages');
  console.log('5. Test and package your card');
  console.log('\n📚 See README.md for detailed instructions');
}

// Run the generator
generateCard().catch(console.error); 