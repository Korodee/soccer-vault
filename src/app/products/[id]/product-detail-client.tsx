'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import ImageGallery from '@/components/ImageGallery';
import { useCart } from '@/contexts/CartContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { 
  Minus, 
  Plus, 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  RefreshCw, 
  Heart,
  Share2,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setIsAddingToCart(true);
    addItem(product, selectedSize, quantity);
    
    // Show success message and stay on page
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1500);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/products"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Products</span>
            </Link>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-2 rounded-full transition-colors ${
                  isWishlisted 
                    ? 'text-red-500 bg-red-50' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <ImageGallery images={product.images} title={product.title} />
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Badges */}
            <div className="flex gap-3">
              {product.isNew && (
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-4 py-2 rounded-full font-bold shadow-lg">
                  NEW ARRIVAL
                </span>
              )}
              {product.isOnSale && product.originalPrice && (
                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-4 py-2 rounded-full font-bold shadow-lg">
                  -{calculateDiscount(product.originalPrice, product.price)}% OFF
                </span>
              )}
              {!product.inStock && (
                <span className="bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs px-4 py-2 rounded-full font-bold shadow-lg">
                  OUT OF STOCK
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-3">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span className="bg-gray-100 px-2 py-1 rounded-full font-medium">
                  {product.brand}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded-full font-medium">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">4.8/5</span>
              <span className="text-sm text-gray-500">(127 reviews)</span>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-xs text-green-600 font-medium mt-2">
                  Save {formatPrice(product.originalPrice - product.price)} on this item
                </p>
              )}
            </div>

            {/* Description */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Details */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-gray-900 mb-3">Product Details</h3>
              <div className="grid grid-cols-1 gap-3">
                {product.season && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Season</span>
                    <span className="text-gray-600">{product.season}</span>
                  </div>
                )}
                {product.material && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Material</span>
                    <span className="text-gray-600">{product.material}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">Availability</span>
                  <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Size and Quantity Row */}
            <div className="grid grid-cols-10 gap-4">
              {/* Size Selection */}
              <div className="col-span-7 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-base font-bold text-gray-900 mb-3">Select Size</h3>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-2 border-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                        selectedSize === size
                          ? 'border-gray-800 bg-gray-800 text-white shadow-lg'
                          : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="col-span-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-base font-bold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                    <button
                      onClick={decreaseQuantity}
                      className="p-2 hover:bg-white rounded-xl transition-all duration-300 text-gray-700 hover:text-gray-900"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-base font-bold min-w-[3rem] text-center bg-white rounded-xl shadow-sm text-gray-900 border border-gray-200">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="p-2 hover:bg-white rounded-xl transition-all duration-300 text-gray-700 hover:text-gray-900"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAddingToCart}
              className={`
                w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl
                ${product.inStock && !isAddingToCart
                  ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <ShoppingCart className="h-5 w-5" />
              {isAddingToCart ? 'Added to Cart!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
