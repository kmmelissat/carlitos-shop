"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, Button, Space } from "antd";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { ProductCard, SearchBar } from "@/components";
import CategorySidebar from "@/components/ui/CategorySidebar";
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
    setShowMobileSidebar(false); // Close mobile sidebar after selection
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
    // Scroll to top after page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear all filters
  const clearFilters = () => {
    setShowMobileSidebar(false);
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
    <div className="space-y-4 md:space-y-6">
      {/* Search Bar */}
      <div>
        <SearchBar
          initialQuery={searchParams.q || ""}
          onSearch={handleSearch}
          showFilters={false}
          className="w-full"
        />
      </div>

      {/* Mobile-First Layout */}
      <div className="space-y-4 lg:space-y-0 lg:flex lg:gap-6">
        {/* Categories Sidebar */}
        <div className="lg:w-64 lg:flex-shrink-0">
          <CategorySidebar
            allProducts={allProducts}
            searchParams={searchParams}
            onCategoryFilter={handleCategoryFilter}
            showMobileSidebar={showMobileSidebar}
            onToggleMobileSidebar={() =>
              setShowMobileSidebar(!showMobileSidebar)
            }
          />
        </div>

        {/* Products Section */}
        <div className="flex-1 space-y-4 md:space-y-6">
          {/* Mobile-Optimized Toolbar */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            {/* Top Row - Results and Clear Filters */}
            <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:gap-4">
                <p className="text-gray-600 text-sm">
                  {totalProducts === 0
                    ? "No products found"
                    : `${totalProducts} product${
                        totalProducts > 1 ? "s" : ""
                      } found`}
                </p>

                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-orange-600 hover:text-orange-700 underline self-start md:self-auto"
                  >
                    Clear filters ({getActiveFiltersCount()})
                  </button>
                )}
              </div>

              {/* Mobile Filters Toggle (shown only on small screens) */}
              <div className="flex items-center justify-between md:hidden">
                <button
                  onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FilterOutlined />
                  Categories
                  {getActiveFiltersCount() > 0 && (
                    <span className="bg-orange-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Row - Sort and View Controls */}
            <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between mt-4 md:mt-3">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">
                  Sort by:
                </label>
                <Select
                  value={sortBy}
                  style={{ width: "100%", minWidth: 160 }}
                  onChange={(value) => setSortBy(value)}
                  options={[
                    { value: "newest", label: "Newest" },
                    { value: "name", label: "Name" },
                    { value: "price-low", label: "Price: Low to High" },
                    { value: "price-high", label: "Price: High to Low" },
                    { value: "rating", label: "Rating" },
                  ]}
                />
              </div>

              {/* View Mode - Hidden on mobile */}
              <div className="hidden md:block">
                <Space.Compact>
                  <Button
                    type={viewMode === "grid" ? "primary" : "default"}
                    icon={<AppstoreOutlined />}
                    onClick={() => setViewMode("grid")}
                  />
                  <Button
                    type={viewMode === "list" ? "primary" : "default"}
                    icon={<UnorderedListOutlined />}
                    onClick={() => setViewMode("list")}
                  />
                </Space.Compact>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {sortedProducts.length > 0 ? (
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6"
                  : "space-y-4"
              }`}
            >
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className={
                    viewMode === "list" ? "hidden md:flex md:flex-row" : ""
                  }
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-12 h-12 md:w-16 md:h-16 mx-auto"
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
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm md:text-base"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              {/* Mobile-friendly pagination info */}
              <div className="text-center md:text-left mb-4 md:mb-0">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * 12 + 1} to{" "}
                  {Math.min(currentPage * 12, totalProducts)} of {totalProducts}{" "}
                  products
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-center md:justify-between">
                <div className="hidden md:block"></div>{" "}
                {/* Spacer for desktop layout */}
                <div className="flex items-center gap-1 md:gap-2">
                  {/* Previous */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2 md:px-3 py-2 rounded-lg text-sm font-medium ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="hidden md:inline">Previous</span>
                    <span className="md:hidden">‹</span>
                  </button>

                  {/* Page Numbers - Mobile Responsive */}
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    const isCurrentPage = page === currentPage;

                    // Show fewer pages on small screens for better mobile UX
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!showPage) {
                      if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span
                            key={page}
                            className="px-1 md:px-2 text-gray-400 text-sm"
                          >
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
                        className={`px-2 md:px-3 py-2 rounded-lg text-sm font-medium min-w-[36px] ${
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
                    className={`px-2 md:px-3 py-2 rounded-lg text-sm font-medium ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="hidden md:inline">Next</span>
                    <span className="md:hidden">›</span>
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
