#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

/**
 * Yupoo Scraping Setup Script
 * 
 * Sets up the complete Yupoo scraping workflow:
 * 1. Checks dependencies
 * 2. Creates necessary directories
 * 3. Runs the scraper
 * 4. Provides next steps
 * 
 * Usage: npm run scrape:setup
 */

class YupooSetup {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.dataDir = path.join(this.projectRoot, 'data');
    this.imagesDir = path.join(this.projectRoot, 'public', 'images');
  }

  async checkDependencies() {
    console.log('🔍 Checking dependencies...');
    
    try {
      require.resolve('playwright');
      console.log('✅ Playwright is installed');
    } catch (error) {
      console.log('❌ Playwright not found. Installing...');
      try {
        execSync('npm install playwright', { stdio: 'inherit' });
        console.log('✅ Playwright installed successfully');
      } catch (installError) {
        console.error('❌ Failed to install Playwright:', installError.message);
        return false;
      }
    }

    return true;
  }

  async createDirectories() {
    console.log('📁 Creating necessary directories...');
    
    const directories = [
      this.dataDir,
      this.imagesDir,
      path.join(this.projectRoot, 'scripts')
    ];

    for (const dir of directories) {
      try {
        await fs.mkdir(dir, { recursive: true });
        console.log(`✅ Created: ${dir}`);
      } catch (error) {
        console.log(`⚠️ Directory already exists: ${dir}`);
      }
    }
  }

  async checkExistingData() {
    console.log('📊 Checking for existing data...');
    
    const yupooDataPath = path.join(this.dataDir, 'yupoo-products.json');
    
    try {
      await fs.access(yupooDataPath);
      const stats = await fs.stat(yupooDataPath);
      const data = JSON.parse(await fs.readFile(yupooDataPath, 'utf8'));
      
      console.log(`✅ Found existing data: ${data.length} products`);
      console.log(`📅 Last modified: ${stats.mtime.toLocaleString()}`);
      
      return true;
    } catch (error) {
      console.log('📝 No existing data found. Will create new data.');
      return false;
    }
  }

  async runScraper() {
    console.log('🚀 Starting Yupoo scraper...');
    console.log('⚠️  This may take several minutes. Please be patient.');
    console.log('⚠️  The scraper includes delays to be respectful to the server.');
    console.log('');
    
    try {
      const YupooScraper = require('./scrape-yupoo-enhanced');
      const scraper = new YupooScraper();
      await scraper.run();
      return true;
    } catch (error) {
      console.error('❌ Scraper failed:', error.message);
      return false;
    }
  }

  async showNextSteps() {
    console.log('\n📋 Next Steps:');
    console.log('==============');
    console.log('');
    console.log('1. 📝 Review the scraped data:');
    console.log(`   📄 File: ${path.join(this.dataDir, 'yupoo-products.json')}`);
    console.log('');
    console.log('2. ✏️  Add product information manually:');
    console.log('   - Prices');
    console.log('   - Sizes');
    console.log('   - Categories');
    console.log('   - Descriptions');
    console.log('   - Brand information');
    console.log('');
    console.log('3. 🔄 Merge the data:');
    console.log('   npm run scrape:merge');
    console.log('');
    console.log('4. 🚀 Test your e-commerce store:');
    console.log('   npm run dev');
    console.log('');
    console.log('📖 For detailed instructions, see:');
    console.log(`   📄 ${path.join(this.dataDir, 'manual-edit-guide.md')}`);
    console.log('');
    console.log('🎯 Your e-commerce store will be ready with real product images!');
  }

  async showSafetyNotice() {
    console.log('⚠️  IMPORTANT SAFETY NOTICE');
    console.log('==========================');
    console.log('');
    console.log('This scraper is designed to be respectful and safe:');
    console.log('');
    console.log('✅ Safety Features:');
    console.log('   - 3-second delays between requests');
    console.log('   - Limited to 20 albums maximum');
    console.log('   - User-agent spoofing');
    console.log('   - Error handling and retries');
    console.log('   - Progress logging');
    console.log('');
    console.log('⚠️  Please ensure:');
    console.log('   - You have permission to scrape the site');
    console.log('   - You respect the website\'s terms of service');
    console.log('   - You use the data responsibly');
    console.log('   - You don\'t overload the server');
    console.log('');
    console.log('📚 This is for educational purposes only.');
    console.log('');
  }

  async run() {
    console.log('🎯 Yupoo Scraping Setup');
    console.log('=======================');
    console.log('');
    
    await this.showSafetyNotice();
    
    console.log('Do you want to continue with the scraping setup? (y/N)');
    console.log('(This will take several minutes and download images)');
    console.log('Continuing with setup...\n');
    
    try {
      const depsOk = await this.checkDependencies();
      if (!depsOk) {
        console.log('❌ Setup failed due to dependency issues');
        return;
      }

      await this.createDirectories();

      const hasExistingData = await this.checkExistingData();
      
      if (hasExistingData) {
        console.log('\n💡 Found existing data. You can:');
        console.log('1. Skip scraping and go to manual editing');
        console.log('2. Re-run the scraper to get fresh data');
        console.log('');
        console.log('Continuing with existing data...\n');
      }

      const scraperSuccess = await this.runScraper();
      
      if (scraperSuccess) {
        console.log('\n🎉 Setup completed successfully!');
        await this.showNextSteps();
      } else {
        console.log('\n❌ Setup failed. Please check the error messages above.');
        console.log('💡 You can try running the scraper manually:');
        console.log('   npm run scrape:yupoo');
      }
      
    } catch (error) {
      console.error('❌ Setup failed:', error);
      console.log('\n💡 Manual steps:');
      console.log('1. npm install playwright');
      console.log('2. npm run scrape:yupoo');
      console.log('3. Edit data/yupoo-products.json');
      console.log('4. npm run scrape:merge');
    }
  }
}

if (require.main === module) {
  const setup = new YupooSetup();
  setup.run().catch(console.error);
}

module.exports = YupooSetup;
