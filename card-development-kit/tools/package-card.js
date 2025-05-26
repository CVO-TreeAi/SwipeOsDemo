#!/usr/bin/env node

/**
 * SwipeOS Card Packager
 * 
 * This script packages a card into a zip file ready for installation.
 * Usage: node package-card.js [card-directory] [output-directory]
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

class CardPackager {
  constructor(cardDir, outputDir) {
    this.cardDir = cardDir;
    this.outputDir = outputDir || path.join(cardDir, '..', 'packages');
    this.config = null;
  }

  async loadConfig() {
    try {
      const configPath = path.join(this.cardDir, 'config.json');
      const configContent = fs.readFileSync(configPath, 'utf8');
      this.config = JSON.parse(configContent);
      return true;
    } catch (error) {
      console.log(`❌ Error loading config.json: ${error.message}`);
      return false;
    }
  }

  validateCard() {
    console.log('🔍 Validating card before packaging...');
    
    // Run basic validation
    const requiredFiles = [
      'config.json',
      'package.json',
      'components/index.tsx',
      'components/types.ts',
      'functions/index.ts',
      'popups/index.tsx'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(this.cardDir, file);
      if (!fs.existsSync(filePath)) {
        console.log(`❌ Missing required file: ${file}`);
        return false;
      }
    }

    console.log('✅ Basic validation passed');
    return true;
  }

  async createPackage() {
    if (!this.validateCard()) {
      return false;
    }

    if (!await this.loadConfig()) {
      return false;
    }

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    const packageName = `${this.config.id}-v${this.config.version}.swipecard`;
    const outputPath = path.join(this.outputDir, packageName);

    console.log(`📦 Creating package: ${packageName}`);

    return new Promise((resolve, reject) => {
      // Create write stream
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });

      output.on('close', () => {
        const sizeKB = (archive.pointer() / 1024).toFixed(2);
        console.log(`✅ Package created successfully!`);
        console.log(`📁 Location: ${outputPath}`);
        console.log(`📊 Size: ${sizeKB} KB`);
        console.log(`🎯 Ready for installation in SwipeOS`);
        resolve(true);
      });

      archive.on('error', (err) => {
        console.log(`❌ Error creating package: ${err.message}`);
        reject(err);
      });

      // Pipe archive data to the file
      archive.pipe(output);

      // Add files to archive
      this.addFilesToArchive(archive);

      // Finalize the archive
      archive.finalize();
    });
  }

  addFilesToArchive(archive) {
    // Files to include
    const filesToInclude = [
      'config.json',
      'package.json',
      'README.md'
    ];

    // Directories to include
    const dirsToInclude = [
      'components',
      'functions',
      'popups',
      'assets',
      'hooks',
      'utils'
    ];

    // Add individual files
    for (const file of filesToInclude) {
      const filePath = path.join(this.cardDir, file);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file });
        console.log(`📄 Added: ${file}`);
      }
    }

    // Add directories
    for (const dir of dirsToInclude) {
      const dirPath = path.join(this.cardDir, dir);
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        archive.directory(dirPath, dir);
        console.log(`📁 Added directory: ${dir}`);
      }
    }

    // Add manifest file
    const manifest = {
      cardId: this.config.id,
      name: this.config.name,
      version: this.config.version,
      description: this.config.description,
      author: this.config.author,
      category: this.config.category,
      packagedAt: new Date().toISOString(),
      swipeosVersion: '3.0.0',
      format: 'swipecard-v1'
    };

    archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' });
    console.log('📄 Added: manifest.json');
  }

  async package() {
    console.log(`🚀 SwipeOS Card Packager\n`);
    console.log(`📁 Card directory: ${this.cardDir}`);
    console.log(`📦 Output directory: ${this.outputDir}\n`);

    try {
      const success = await this.createPackage();
      return success;
    } catch (error) {
      console.log(`❌ Packaging failed: ${error.message}`);
      return false;
    }
  }
}

// Check if archiver is available
try {
  require.resolve('archiver');
} catch (error) {
  console.log('❌ Missing dependency: archiver');
  console.log('📦 Install with: npm install archiver');
  process.exit(1);
}

// Main execution
const cardDir = process.argv[2] || process.cwd();
const outputDir = process.argv[3];

if (!fs.existsSync(cardDir)) {
  console.log(`❌ Card directory not found: ${cardDir}`);
  process.exit(1);
}

const packager = new CardPackager(cardDir, outputDir);
packager.package().then(success => {
  process.exit(success ? 0 : 1);
}); 