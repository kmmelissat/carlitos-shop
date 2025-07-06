"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard, SearchBar } from "@/components";
import { Product, ProductCategory } from "@/types";

interface ProductsClientProps {
  products: Product[];
  allProducts: Product[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  searchParams: {
    q?: string;
    category?: ProductCategory;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    page?: string;
  };
}

const categories = [
  { id: ProductCategory.CHIPS, name: "Chips & Snacks", icon: "🍟" },
  { id: ProductCategory.COOKIES, name: "Cookies", icon: "🍪" },
  { id: ProductCategory.CANDY, name: "Candy", icon: "🍭" },
  { id: ProductCategory.CHOCOLATE, name: "Chocolate", icon: "🍫" },
  { id: ProductCategory.NUTS, name: "Nuts", icon: "🥜" },
  { id: ProductCategory.BEVERAGES, name: "Beverages", icon: "🥤" },
  { id: ProductCategory.CRACKERS, name: "Crackers", icon: "🧀" },
  { id: ProductCategory.POPCORN, name: "Popcorn", icon: "🍿" },
  { id: ProductCategory.DRIED_FRUITS, name: "Dried Fruits", icon: "🍇" },
  { id: ProductCategory.HEALTHY, name: "Healthy", icon: "🥗" },
  { id: ProductCategory.OTHER, name: "Other", icon: "📦" },
];

const ProductsClient: React.FC<ProductsClientProps> = ({
  products,
  allProducts,
  totalProducts,
  currentPage,
  totalPages,
  searchParams,
}) => {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Handle search
  const handleSearch = (query: string) => {
    const params = new URLSearchParams(urlSearchParams);
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    params.delete("page"); // Reset to first page
    router.push(`/products?${params.toString()}`);
  };

  // Handle category filter
  const handleCategoryFilter = (category: ProductCategory | "") => {
    const params = new URLSearchParams(urlSearchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    params.delete("page"); // Reset to first page
    router.push(`/products?${params.toString()}`);
  };

  // Handle price filter
  const handlePriceFilter = (minPrice: string, maxPrice: string) => {
    const params = new URLSearchParams(urlSearchParams);
    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }
    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }
    params.delete("page"); // Reset to first page
    router.push(`/products?${params.toString()}`);
  };

  // Handle stock filter
  const handleStockFilter = (inStock: boolean) => {
    const params = new URLSearchParams(urlSearchParams);
    if (inStock) {
      params.set("inStock", "true");
    } else {
      params.delete("inStock");
    }
    params.delete("page"); // Reset to first page
    router.push(`/products?${params.toString()}`);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(urlSearchParams);
    params.set("page", page.toString());
    router.push(`/products?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    router.push("/products");
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchParams.q) count++;
    if (searchParams.category) count++;
    if (searchParams.minPrice) count++;
    if (searchParams.maxPrice) count++;
    if (searchParams.inStock) count++;
    return count;
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <SearchBar
          initialQuery={searchParams.q || ""}
          onSearch={handleSearch}
          showFilters={false}
          className="w-full"
        />
      </div>

      {/* Quick Category Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryFilter("")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !searchParams.category
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                searchParams.category === category.id
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Results and Filters */}
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              {totalProducts === 0
                ? "No products found"
                : `${totalProducts} product${
                    totalProducts > 1 ? "s" : ""
                  } found`}
            </p>

            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-orange-600 hover:text-orange-700 underline"
              >
                Clear filters ({getActiveFiltersCount()})
              </button>
            )}
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-orange-600 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-orange-600 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {sortedProducts.length > 0 ? (
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "space-y-4"
          }`}
        >
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className={viewMode === "list" ? "flex flex-row" : ""}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * 12 + 1} to{" "}
              {Math.min(currentPage * 12, totalProducts)} of {totalProducts}{" "}
              products
            </div>

            <div className="flex items-center gap-2">
              {/* Previous */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                const isCurrentPage = page === currentPage;
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2);

                if (!showPage) {
                  if (page === currentPage - 3 || page === currentPage + 3) {
                    return (
                      <span key={page} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      isCurrentPage
                        ? "bg-orange-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsClient;
