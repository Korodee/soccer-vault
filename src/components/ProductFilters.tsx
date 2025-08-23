"use client";

import { useState } from "react";
import { FilterOptions } from "@/types";
import { categories, brands, sizes } from "@/data/products";
import { Filter, X, DollarSign, Tag, Users, Zap } from "lucide-react";

interface ProductFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export default function ProductFilters({
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    key: keyof FilterOptions,
    value: string | number | [number, number]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: "All",
      priceRange: [0, 1000],
      size: "",
      brand: "All",
    });
  };

  const hasActiveFilters =
    filters.category !== "All" ||
    filters.brand !== "All" ||
    filters.size !== "" ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 1000;

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-700" />
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-700 hover:text-gray-900 font-medium flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Filter Content - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-8 pr-2 scrollbar-hide">
        {/* Category Filter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-4 w-4 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Category</h3>
          </div>
          <div className="space-y-3">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-4 w-4 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Price Range</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Min</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.priceRange[0]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [
                      Number(e.target.value),
                      filters.priceRange[1],
                    ])
                  }
                  className="w-full text-gray-700 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="flex items-center justify-center text-gray-400 mt-6">-</div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Max</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [
                      filters.priceRange[0],
                      Number(e.target.value),
                    ])
                  }
                  className="w-full text-gray-700 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Quick Price Ranges */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Under $50", range: [0, 50] },
                { label: "$50-$100", range: [50, 100] },
                { label: "$100-$200", range: [100, 200] },
                { label: "$200+", range: [200, 1000] },
              ].map(({ label, range }) => (
                <button
                  key={label}
                  onClick={() =>
                    handleFilterChange("priceRange", range as [number, number])
                  }
                  className={`px-3 py-2 text-start text-xs rounded-lg border transition-all duration-300 ${
                    filters.priceRange[0] === range[0] &&
                    filters.priceRange[1] === range[1]
                      ? "bg-gray-700 text-white border-gray-700"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Size Filter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Size</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {sizes.map((size) => (
              <label
                key={size}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="size"
                  value={size}
                  checked={filters.size === size}
                  onChange={(e) => handleFilterChange("size", e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  {size}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Brand Filter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Brand</h3>
          </div>
          <div className="space-y-3">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="brand"
                  value={brand}
                  checked={filters.brand === brand}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-6 border-t border-gray-200 pb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Active Filters
          </h4>
          <div className="space-y-2">
            {filters.category !== "All" && (
              <div className="flex items-center justify-between bg-gray-50 text-gray-800 px-3 py-2 rounded-lg text-sm">
                <span>Category: {filters.category}</span>
                <button
                  onClick={() => handleFilterChange("category", "All")}
                  className="hover:bg-gray-100 rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {filters.brand !== "All" && (
              <div className="flex items-center justify-between bg-gray-50 text-gray-800 px-3 py-2 rounded-lg text-sm">
                <span>Brand: {filters.brand}</span>
                <button
                  onClick={() => handleFilterChange("brand", "All")}
                  className="hover:bg-gray-100 rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {filters.size !== "" && (
              <div className="flex items-center justify-between bg-gray-50 text-gray-800 px-3 py-2 rounded-lg text-sm">
                <span>Size: {filters.size}</span>
                <button
                  onClick={() => handleFilterChange("size", "")}
                  className="hover:bg-gray-100 rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {(filters.priceRange[0] !== 0 ||
              filters.priceRange[1] !== 1000) && (
              <div className="flex items-center justify-between bg-gray-50 text-gray-800 px-3 py-2 rounded-lg text-sm">
                <span>
                  Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </span>
                <button
                  onClick={() => handleFilterChange("priceRange", [0, 1000])}
                  className="hover:bg-gray-100 rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
