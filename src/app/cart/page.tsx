"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import YupooImage from "@/components/YupooImage";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Shield,
  Truck,
  CreditCard,
  Lock,
} from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleQuantityChange = (
    id: string,
    size: string,
    newQuantity: number
  ) => {
    setIsUpdating(`${id}-${size}`);
    updateQuantity(id, size, newQuantity);
    setTimeout(() => setIsUpdating(null), 500);
  };

  const handleRemoveItem = (id: string, size: string) => {
    removeItem(id, size);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-base text-gray-600 mb-8 max-w-2xl mx-auto">
              Looks like you haven&apos;t added any items to your cart yet.
              Start shopping to discover amazing jerseys!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="h-5 w-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/products"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Continue Shopping</span>
              </Link>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-sm text-gray-600">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-gray-600" />
              Your Items ({items.length})
            </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="p-8 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                        <YupooImage
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              <Link
                                href={`/products/${item.product.id}`}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {item.product.title}
                              </Link>
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                Size: {item.size}
                              </span>
                              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium">
                                {item.product.brand}
                              </span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 bg-gray-50 px-3 py-2 rounded-xl inline-block">
                              {formatPrice(item.product.price)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.id, item.size)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                                                      <span className="text-sm font-semibold text-gray-900">
                              Quantity:
                            </span>
                            <div className="flex items-center bg-gray-200 rounded-xl p-1 shadow-inner">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.size,
                                  item.quantity - 1
                                )
                              }
                              disabled={
                                item.quantity <= 1 ||
                                isUpdating === `${item.id}-${item.size}`
                              }
                              className="p-2 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-gray-700 hover:text-gray-900"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-4 py-2 text-sm font-bold min-w-[3rem] text-center bg-white rounded-lg shadow-sm text-gray-900 border border-gray-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.size,
                                  item.quantity + 1
                                )
                              }
                              disabled={
                                isUpdating === `${item.id}-${item.size}`
                              }
                              className="p-2 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-gray-700 hover:text-gray-900"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart Button */}
              <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-semibold hover:bg-red-50 px-4 py-2 rounded-xl transition-all duration-300"
                >
                  Clear All Items
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-600" />
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-700 font-medium">
                    Subtotal ({items.length} items)
                  </span>
                  <span className="font-bold text-base text-gray-900">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <Truck className="h-4 w-4 text-green-600" />
                    Shipping
                  </span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-6 rounded-2xl font-bold hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center block mb-4"
              >
                Proceed to Checkout
              </Link>

              {/* Trust Indicators */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span>Secure checkout powered by Stripe</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>100% secure payment processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
