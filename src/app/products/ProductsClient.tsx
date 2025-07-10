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
  { id: ProductCategory.CHIPS, name: "Chips & Snacks", icon: "lunch_dining" },
  { id: ProductCategory.COOKIES, name: "Cookies", icon: "cookie" },
  { id: ProductCategory.CANDY, name: "Candy", icon: "icecream" },
  { id: ProductCategory.CHOCOLATE, name: "Chocolate", icon: "pix" },
  { id: ProductCategory.NUTS, name: "Nuts", icon: "eco" },
  { id: ProductCategory.BEVERAGES, name: "Beverages", icon: "local_drink" },
  { id: ProductCategory.CRACKERS, name: "Crackers", icon: "grain" },
  { id: ProductCategory.POPCORN, name: "Popcorn", icon: "movie" },
  { id: ProductCategory.DRIED_FRUITS, name: "Dried Fruits", icon: "local_florist" },
  { id: ProductCategory.HEALTHY, name: "Healthy", icon: "health_and_safety" },
  { id: ProductCategory.OTHER, name: "Other", icon: "category" },
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
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors = {
      chips:
        "bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200 hover:from-yellow-100 hover:to-yellow-200",
      cookies:
        "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-800 border-amber-200 hover:from-amber-100 hover:to-amber-200",
      beverages:
        "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 border-blue-200 hover:from-blue-100 hover:to-blue-200",
      chocolate:
        "bg-gradient-to-br from-amber-100 to-orange-200 text-amber-900 border-amber-300 hover:from-amber-200 hover:to-orange-300",
      nuts: "bg-gradient-to-br from-green-50 to-green-100 text-green-800 border-green-200 hover:from-green-100 hover:to-green-200",
      candy:
        "bg-gradient-to-br from-pink-100 to-rose-200 text-pink-900 border-pink-300 hover:from-pink-200 hover:to-rose-300",
      crackers:
        "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-800 border-amber-200 hover:from-amber-100 hover:to-amber-200",
      popcorn:
        "bg-gradient-to-br from-red-50 to-red-100 text-red-800 border-red-200 hover:from-red-100 hover:to-red-200",
      dried_fruits:
        "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-800 border-purple-200 hover:from-purple-100 hover:to-purple-200",
      healthy:
        "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200",
      other:
        "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border-gray-200 hover:from-gray-100 hover:to-gray-200",
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  // Get category product count
  const getCategoryCount = (categoryId: ProductCategory | "") => {
    if (categoryId === "") {
      return allProducts.length;
    }
    return allProducts.filter((product) => product.category === categoryId)
      .length;
  };

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

  // Categories Sidebar Component
  const CategoriesSidebar = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="material-icons-round text-orange-600 mr-2">
            category
          </span>
          Categories
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {categories.length + 1}
        </span>
      </div>

      <div className="space-y-3">
        {/* All Categories Card */}
        <button
          onClick={() => handleCategoryFilter("")}
          className={`w-full p-3 rounded-xl border-2 transition-all duration-200 ${
            !searchParams.category
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-lg"
              : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200 hover:from-gray-100 hover:to-gray-200 hover:shadow-md"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`p-2 rounded-lg mr-3 ${
                !searchParams.category ? "bg-white/20" : "bg-white shadow-sm"
              }`}
            >
              <span
                className={`material-icons-round text-lg ${
                  !searchParams.category ? "text-white" : "text-gray-600"
                }`}
              >
                apps
              </span>
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-medium text-sm">All Products</h4>
              <p className="text-xs opacity-75">{getCategoryCount("")} items</p>
            </div>
          </div>
        </button>

        {/* Category Cards */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryFilter(category.id)}
            className={`w-full p-3 rounded-xl border-2 transition-all duration-200 ${
              searchParams.category === category.id
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-lg"
                : `${getCategoryColor(
                    category.id
                  )} border-2 shadow-sm hover:shadow-md`
            }`}
          >
            <div className="flex items-center">
              <div
                className={`p-2 rounded-lg mr-3 ${
                  searchParams.category === category.id
                    ? "bg-white/20"
                    : "bg-white shadow-sm"
                }`}
              >
                <span
                  className={`material-icons-round text-lg ${
                    searchParams.category === category.id
                      ? "text-white"
                      : "text-current"
                  }`}
                >
                  {category.icon}
                </span>
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-medium text-sm">{category.name}</h4>
                <p className="text-xs opacity-75">
                  {getCategoryCount(category.id)} items
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

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

      {/* Mobile Categories Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="w-full flex items-center justify-between bg-white rounded-lg shadow-sm p-4 text-gray-700 hover:text-orange-600 transition-colors"
        >
          <div className="flex items-center">
            <span className="material-icons-round mr-2">category</span>
            <span className="font-medium">Categories</span>
            {searchParams.category && (
              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                {categories.find((c) => c.id === searchParams.category)?.name ||
                  "Selected"}
              </span>
            )}
          </div>
          <span className="material-icons-round">
            {showMobileSidebar ? "expand_less" : "expand_more"}
          </span>
        </button>

        {/* Mobile Categories Dropdown */}
        {showMobileSidebar && (
          <div className="mt-2">
            <CategoriesSidebar />
          </div>
        )}
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex gap-6">
        {/* Desktop Categories Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <CategoriesSidebar />
        </div>

        {/* Products Section */}
        <div className="flex-1 space-y-6">
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
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                      if (
                        page === currentPage - 3 ||
                        page === currentPage + 3
                      ) {
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
      </div>
    </div>
  );
};

export default ProductsClient;
