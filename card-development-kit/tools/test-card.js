#!/usr/bin/env node

/**
 * SwipeOS Card Test Runner
 * 
 * This script runs tests on a card to ensure it works properly.
 * Usage: node test-card.js [card-directory] [options]
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class CardTester {
  constructor(cardDir) {
    this.cardDir = cardDir;
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  async runTests() {
    console.log('🧪 SwipeOS Card Test Runner\n');
    console.log(`📁 Testing card: ${path.basename(this.cardDir)}\n`);

    // Run all test suites
    await this.testStructure();
    await this.testConfiguration();
    await this.testComponents();
    await this.testFunctions();
    await this.testPopups();
    await this.testBuild();

    // Show results
    this.showResults();
  }

  async testStructure() {
    console.log('📂 Testing file structure...');
    
    const requiredDirs = ['components', 'functions', 'popups'];
    const requiredFiles = [
      'config.json',
      'package.json',
      'components/index.tsx',
      'components/types.ts',
      'functions/index.ts',
      'popups/index.tsx'
    ];

    for (const dir of requiredDirs) {
      this.addTest(
        `Directory exists: ${dir}`,
        fs.existsSync(path.join(this.cardDir, dir)) && 
        fs.statSync(path.join(this.cardDir, dir)).isDirectory()
      );
    }

    for (const file of requiredFiles) {
      this.addTest(
        `File exists: ${file}`,
        fs.existsSync(path.join(this.cardDir, file))
      );
    }
  }

  async testConfiguration() {
    console.log('\n⚙️  Testing configuration...');
    
    try {
      const configPath = path.join(this.cardDir, 'config.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

      // Test required fields
      const requiredFields = ['id', 'name', 'version', 'description', 'author', 'category'];
      for (const field of requiredFields) {
        this.addTest(`Config has ${field}`, !!config[field]);
      }

      // Test swipe actions
      this.addTest('Config has swipeActions', !!config.swipeActions);
      if (config.swipeActions) {
        const directions = ['up', 'down', 'left', 'right'];
        for (const dir of directions) {
          this.addTest(
            `SwipeAction ${dir} is valid`,
            config.swipeActions[dir] &&
            config.swipeActions[dir].label &&
            config.swipeActions[dir].icon &&
            config.swipeActions[dir].description
          );
        }
      }

      // Test theme
      this.addTest('Config has theme', !!config.theme);
      if (config.theme) {
        const themeFields = ['primary', 'secondary', 'accent'];
        for (const field of themeFields) {
          this.addTest(
            `Theme has ${field} color`,
            !!config.theme[field] && /^#[0-9A-F]{6}$/i.test(config.theme[field])
          );
        }
      }

      // Test dimensions
      this.addTest(
        'Card dimensions are standard',
        config.dimensions &&
        config.dimensions.width === 320 &&
        config.dimensions.height === 200
      );

    } catch (error) {
      this.addTest('Config is valid JSON', false);
    }
  }

  async testComponents() {
    console.log('\n🎨 Testing components...');
    
    const componentFiles = [
      'components/index.tsx',
      'components/CardFront.tsx',
      'components/types.ts'
    ];

    for (const file of componentFiles) {
      const filePath = path.join(this.cardDir, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Basic checks
        this.addTest(
          `${file} has React import`,
          file.endsWith('.ts') || content.includes('import React') || content.includes("from 'react'")
        );

        if (file.endsWith('.tsx')) {
          this.addTest(
            `${file} has default export`,
            content.includes('export default')
          );

          this.addTest(
            `${file} uses TypeScript`,
            content.includes(': React.FC') || content.includes(': FC')
          );
        }
      }
    }
  }

  async testFunctions() {
    console.log('\n⚡ Testing swipe functions...');
    
    const functionFiles = [
      'functions/upSwipe.ts',
      'functions/downSwipe.ts',
      'functions/leftSwipe.ts',
      'functions/rightSwipe.ts'
    ];

    for (const file of functionFiles) {
      const filePath = path.join(this.cardDir, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        this.addTest(
          `${file} is async function`,
          content.includes('async') && content.includes('Promise')
        );

        this.addTest(
          `${file} has proper export`,
          content.includes('export const') || content.includes('export async')
        );

        this.addTest(
          `${file} uses SwipeFunctionProps`,
          content.includes('SwipeFunctionProps')
        );

        this.addTest(
          `${file} returns result object`,
          content.includes('return {') && 
          content.includes('success:') &&
          content.includes('action:')
        );
      }
    }
  }

  async testPopups() {
    console.log('\n🖼️  Testing popup components...');
    
    const popupFiles = [
      'popups/UpPopup.tsx',
      'popups/DownPopup.tsx',
      'popups/LeftPopup.tsx',
      'popups/RightPopup.tsx'
    ];

    for (const file of popupFiles) {
      const filePath = path.join(this.cardDir, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        this.addTest(
          `${file} uses PopupProps`,
          content.includes('PopupProps')
        );

        this.addTest(
          `${file} has onClose handler`,
          content.includes('onClose')
        );

        this.addTest(
          `${file} supports dark mode`,
          content.includes('isDark')
        );
      }
    }
  }

  async testBuild() {
    console.log('\n🔨 Testing build process...');
    
    // Check if TypeScript is available
    const hasTypeScript = fs.existsSync(path.join(this.cardDir, 'node_modules/typescript'));
    
    if (hasTypeScript) {
      try {
        await this.runCommand('npm', ['run', 'build']);
        this.addTest('Build completes successfully', true);
      } catch (error) {
        this.addTest('Build completes successfully', false);
      }
    } else {
      console.log('   ⚠️  Skipping build test (TypeScript not installed)');
    }

    // Test package.json scripts
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(this.cardDir, 'package.json'), 'utf8'));
      this.addTest('Has build script', !!pkg.scripts && !!pkg.scripts.build);
      this.addTest('Has validate script', !!pkg.scripts && !!pkg.scripts.validate);
    } catch (error) {
      this.addTest('Package.json is valid', false);
    }
  }

  runCommand(command, args) {
    return new Promise((resolve, reject) => {
      const proc = spawn(command, args, {
        cwd: this.cardDir,
        stdio: 'pipe'
      });

      let output = '';
      proc.stdout.on('data', (data) => output += data);
      proc.stderr.on('data', (data) => output += data);

      proc.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Command failed with code ${code}: ${output}`));
        }
      });
    });
  }

  addTest(name, passed) {
    this.tests.push({ name, passed });
    if (passed) {
      this.passed++;
      console.log(`   ✅ ${name}`);
    } else {
      this.failed++;
      console.log(`   ❌ ${name}`);
    }
  }

  showResults() {
    console.log('\n' + '─'.repeat(50));
    console.log('\n📊 Test Results:\n');
    
    const total = this.passed + this.failed;
    const percentage = total > 0 ? Math.round((this.passed / total) * 100) : 0;
    
    console.log(`   Total Tests: ${total}`);
    console.log(`   ✅ Passed: ${this.passed}`);
    console.log(`   ❌ Failed: ${this.failed}`);
    console.log(`   📈 Success Rate: ${percentage}%`);
    
    if (this.failed === 0) {
      console.log('\n🎉 All tests passed! Your card is ready for packaging.');
    } else {
      console.log('\n⚠️  Some tests failed. Please fix the issues before packaging.');
      console.log('\nFailed tests:');
      this.tests.filter(t => !t.passed).forEach(t => {
        console.log(`   - ${t.name}`);
      });
    }
    
    console.log('\n' + '─'.repeat(50));
    
    // Exit with appropriate code
    process.exit(this.failed > 0 ? 1 : 0);
  }
}

// Main execution
async function main() {
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

  const tester = new CardTester(cardDir);
  await tester.runTests();
}

main().catch(console.error); 