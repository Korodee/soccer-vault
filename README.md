# Soccer Vault - Premium Soccer Jersey E-commerce

A modern, full-stack e-commerce website for soccer jerseys built with Next.js 14, TypeScript, TailwindCSS, and Stripe integration.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with TailwindCSS
- **Product Catalog**: Browse jerseys by category, brand, size, and price
- **Product Details**: Image gallery, size selection, and detailed product information
- **Shopping Cart**: Add, remove, and update quantities with persistent storage
- **Secure Checkout**: Stripe integration for secure payment processing
- **Responsive Design**: Mobile-first approach with desktop optimization
- **TypeScript**: Full type safety throughout the application
- **Performance**: Optimized with Next.js 14 App Router

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Payment**: Stripe
- **State Management**: React Context API
- **Utilities**: clsx, tailwind-merge

## 📁 Project Structure

```
soccer-vault/
├── src/
│   ├── app/
│   │   ├── api/checkout/route.ts          # Stripe checkout API
│   │   ├── cart/page.tsx                  # Shopping cart page
│   │   ├── checkout/
│   │   │   ├── page.tsx                   # Checkout form
│   │   │   └── success/page.tsx           # Success page
│   │   ├── products/
│   │   │   ├── page.tsx                   # Products listing
│   │   │   └── [id]/page.tsx              # Product detail
│   │   ├── globals.css                    # Global styles
│   │   ├── layout.tsx                     # Root layout
│   │   └── page.tsx                       # Home page
│   ├── components/
│   │   ├── Header.tsx                     # Navigation header
│   │   ├── ProductCard.tsx                # Product card component
│   │   ├── ProductFilters.tsx             # Filter sidebar
│   │   └── ImageGallery.tsx               # Product image gallery
│   ├── contexts/
│   │   └── CartContext.tsx                # Shopping cart context
│   ├── data/
│   │   └── products.ts                    # Product data
│   ├── lib/
│   │   └── utils.ts                       # Utility functions
│   └── types/
│       └── index.ts                       # TypeScript types
├── scripts/
│   ├── scrape-yupoo-enhanced.js           # Yupoo scraper
│   ├── merge-product-data.js              # Data merger
│   ├── setup-yupoo-scraping.js            # Setup script
│   └── test-scraper.js                    # Test script
├── public/
│   └── images/                            # Product images
├── env.example                            # Environment variables template
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd soccer-vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your Stripe keys:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server |
| `build` | `npm run build` | Build for production |
| `start` | `npm run start` | Start production server |
| `lint` | `npm run lint` | Run ESLint |
| `scrape:test` | `npm run scrape:test` | Test Yupoo scraper |
| `scrape:setup` | `npm run scrape:setup` | Complete scraping setup |
| `scrape:yupoo` | `npm run scrape:yupoo` | Run Yupoo scraper |
| `scrape:merge` | `npm run scrape:merge` | Merge scraped data |
| `scrape:all` | `npm run scrape:all` | Scrape + merge |

## 📊 Product Data Management

### Using Sample Data
The project includes sample product data in `src/data/products.ts` for immediate testing.

### Scraping Real Data (Optional)
To use real product images from Yupoo:

1. **Test the scraper**
   ```bash
   npm run scrape:test
   ```

2. **Run the scraper**
   ```bash
   npm run scrape:yupoo
   ```

3. **Edit the scraped data**
   - Edit `data/yupoo-products.json`
   - Add prices, sizes, descriptions

4. **Merge the data**
   ```bash
   npm run scrape:merge
   ```

## 🔧 Configuration

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add them to your `.env.local` file
4. For testing, use Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`

### Product Data

Edit `src/data/products.ts` to add your products:

```typescript
export const products: Product[] = [
  {
    id: '1',
    title: 'Product Name',
    price: 89.99,
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Category',
    images: ['/images/product-1.jpg'],
    description: 'Product description',
    inStock: true,
    brand: 'Brand Name',
  },
  // ... more products
];
```

## 📱 Pages & Features

### Home Page (`/`)
- Hero section with call-to-action
- Featured products grid
- Category navigation
- Trust indicators

### Products Page (`/products`)
- Product grid with filters
- Search functionality
- Category, brand, size, and price filters
- Grid/list view toggle

### Product Detail (`/products/[id]`)
- Image gallery with thumbnails
- Size selection
- Quantity picker
- Add to cart functionality
- Product information and reviews

### Shopping Cart (`/cart`)
- Cart item list
- Quantity adjustment
- Remove items
- Order summary
- Proceed to checkout

### Checkout (`/checkout`)
- Customer information form
- Shipping address
- Order summary
- Stripe payment integration

### Success Page (`/checkout/success`)
- Order confirmation
- Next steps information
- Continue shopping links

## 🎨 Styling

The project uses TailwindCSS for styling with a custom design system:

- **Colors**: Blue primary (#2563eb), gray scale
- **Typography**: Inter font family
- **Components**: Card-based layout with shadows and rounded corners
- **Responsive**: Mobile-first with breakpoints for tablet and desktop

## 🔒 Security

- Stripe handles all payment processing
- No sensitive data stored locally
- Environment variables for API keys
- Input validation on forms

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@soccervault.com or create an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and TailwindCSS
