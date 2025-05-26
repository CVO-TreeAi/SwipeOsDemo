#!/usr/bin/env node

/**
 * SwipeOS Card Validator
 * 
 * This script validates a card's structure, configuration, and components.
 * Usage: node validate-card.js [card-directory]
 */

const fs = require('fs');
const path = require('path');

class CardValidator {
  constructor(cardDir) {
    this.cardDir = cardDir;
    this.errors = [];
    this.warnings = [];
    this.config = null;
  }

  log(type, message) {
    if (type === 'error') {
      this.errors.push(message);
      console.log(`❌ ${message}`);
    } else if (type === 'warning') {
      this.warnings.push(message);
      console.log(`⚠️  ${message}`);
    } else {
      console.log(`✅ ${message}`);
    }
  }

  validateFileExists(filePath, required = true) {
    const fullPath = path.join(this.cardDir, filePath);
    const exists = fs.existsSync(fullPath);
    
    if (!exists && required) {
      this.log('error', `Required file missing: ${filePath}`);
    } else if (!exists) {
      this.log('warning', `Optional file missing: ${filePath}`);
    } else {
      this.log('success', `Found: ${filePath}`);
    }
    
    return exists;
  }

  validateDirectoryExists(dirPath, required = true) {
    const fullPath = path.join(this.cardDir, dirPath);
    const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
    
    if (!exists && required) {
      this.log('error', `Required directory missing: ${dirPath}`);
    } else if (!exists) {
      this.log('warning', `Optional directory missing: ${dirPath}`);
    } else {
      this.log('success', `Found directory: ${dirPath}`);
    }
    
    return exists;
  }

  validateConfig() {
    console.log('\n📋 Validating config.json...');
    
    if (!this.validateFileExists('config.json')) {
      return false;
    }

    try {
      const configPath = path.join(this.cardDir, 'config.json');
      const configContent = fs.readFileSync(configPath, 'utf8');
      this.config = JSON.parse(configContent);
      
      // Required fields
      const requiredFields = ['id', 'name', 'version', 'description', 'author', 'category'];
      for (const field of requiredFields) {
        if (!this.config[field]) {
          this.log('error', `Missing required config field: ${field}`);
        }
      }

      // Validate swipe actions
      if (!this.config.swipeActions) {
        this.log('error', 'Missing swipeActions in config');
      } else {
        const directions = ['up', 'down', 'left', 'right'];
        for (const direction of directions) {
          if (!this.config.swipeActions[direction]) {
            this.log('error', `Missing swipe action: ${direction}`);
          } else {
            const action = this.config.swipeActions[direction];
            if (!action.label || !action.icon || !action.description) {
              this.log('error', `Incomplete swipe action config for ${direction}`);
            }
          }
        }
      }

      // Validate theme
      if (!this.config.theme) {
        this.log('warning', 'Missing theme configuration');
      } else {
        const requiredThemeFields = ['primary', 'secondary', 'accent'];
        for (const field of requiredThemeFields) {
          if (!this.config.theme[field]) {
            this.log('warning', `Missing theme color: ${field}`);
          }
        }
      }

      // Validate dimensions
      if (!this.config.dimensions) {
        this.log('warning', 'Missing dimensions configuration');
      } else {
        if (this.config.dimensions.width !== 320) {
          this.log('warning', 'Card width should be 320px for consistency');
        }
        if (this.config.dimensions.height !== 200) {
          this.log('warning', 'Card height should be 200px for consistency');
        }
      }

      this.log('success', 'Config validation completed');
      return true;

    } catch (error) {
      this.log('error', `Invalid JSON in config.json: ${error.message}`);
      return false;
    }
  }

  validatePackageJson() {
    console.log('\n📦 Validating package.json...');
    
    if (!this.validateFileExists('package.json')) {
      return false;
    }

    try {
      const packagePath = path.join(this.cardDir, 'package.json');
      const packageContent = fs.readFileSync(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      // Check swipeosCard configuration
      if (!packageJson.swipeosCard) {
        this.log('error', 'Missing swipeosCard configuration in package.json');
      } else {
        const requiredFields = ['configFile', 'entryPoint', 'popupsEntry', 'functionsEntry'];
        for (const field of requiredFields) {
          if (!packageJson.swipeosCard[field]) {
            this.log('error', `Missing swipeosCard.${field} in package.json`);
          }
        }
      }

      this.log('success', 'Package.json validation completed');
      return true;

    } catch (error) {
      this.log('error', `Invalid JSON in package.json: ${error.message}`);
      return false;
    }
  }

  validateStructure() {
    console.log('\n📁 Validating folder structure...');
    
    // Required directories
    this.validateDirectoryExists('components');
    this.validateDirectoryExists('functions');
    this.validateDirectoryExists('popups');
    
    // Optional directories
    this.validateDirectoryExists('assets', false);
    this.validateDirectoryExists('hooks', false);
    this.validateDirectoryExists('utils', false);
    this.validateDirectoryExists('tests', false);

    // Required files in components
    this.validateFileExists('components/index.tsx');
    this.validateFileExists('components/types.ts');
    this.validateFileExists('components/CardFront.tsx');
    
    // Optional component files
    this.validateFileExists('components/CardBack.tsx', false);

    // Required files in functions
    this.validateFileExists('functions/index.ts');
    this.validateFileExists('functions/upSwipe.ts');
    this.validateFileExists('functions/downSwipe.ts');
    this.validateFileExists('functions/leftSwipe.ts');
    this.validateFileExists('functions/rightSwipe.ts');

    // Required files in popups
    this.validateFileExists('popups/index.tsx');
    this.validateFileExists('popups/UpPopup.tsx');
    this.validateFileExists('popups/DownPopup.tsx');
    this.validateFileExists('popups/LeftPopup.tsx');
    this.validateFileExists('popups/RightPopup.tsx');
  }

  validateComponents() {
    console.log('\n⚛️  Validating React components...');
    
    const componentFiles = [
      'components/index.tsx',
      'components/CardFront.tsx',
      'components/CardBack.tsx',
      'popups/UpPopup.tsx',
      'popups/DownPopup.tsx',
      'popups/LeftPopup.tsx',
      'popups/RightPopup.tsx'
    ];

    for (const file of componentFiles) {
      const filePath = path.join(this.cardDir, file);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Basic React component validation
          if (!content.includes('import React') && !content.includes('from \'react\'')) {
            this.log('warning', `${file} might be missing React import`);
          }
          
          if (!content.includes('export default')) {
            this.log('error', `${file} missing default export`);
          }

          // Check for TypeScript
          if (!content.includes(': React.FC') && !content.includes(': FC')) {
            this.log('warning', `${file} might be missing TypeScript typing`);
          }

        } catch (error) {
          this.log('error', `Error reading ${file}: ${error.message}`);
        }
      }
    }
  }

  validateFunctions() {
    console.log('\n🔧 Validating swipe functions...');
    
    const functionFiles = [
      'functions/upSwipe.ts',
      'functions/downSwipe.ts',
      'functions/leftSwipe.ts',
      'functions/rightSwipe.ts'
    ];

    for (const file of functionFiles) {
      const filePath = path.join(this.cardDir, file);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Check for async function
          if (!content.includes('async') || !content.includes('Promise')) {
            this.log('warning', `${file} should be an async function returning a Promise`);
          }
          
          // Check for export
          if (!content.includes('export')) {
            this.log('error', `${file} missing export`);
          }

          // Check for proper typing
          if (!content.includes('SwipeFunctionProps')) {
            this.log('warning', `${file} should use SwipeFunctionProps type`);
          }

        } catch (error) {
          this.log('error', `Error reading ${file}: ${error.message}`);
        }
      }
    }
  }

  validate() {
    console.log(`🔍 Validating card: ${path.basename(this.cardDir)}\n`);
    
    // Check if directory exists
    if (!fs.existsSync(this.cardDir)) {
      console.log(`❌ Card directory not found: ${this.cardDir}`);
      return false;
    }

    // Run all validations
    this.validateConfig();
    this.validatePackageJson();
    this.validateStructure();
    this.validateComponents();
    this.validateFunctions();

    // Summary
    console.log('\n📊 Validation Summary:');
    console.log(`✅ Passed: ${this.errors.length === 0 ? 'Yes' : 'No'}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);

    if (this.errors.length === 0) {
      console.log('\n🎉 Card validation passed! Ready for packaging.');
    } else {
      console.log('\n🔧 Please fix the errors before packaging your card.');
    }

    return this.errors.length === 0;
  }
}

// Main execution
const cardDir = process.argv[2] || process.cwd();
const validator = new CardValidator(cardDir);
const isValid = validator.validate();

process.exit(isValid ? 0 : 1); 