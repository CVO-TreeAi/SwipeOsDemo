#!/usr/bin/env node

/**
 * SwipeOS Card Updater
 * 
 * This script helps update existing cards with new features or fixes from the template.
 * Usage: node update-card.js [card-directory] [options]
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

class CardUpdater {
  constructor(cardDir) {
    this.cardDir = cardDir;
    this.templateDir = path.join(__dirname, '../template');
    this.updates = [];
  }

  async checkForUpdates() {
    console.log('🔍 Checking for updates...\n');

    // Check template version
    const templatePkg = JSON.parse(fs.readFileSync(path.join(this.templateDir, 'package.json'), 'utf8'));
    const cardPkg = JSON.parse(fs.readFileSync(path.join(this.cardDir, 'package.json'), 'utf8'));

    if (templatePkg.version !== cardPkg.version) {
      this.updates.push({
        type: 'version',
        message: `Template version ${templatePkg.version} is newer than card version ${cardPkg.version}`,
        files: ['package.json']
      });
    }

    // Check for missing files
    this.checkMissingFiles();

    // Check for outdated types
    this.checkOutdatedTypes();

    // Check for new features
    this.checkNewFeatures();

    return this.updates;
  }

  checkMissingFiles() {
    const requiredFiles = [
      'components/types.ts',
      'functions/index.ts',
      'popups/index.tsx',
      'README.md'
    ];

    for (const file of requiredFiles) {
      const cardPath = path.join(this.cardDir, file);
      if (!fs.existsSync(cardPath)) {
        this.updates.push({
          type: 'missing',
          message: `Missing required file: ${file}`,
          files: [file],
          action: 'add'
        });
      }
    }
  }

  checkOutdatedTypes() {
    const typesPath = path.join(this.cardDir, 'components/types.ts');
    if (fs.existsSync(typesPath)) {
      const cardTypes = fs.readFileSync(typesPath, 'utf8');
      const templateTypes = fs.readFileSync(path.join(this.templateDir, 'components/types.ts'), 'utf8');

      // Simple check for missing interfaces
      const templateInterfaces = templateTypes.match(/export interface \w+/g) || [];
      const cardInterfaces = cardTypes.match(/export interface \w+/g) || [];

      const missingInterfaces = templateInterfaces.filter(i => !cardInterfaces.includes(i));
      
      if (missingInterfaces.length > 0) {
        this.updates.push({
          type: 'types',
          message: `Missing type definitions: ${missingInterfaces.join(', ')}`,
          files: ['components/types.ts'],
          action: 'merge'
        });
      }
    }
  }

  checkNewFeatures() {
    // Check for new popup features
    const popupFiles = ['UpPopup.tsx', 'DownPopup.tsx', 'LeftPopup.tsx', 'RightPopup.tsx'];
    
    for (const file of popupFiles) {
      const cardPath = path.join(this.cardDir, 'popups', file);
      const templatePath = path.join(this.templateDir, 'popups', file);
      
      if (fs.existsSync(cardPath) && fs.existsSync(templatePath)) {
        const cardContent = fs.readFileSync(cardPath, 'utf8');
        const templateContent = fs.readFileSync(templatePath, 'utf8');
        
        // Check for new hooks or features
        if (templateContent.includes('useState') && !cardContent.includes('useState')) {
          this.updates.push({
            type: 'feature',
            message: `New state management features available in ${file}`,
            files: [`popups/${file}`],
            action: 'review'
          });
        }
      }
    }
  }

  async applyUpdates() {
    if (this.updates.length === 0) {
      console.log('✅ Your card is up to date!');
      return;
    }

    console.log(`\n📦 Found ${this.updates.length} available updates:\n`);
    
    for (const update of this.updates) {
      console.log(`${this.getUpdateIcon(update.type)} ${update.message}`);
      console.log(`   Files: ${update.files.join(', ')}`);
      console.log(`   Action: ${update.action}\n`);
    }

    const proceed = await question('Would you like to apply these updates? (y/n): ');
    
    if (proceed.toLowerCase() !== 'y') {
      console.log('❌ Update cancelled');
      return;
    }

    // Backup current card
    await this.backupCard();

    // Apply updates
    for (const update of this.updates) {
      await this.applyUpdate(update);
    }

    console.log('\n✅ Updates applied successfully!');
    console.log('📁 Backup created in: card-backup/');
    console.log('\n🎯 Next steps:');
    console.log('1. Review the changes');
    console.log('2. Test your card');
    console.log('3. Update version in package.json');
  }

  getUpdateIcon(type) {
    switch (type) {
      case 'version': return '📌';
      case 'missing': return '❌';
      case 'types': return '🔧';
      case 'feature': return '✨';
      default: return '📦';
    }
  }

  async backupCard() {
    const backupDir = path.join(this.cardDir, '..', 'card-backup', path.basename(this.cardDir) + '-' + Date.now());
    console.log('\n📁 Creating backup...');
    
    this.copyDirectory(this.cardDir, backupDir);
  }

  copyDirectory(source, target) {
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }

    const items = fs.readdirSync(source);
    
    for (const item of items) {
      if (item === 'node_modules' || item === '.git') continue;
      
      const sourcePath = path.join(source, item);
      const targetPath = path.join(target, item);
      const stat = fs.statSync(sourcePath);
      
      if (stat.isDirectory()) {
        this.copyDirectory(sourcePath, targetPath);
      } else {
        fs.copyFileSync(sourcePath, targetPath);
      }
    }
  }

  async applyUpdate(update) {
    console.log(`\n🔧 Applying: ${update.message}`);
    
    switch (update.action) {
      case 'add':
        for (const file of update.files) {
          const sourcePath = path.join(this.templateDir, file);
          const targetPath = path.join(this.cardDir, file);
          
          // Ensure directory exists
          const dir = path.dirname(targetPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`   ✅ Added: ${file}`);
        }
        break;
      
      case 'merge':
        // For now, just notify - manual merge required
        console.log(`   ⚠️  Manual merge required for: ${update.files.join(', ')}`);
        console.log(`   Please review the template files and merge changes manually.`);
        break;
      
      case 'review':
        console.log(`   ℹ️  Review recommended for: ${update.files.join(', ')}`);
        console.log(`   New features are available in the template.`);
        break;
    }
  }
}

async function main() {
  console.log('🔄 SwipeOS Card Updater\n');

  const cardDir = process.argv[2] || process.cwd();
  
  if (!fs.existsSync(cardDir)) {
    console.log(`❌ Card directory not found: ${cardDir}`);
    process.exit(1);
  }

  if (!fs.existsSync(path.join(cardDir, 'config.json'))) {
    console.log(`❌ Not a valid card directory: ${cardDir}`);
    console.log('   Missing config.json');
    process.exit(1);
  }

  const updater = new CardUpdater(cardDir);
  await updater.checkForUpdates();
  await updater.applyUpdates();
  
  rl.close();
}

main().catch(console.error); 