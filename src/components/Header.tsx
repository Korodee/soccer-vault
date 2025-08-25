"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, Search, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

export default function Header() {
  const { getTotalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex justify-start">
            <Link href="/" className="flex items-center group">
              <div className="flex items-center space-x-3">
                {/* Custom Soccer Ball Logo */}
                <div className="relative">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    className="text-gray-800 group-hover:text-gray-900 transition-colors duration-300"
                    fill="currentColor"
                  >
                    {/* Main ball circle with shadow */}
                    <defs>
                      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.1)"/>
                      </filter>
                    </defs>
                    
                    {/* Soccer ball base */}
                    <circle cx="18" cy="18" r="16" fill="currentColor" filter="url(#shadow)" />
                    
                    {/* Soccer ball pattern - classic black and white hexagons */}
                    <path
                      d="M18 4 L22 8 L20 14 L16 16 L12 14 L14 8 Z"
                      fill="white"
                      opacity="0.95"
                    />
                    <path
                      d="M26 12 L30 16 L28 22 L24 20 L20 16 L22 12 Z"
                      fill="white"
                      opacity="0.95"
                    />
                    <path
                      d="M10 12 L14 16 L12 22 L8 20 L6 16 L8 12 Z"
                      fill="white"
                      opacity="0.95"
                    />
                    <path
                      d="M18 26 L22 30 L20 24 L16 22 L12 24 L14 30 Z"
                      fill="white"
                      opacity="0.95"
                    />
                    <path
                      d="M26 20 L30 24 L28 18 L24 16 L20 18 L22 24 Z"
                      fill="white"
                      opacity="0.95"
                    />
                    <path
                      d="M10 20 L14 24 L12 18 L8 16 L4 18 L6 24 Z"
                      fill="white"
                      opacity="0.95"
                    />
                    
                    {/* Center detail */}
                    <circle cx="18" cy="18" r="2.5" fill="white" opacity="0.9" />
                    
                    {/* Subtle stitching effect */}
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                  </svg>
                </div>
                
                {/* Text with enhanced styling */}
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent group-hover:from-gray-800 group-hover:via-gray-900 group-hover:to-black transition-all duration-300 tracking-wide">
                    Soccer Vault
                  </h1>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 hover:bg-gray-50 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-gray-700 to-gray-900 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button className="hidden md:flex p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300">
              <Search className="h-5 w-5" />
            </button>

            {/* User Account */}
            <button className="hidden md:flex p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300">
              <User className="h-5 w-5" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300 group"
            >
              <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-gray-700 to-gray-900 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 block px-3 py-3 text-base font-semibold rounded-lg transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
