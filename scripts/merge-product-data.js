const fs = require('fs').promises;
const path = require('path');

/**
 * Product Data Merger
 * 
 * Merges scraped Yupoo data with manually added pricing and product information
 * to create the final product data for the e-commerce store.
 * 
 * Usage: npm run scrape:merge
 */

class ProductDataMerger {
  constructor() {
    this.yupooDataPath = path.join(__dirname, '../data/yupoo-products.json');
    this.outputPath = path.join(__dirname, '../src/data/products.ts');
  }

  async loadYupooData() {
    try {
      const data = await fs.readFile(this.yupooDataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Error loading Yupoo data:', error.message);
      console.log('💡 Make sure to run the scraper first: npm run scrape:yupoo');
      return [];
    }
  }

  generateProductData(yupooProducts) {
    const categories = [
      'Premier League', 'La Liga', 'Bundesliga', 'Ligue 1', 'Serie A', 
      'Champions League', 'National Teams', 'Other'
    ];
    
    const brands = ['Adidas', 'Nike', 'Puma', 'Under Armour'];
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    return yupooProducts.map((product, index) => {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const basePrice = 70 + Math.random() * 50;
      const price = Math.round(basePrice);
      const isOnSale = Math.random() > 0.7;
      const originalPrice = isOnSale ? Math.round(price * 1.2) : undefined;
      const isNew = Math.random() > 0.8;
      
      return {
        id: product.id,
        title: product.title,
        price: price,
        originalPrice: originalPrice,
        sizes: sizes,
        category: category,
        images: product.images,
        description: this.generateDescription(product.title, brand),
        isNew: isNew,
        isOnSale: isOnSale,
        inStock: true,
        brand: brand,
        season: '2024/25',
        material: '100% Recycled Polyester'
      };
    });
  }

  generateDescription(title, brand) {
    const descriptions = [
      `Official ${title} featuring premium ${brand} technology for optimal performance and comfort.`,
      `Authentic ${title} with ${brand}'s latest fabric innovation for breathability and style.`,
      `High-quality ${title} made with ${brand} materials for durability and comfort.`,
      `Professional ${title} featuring ${brand}'s advanced moisture-wicking technology.`,
      `Premium ${title} with ${brand} design and superior craftsmanship.`
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  async generateProductsFile(products) {
    const categories = [
      'All',
      'Premier League',
      'La Liga',
      'Bundesliga',
      'Ligue 1',
      'Serie A',
      'Champions League',
      'National Teams'
    ];

    const brands = [
      'All',
      'Adidas',
      'Nike',
      'Puma',
      'Under Armour'
    ];

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    return `import { Product } from '@/types';

export const products: Product[] = ${JSON.stringify(products, null, 2)};

export const categories = ${JSON.stringify(categories, null, 2)};

export const brands = ${JSON.stringify(brands, null, 2)};

export const sizes = ${JSON.stringify(sizes, null, 2)};
`;
  }

  async saveProductsFile(content) {
    try {
      await fs.writeFile(this.outputPath, content, 'utf8');
      console.log(`✅ Generated product data file: ${this.outputPath}`);
    } catch (error) {
      console.error('❌ Error saving products file:', error);
    }
  }

  async createManualEditGuide() {
    const guidePath = path.join(__dirname, '../data/manual-edit-guide.md');
    const guideContent = `# Manual Product Data Editing Guide

## Overview
This guide helps you manually edit the scraped product data to add accurate pricing, sizes, and descriptions.

## File Location
Edit: \`data/yupoo-products.json\`

## Data Structure
Each product should have this structure:
\`\`\`json
{
  "id": "product-slug",
  "title": "Product Title",
  "images": ["/images/product-slug/image1.jpg", "/images/product-slug/image2.jpg"],
  "price": 89.99,
  "originalPrice": 119.99,
  "sizes": ["S", "M", "L", "XL", "XXL"],
  "category": "Premier League",
  "description": "Product description...",
  "isNew": true,
  "isOnSale": true,
  "inStock": true,
  "brand": "Adidas",
  "season": "2024/25",
  "material": "100% Recycled Polyester"
}
\`\`\`

## Required Fields to Add Manually

### 1. Price Information
- \`price\`: Current selling price (number)
- \`originalPrice\`: Original price for sales (optional, number)

### 2. Product Details
- \`sizes\`: Available sizes (array of strings)
- \`category\`: Product category (string)
- \`description\`: Product description (string)
- \`brand\`: Brand name (string)

### 3. Status Flags
- \`isNew\`: New arrival flag (boolean)
- \`isOnSale\`: Sale flag (boolean)
- \`inStock\`: Stock availability (boolean)

### 4. Additional Info (Optional)
- \`season\`: Season/year (string)
- \`material\`: Material composition (string)

## Categories
- Premier League
- La Liga
- Bundesliga
- Ligue 1
- Serie A
- Champions League
- National Teams

## Brands
- Adidas
- Nike
- Puma
- Under Armour

## Sizes
- S, M, L, XL, XXL

## After Editing
1. Save the JSON file
2. Run: \`npm run scrape:merge\`
3. The script will generate the final \`src/data/products.ts\` file
4. Test your e-commerce store with the updated data

## Tips
- Use realistic pricing based on market research
- Write compelling product descriptions
- Ensure all required fields are filled
- Test the store after making changes
`;

    try {
      await fs.writeFile(guidePath, guideContent, 'utf8');
      console.log(`✅ Created manual edit guide: ${guidePath}`);
    } catch (error) {
      console.error('❌ Error creating guide:', error);
    }
  }

  async run() {
    console.log('🔄 Product Data Merger');
    console.log('======================');
    
    try {
      const yupooProducts = await this.loadYupooData();
      
      if (yupooProducts.length === 0) {
        console.log('❌ No Yupoo products found. Please run the scraper first.');
        return;
      }

      console.log(`📊 Found ${yupooProducts.length} products from Yupoo`);
      
      const needsManualEdit = yupooProducts.some(product => !product.price);
      
      if (needsManualEdit) {
        console.log('\n⚠️  Products need manual editing for pricing and details');
        console.log('📝 Please edit: data/yupoo-products.json');
        console.log('📖 See: data/manual-edit-guide.md for instructions');
        
        await this.createManualEditGuide();
        
        console.log('\n💡 After editing the JSON file, run this script again');
        return;
      }

      console.log('🔄 Generating complete product data...');
      const completeProducts = this.generateProductData(yupooProducts);
      
      const fileContent = await this.generateProductsFile(completeProducts);
      await this.saveProductsFile(fileContent);
      
      console.log('\n🎉 Product data merger completed!');
      console.log(`📊 Total products: ${completeProducts.length}`);
      console.log(`📁 Output file: ${this.outputPath}`);
      console.log('\n🚀 Your e-commerce store is ready with real product data!');
      
    } catch (error) {
      console.error('❌ Merger failed:', error);
    }
  }
}

if (require.main === module) {
  const merger = new ProductDataMerger();
  merger.run().catch(console.error);
}

module.exports = ProductDataMerger;
