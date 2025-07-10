"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, Button } from "antd";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
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
      <div>
        <SearchBar
          initialQuery={searchParams.q || ""}
          onSearch={handleSearch}
          showFilters={false}
          className="w-full"
        />
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex gap-6">
        {/* Categories Sidebar */}
        <CategorySidebar
          allProducts={allProducts}
          searchParams={searchParams}
          onCategoryFilter={handleCategoryFilter}
          showMobileSidebar={showMobileSidebar}
          onToggleMobileSidebar={() => setShowMobileSidebar(!showMobileSidebar)}
        />

        {/* Products Section */}
        <div className="flex-1 space-y-6">
          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Results and Filters */}
              <div className="flex items-center gap-4">
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
                  <Select
                    value={sortBy}
                    style={{ width: 180 }}
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

                {/* View Mode */}
                <Button.Group>
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
                </Button.Group>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {sortedProducts.length > 0 ? (
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
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
