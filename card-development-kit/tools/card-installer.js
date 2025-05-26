#!/usr/bin/env node

/**
 * SwipeOS Card Installer
 * 
 * This script installs cards from .swipecard packages into the wallet.
 * Usage: node card-installer.js <swipecard-file> [target-directory]
 */

const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');

class CardInstaller {
  constructor(packagePath, targetDir) {
    this.packagePath = packagePath;
    this.targetDir = targetDir || path.join(process.cwd(), 'src/cards');
    this.tempDir = path.join(process.cwd(), '.temp-card-install');
    this.manifest = null;
    this.config = null;
  }

  async install() {
    console.log('📦 SwipeOS Card Installer\n');
    console.log(`Installing: ${path.basename(this.packagePath)}`);
    console.log(`Target: ${this.targetDir}\n`);

    try {
      // Validate package
      if (!await this.validatePackage()) {
        throw new Error('Invalid card package');
      }

      // Extract package
      await this.extractPackage();

      // Load and validate manifest
      await this.loadManifest();

      // Load and validate config
      await this.loadConfig();

      // Check for conflicts
      await this.checkConflicts();

      // Validate card structure
      await this.validateCard();

      // Install card
      await this.installCard();

      // Update wallet registry
      await this.updateRegistry();

      // Cleanup
      await this.cleanup();

      console.log('\n✅ Card installed successfully!');
      console.log(`📁 Location: ${this.targetDir}/${this.config.id}`);
      console.log('\n🎯 Next steps:');
      console.log('1. Restart your development server');
      console.log('2. Import the card in your wallet');
      console.log('3. Test the card functionality');

    } catch (error) {
      console.error(`\n❌ Installation failed: ${error.message}`);
      await this.cleanup();
      process.exit(1);
    }
  }

  async validatePackage() {
    if (!fs.existsSync(this.packagePath)) {
      console.log('❌ Package file not found');
      return false;
    }

    if (!this.packagePath.endsWith('.swipecard')) {
      console.log('❌ Invalid package format (must be .swipecard)');
      return false;
    }

    console.log('✅ Package format validated');
    return true;
  }

  async extractPackage() {
    console.log('📂 Extracting package...');

    // Create temp directory
    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true });
    }
    fs.mkdirSync(this.tempDir, { recursive: true });

    // Extract package
    await new Promise((resolve, reject) => {
      fs.createReadStream(this.packagePath)
        .pipe(unzipper.Extract({ path: this.tempDir }))
        .on('close', resolve)
        .on('error', reject);
    });

    console.log('✅ Package extracted');
  }

  async loadManifest() {
    console.log('📋 Loading manifest...');

    const manifestPath = path.join(this.tempDir, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error('Missing manifest.json');
    }

    this.manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // Validate manifest
    const requiredFields = ['cardId', 'name', 'version', 'format'];
    for (const field of requiredFields) {
      if (!this.manifest[field]) {
        throw new Error(`Missing required manifest field: ${field}`);
      }
    }

    // Check format version
    if (this.manifest.format !== 'swipecard-v1') {
      throw new Error(`Unsupported package format: ${this.manifest.format}`);
    }

    console.log(`✅ Manifest loaded: ${this.manifest.name} v${this.manifest.version}`);
  }

  async loadConfig() {
    console.log('⚙️  Loading configuration...');

    const configPath = path.join(this.tempDir, 'config.json');
    if (!fs.existsSync(configPath)) {
      throw new Error('Missing config.json');
    }

    this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Validate config matches manifest
    if (this.config.id !== this.manifest.cardId) {
      throw new Error('Config ID does not match manifest');
    }

    console.log(`✅ Configuration loaded: ${this.config.id}`);
  }

  async checkConflicts() {
    console.log('🔍 Checking for conflicts...');

    const targetPath = path.join(this.targetDir, this.config.id);
    if (fs.existsSync(targetPath)) {
      console.log(`⚠️  Card "${this.config.id}" already exists`);
      
      // Compare versions
      try {
        const existingConfig = JSON.parse(
          fs.readFileSync(path.join(targetPath, 'config.json'), 'utf8')
        );
        
        console.log(`   Existing version: ${existingConfig.version}`);
        console.log(`   New version: ${this.config.version}`);
        
        // Simple version comparison (you might want to use semver)
        if (this.config.version <= existingConfig.version) {
          throw new Error('New version is not higher than existing version');
        }
        
        console.log('✅ Upgrading to newer version');
        
        // Backup existing card
        const backupPath = targetPath + `-backup-${Date.now()}`;
        fs.renameSync(targetPath, backupPath);
        console.log(`📁 Backup created: ${path.basename(backupPath)}`);
        
      } catch (error) {
        if (error.message.includes('version')) {
          throw error;
        }
        throw new Error('Failed to check existing card');
      }
    } else {
      console.log('✅ No conflicts found');
    }
  }

  async validateCard() {
    console.log('🔍 Validating card structure...');

    const requiredDirs = ['components', 'functions', 'popups'];
    const requiredFiles = [
      'components/index.tsx',
      'components/types.ts',
      'functions/index.ts',
      'popups/index.tsx'
    ];

    for (const dir of requiredDirs) {
      const dirPath = path.join(this.tempDir, dir);
      if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
        throw new Error(`Missing required directory: ${dir}`);
      }
    }

    for (const file of requiredFiles) {
      const filePath = path.join(this.tempDir, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Missing required file: ${file}`);
      }
    }

    console.log('✅ Card structure validated');
  }

  async installCard() {
    console.log('📥 Installing card...');

    const targetPath = path.join(this.targetDir, this.config.id);
    
    // Create target directory
    if (!fs.existsSync(this.targetDir)) {
      fs.mkdirSync(this.targetDir, { recursive: true });
    }

    // Copy card files
    this.copyDirectory(this.tempDir, targetPath, ['manifest.json']);

    // Create index file for easy import
    const indexContent = `// Auto-generated card export
export { default } from './components';
export * from './components/types';
export * as functions from './functions';
export * as popups from './popups';
export { default as config } from './config.json';
`;

    fs.writeFileSync(path.join(targetPath, 'index.ts'), indexContent);

    console.log('✅ Card files installed');
  }

  copyDirectory(source, target, exclude = []) {
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }

    const items = fs.readdirSync(source);
    
    for (const item of items) {
      if (exclude.includes(item)) continue;
      
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

  async updateRegistry() {
    console.log('📝 Updating card registry...');

    const registryPath = path.join(this.targetDir, 'registry.json');
    let registry = { cards: [] };

    // Load existing registry
    if (fs.existsSync(registryPath)) {
      registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    }

    // Remove existing entry if upgrading
    registry.cards = registry.cards.filter(card => card.id !== this.config.id);

    // Add new entry
    registry.cards.push({
      id: this.config.id,
      name: this.config.name,
      version: this.config.version,
      description: this.config.description,
      category: this.config.category,
      installedAt: new Date().toISOString(),
      path: this.config.id
    });

    // Save registry
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));

    console.log('✅ Registry updated');
  }

  async cleanup() {
    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true });
    }
  }
}

// Check if unzipper is available
try {
  require.resolve('unzipper');
} catch (error) {
  console.log('❌ Missing dependency: unzipper');
  console.log('📦 Install with: npm install unzipper');
  process.exit(1);
}

// Main execution
async function main() {
  const packagePath = process.argv[2];
  const targetDir = process.argv[3];

  if (!packagePath) {
    console.log('Usage: node card-installer.js <swipecard-file> [target-directory]');
    process.exit(1);
  }

  const installer = new CardInstaller(packagePath, targetDir);
  await installer.install();
}

main().catch(console.error); 