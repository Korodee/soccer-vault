const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const { URL } = require('url');

/**
 * Enhanced Yupoo Jersey Factory Scraper
 * 
 * Safely scrapes album titles and images from https://jersey-factory.x.yupoo.com/
 * Downloads images to structured folders and generates JSON for e-commerce store.
 * 
 * Usage: npm run scrape:yupoo
 * 
 * Safety features:
 * - Respectful delays between requests
 * - Request limits and timeouts
 * - Error handling and retries
 * - Progress logging
 */

class YupooScraper {
  constructor() {
    this.baseUrl = 'https://jersey-factory.x.yupoo.com/';
    this.outputDir = path.join(__dirname, '../public/images');
    this.jsonOutputPath = path.join(__dirname, '../data/yupoo-products.json');
    this.products = [];
    this.delay = 3000; // 3 seconds between requests
    this.maxAlbums = 20; // Safety limit
    this.maxImagesPerAlbum = 5; // Limit images per album
  }

  async init() {
    console.log('🚀 Initializing Yupoo scraper...');
    
    await this.createDirectories();
    
    this.browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    this.context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 }
    });

    this.page = await this.context.newPage();
    
    // Block unnecessary resources
    await this.page.route('**/*.{png,jpg,jpeg,gif,svg,woff,woff2,ttf,eot}', route => {
      if (route.request().url().includes('yupoo.com')) {
        route.continue();
      } else {
        route.abort();
      }
    });
  }

  async createDirectories() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.mkdir(path.dirname(this.jsonOutputPath), { recursive: true });
      console.log('✅ Created output directories');
    } catch (error) {
      console.error('❌ Error creating directories:', error);
    }
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async safeNavigate(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.page.goto(url, { 
          waitUntil: 'domcontentloaded', 
          timeout: 30000 
        });
        await this.page.waitForTimeout(2000);
        return true;
      } catch (error) {
        console.log(`⚠️ Navigation attempt ${i + 1} failed:`, error.message);
        if (i === maxRetries - 1) throw error;
        await this.wait(5000);
      }
    }
  }

  async extractAlbumLinks() {
    console.log('📂 Extracting album links...');
    
    try {
      await this.safeNavigate(this.baseUrl);
      
      const albumLinks = await this.page.evaluate(() => {
        const links = [];
        const selectors = [
          'a[href*="/albums/"]',
          '.album-item a',
          '.photo-item a',
          '.album a',
          'a[href*="yupoo.com/albums"]',
          '.item a',
          'a[title]'
        ];
        
        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            const href = el.getAttribute('href');
            const title = el.getAttribute('title') || el.textContent?.trim();
            
            if (href && title && href.includes('/albums/')) {
              links.push({
                href: href.startsWith('http') ? href : `https://jersey-factory.x.yupoo.com${href}`,
                title: title
              });
            }
          });
        });
        
        return links.filter((link, index, self) => 
          index === self.findIndex(l => l.href === link.href)
        );
      });

      console.log(`✅ Total unique album links found: ${albumLinks.length}`);
      return albumLinks;
      
    } catch (error) {
      console.error('❌ Error extracting album links:', error);
      return [];
    }
  }

  async extractAlbumImages(albumUrl, albumTitle) {
    console.log(`📸 Extracting images from: ${albumTitle}`);
    
    try {
      await this.safeNavigate(albumUrl);
      await this.wait(this.delay);
      
      const imageUrls = await this.page.evaluate(() => {
        const images = [];
        const selectors = [
          'img[src*="photo.yupoo.com"]',
          'img[data-src*="photo.yupoo.com"]',
          'img[src*="jersey-factory"]',
          'img[data-src*="jersey-factory"]'
        ];
        
        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(img => {
            const src = img.getAttribute('src') || img.getAttribute('data-src');
            if (src && 
                src.includes('photo.yupoo.com') && 
                src.includes('jersey-factory') &&
                !src.includes('logo') &&
                !src.includes('icon') &&
                !src.includes('website') &&
                !images.includes(src)) {
              images.push(src);
            }
          });
        });
        
        return images;
      });
      
      console.log(`✅ Found ${imageUrls.length} images in album`);
      
      if (imageUrls.length === 0) {
        console.log(`⚠️ No images found for album: ${albumTitle}`);
        return [];
      }

      console.log(`✅ Found ${imageUrls.length} images for: ${albumTitle}`);
      return imageUrls;
      
    } catch (error) {
      console.error(`❌ Error extracting images from ${albumTitle}:`, error);
      return [];
    }
  }

  async downloadImage(imageUrl, productId, imageIndex) {
    try {
      // Fix relative URLs
      if (imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl;
      } else if (imageUrl.startsWith('/')) {
        imageUrl = 'https://jersey-factory.x.yupoo.com' + imageUrl;
      }
      
      const extension = this.getImageExtension(imageUrl);
      const filename = `image${imageIndex + 1}${extension}`;
      const productDir = path.join(this.outputDir, productId);
      const filePath = path.join(productDir, filename);
      
      await fs.mkdir(productDir, { recursive: true });
      
      // Try browser-based download first (more reliable)
      try {
        await this.downloadWithBrowser(imageUrl, filePath);
        return filename;
      } catch (browserError) {
        console.log(`⚠️ Browser download failed, trying direct download: ${browserError.message}`);
        // Fallback to direct download
        await this.downloadFile(imageUrl, filePath);
        return filename;
      }
    } catch (error) {
      console.error(`❌ Error downloading image ${imageUrl}:`, error);
      return null;
    }
  }

  async downloadWithBrowser(imageUrl, filePath) {
    // Create a new page for downloading
    const downloadPage = await this.context.newPage();
    
    try {
      // Set up proper headers
      await downloadPage.setExtraHTTPHeaders({
        'Referer': 'https://jersey-factory.x.yupoo.com/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      });
      
      // Navigate to the image URL
      await downloadPage.goto(imageUrl, { 
        waitUntil: 'domcontentloaded', 
        timeout: 30000 
      });
      
      // Wait for the image to load
      await downloadPage.waitForTimeout(2000);
      
      // Get the image as buffer
      const imageBuffer = await downloadPage.screenshot({
        type: 'png',
        fullPage: false,
        clip: { x: 0, y: 0, width: 800, height: 600 }
      });
      
      // Save the buffer to file
      await fs.writeFile(filePath, imageBuffer);
      
    } finally {
      await downloadPage.close();
    }
  }

  async downloadFile(url, filePath) {
    return new Promise((resolve, reject) => {
      const file = require('fs').createWriteStream(filePath);
      
      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://jersey-factory.x.yupoo.com/',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'image',
          'Sec-Fetch-Mode': 'no-cors',
          'Sec-Fetch-Site': 'cross-site',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      };
      
      const request = https.get(url, options, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve();
        });
        
        file.on('error', (err) => {
          require('fs').unlink(filePath, () => {});
          reject(err);
        });
      });
      
      request.setTimeout(30000, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
      
      request.on('error', reject);
    });
  }

  getImageExtension(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const extension = path.extname(pathname);
      return extension || '.jpg';
    } catch {
      return '.jpg';
    }
  }

  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async scrapeAlbums() {
    console.log('🎯 Starting album scraping...');
    
    try {
      const albumLinks = await this.extractAlbumLinks();
      
      if (albumLinks.length === 0) {
        console.log('❌ No album links found. The site structure might have changed.');
        return;
      }

      const albumsToProcess = albumLinks.slice(0, this.maxAlbums);
      console.log(`📊 Processing ${albumsToProcess.length} albums (limited for safety)`);
      
      for (let i = 0; i < albumsToProcess.length; i++) {
        const album = albumsToProcess[i];
        console.log(`\n📁 Processing album ${i + 1}/${albumsToProcess.length}: ${album.title}`);
        
        const imageUrls = await this.extractAlbumImages(album.href, album.title);
        
        if (imageUrls.length > 0) {
          const productId = this.slugify(album.title);
          const downloadedImages = [];
          
          const imagesToDownload = imageUrls.slice(0, this.maxImagesPerAlbum);
          for (let j = 0; j < imagesToDownload.length; j++) {
            console.log(`  📥 Downloading image ${j + 1}/${imagesToDownload.length}`);
            const filename = await this.downloadImage(imagesToDownload[j], productId, j);
            if (filename) {
              downloadedImages.push(filename);
            }
            await this.wait(1000);
          }
          
          this.products.push({
            id: productId,
            title: album.title,
            images: downloadedImages.map(img => `/images/${productId}/${img}`)
          });
          
          console.log(`✅ Completed album: ${album.title} (${downloadedImages.length} images)`);
        }
        
        if (i < albumsToProcess.length - 1) {
          console.log(`⏳ Waiting ${this.delay/1000} seconds before next album...`);
          await this.wait(this.delay);
        }
      }
      
    } catch (error) {
      console.error('❌ Error during scraping:', error);
    }
  }

  async saveJsonFile() {
    try {
      const jsonData = JSON.stringify(this.products, null, 2);
      await fs.writeFile(this.jsonOutputPath, jsonData, 'utf8');
      console.log(`✅ Saved ${this.products.length} products to: ${this.jsonOutputPath}`);
    } catch (error) {
      console.error('❌ Error saving JSON file:', error);
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log('🧹 Cleanup completed');
  }

  async run() {
    console.log('🎯 Enhanced Yupoo Jersey Factory Scraper');
    console.log('==========================================');
    console.log('⚠️  This scraper is for educational purposes only');
    console.log('⚠️  Please respect the website\'s terms of service');
    console.log('⚠️  Use with appropriate delays to avoid overwhelming the server');
    console.log('');
    
    try {
      await this.init();
      await this.scrapeAlbums();
      await this.saveJsonFile();
      
      console.log('\n🎉 Scraping completed successfully!');
      console.log(`📊 Total products processed: ${this.products.length}`);
      console.log(`📁 Images saved to: ${this.outputDir}`);
      console.log(`📄 JSON data saved to: ${this.jsonOutputPath}`);
      console.log('\n📝 Next steps:');
      console.log('1. Review the generated JSON file');
      console.log('2. Add prices, sizes, and descriptions manually');
      console.log('3. Run: npm run scrape:merge');
      console.log('4. Test the e-commerce store with real product images');
      
    } catch (error) {
      console.error('❌ Scraping failed:', error);
    } finally {
      await this.cleanup();
    }
  }
}

if (require.main === module) {
  const scraper = new YupooScraper();
  scraper.run().catch(console.error);
}

module.exports = YupooScraper;
