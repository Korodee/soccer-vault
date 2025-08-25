"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { FilterOptions, Product } from "@/types";
import { Search, Grid, List, Filter, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filters, setFilters] = useState<FilterOptions>({
    category: "All",
    priceRange: [0, 1000],
    size: "",
    brand: "All",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Get category from URL params
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [categoryParam]);

  useEffect(() => {
    let filtered = products;

    // Apply category/league filter
    if (filters.category !== "All") {
      filtered = filtered.filter(
        (product) => 
          product.category === filters.category || 
          product.league === filters.category
      );
    }

    // Apply brand filter
    if (filters.brand !== "All") {
      filtered = filtered.filter((product) => product.brand === filters.brand);
    }

    // Apply price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Apply size filter
    if (filters.size) {
      filtered = filtered.filter((product) =>
        product.sizes.includes(filters.size)
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.league && product.league.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.club && product.club.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProducts(filtered);
  }, [filters, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Page Header */}
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/shop-hero.jpg"
            alt="Shop hero background"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              {categoryParam
                ? `${categoryParam} Jerseys`
                : "Premium Soccer Jerseys"}
            </h1>
            <p className="text-md text-gray-300 max-w-2xl mx-auto">
              {categoryParam
                ? `Discover authentic ${categoryParam} jerseys from top clubs`
                : "Discover authentic jerseys from the world&apos;s top clubs and leagues"}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for jerseys, brands, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:outline-none transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filters Trigger */}
          <div className="lg:hidden -mt-4 mb-4">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 h-[calc(100vh-120px)]">
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Try adjusting your search terms or filters to find what
                  you&apos;re looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({
                      category: "All",
                      priceRange: [0, 1000],
                      size: "",
                      brand: "All",
                    });
                  }}
                  className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-800 hover:to-black transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-8 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <ProductFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
