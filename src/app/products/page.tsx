import React, { Suspense } from "react";
import { getProductsServer } from "@/lib/api-server";
import { ProductCategory } from "@/types";
import ProductsClient from "./ProductsClient";

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: ProductCategory;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    page?: string;
  }>;
}

const ProductsPage: React.FC<ProductsPageProps> = async ({ searchParams }) => {
  // Await the searchParams promise
  const resolvedSearchParams = await searchParams;
  // Fetch all products from the server
  const allProducts = await getProductsServer();

  // Apply server-side filtering based on search params
  let filteredProducts = allProducts;

  // Filter by search query
  if (resolvedSearchParams.q) {
    const searchTerm = resolvedSearchParams.q.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by category
  if (resolvedSearchParams.category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === resolvedSearchParams.category
    );
  }

  // Filter by price range
  if (resolvedSearchParams.minPrice) {
    const minPrice = parseFloat(resolvedSearchParams.minPrice);
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= minPrice
    );
  }

  if (resolvedSearchParams.maxPrice) {
    const maxPrice = parseFloat(resolvedSearchParams.maxPrice);
    filteredProducts = filteredProducts.filter(
      (product) => product.price <= maxPrice
    );
  }

  // Filter by stock
  if (resolvedSearchParams.inStock === "true") {
    filteredProducts = filteredProducts.filter((product) => product.stock > 0);
  }

  // Pagination
  const currentPage = parseInt(resolvedSearchParams.page || "1");
  const productsPerPage = 12;
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 md:pt-32">
      {/* Header */}
      <div className="shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              All Products
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Discover all our amazing snacks and treats
            </p>
          </div>
        </div>
      </div>

      {/* Products Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductsClient
            products={paginatedProducts}
            allProducts={allProducts}
            totalProducts={filteredProducts.length}
            currentPage={currentPage}
            totalPages={totalPages}
            searchParams={resolvedSearchParams}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default ProductsPage;
