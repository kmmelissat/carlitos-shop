"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/store";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
}) => {
  const { addItem, isInCart, getItemQuantity } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    addItem(product, 1);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStockMessage = () => {
    if (product.stock === 0) {
      return "Out of Stock";
    }
    if (product.stock < 10) {
      return `Only ${product.stock} available`;
    }
    return "Available";
  };

  const getStockColor = () => {
    if (product.stock === 0) {
      return "text-red-600";
    }
    if (product.stock < 10) {
      return "text-orange-600";
    }
    return "text-green-600";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      chips: "bg-yellow-100 text-yellow-800 border-yellow-200",
      cookies: "bg-amber-100 text-amber-800 border-amber-200",
      beverages: "bg-blue-100 text-blue-800 border-blue-200",
      chocolate: "bg-orange-100 text-orange-800 border-orange-200",
      nuts: "bg-green-100 text-green-800 border-green-200",
      candy: "bg-pink-100 text-pink-800 border-pink-200",
      other: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const stockStatus = getStockMessage();
  const isInCartNow = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  // Placeholder image as data URL
  const placeholderImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAyMEgyNE0yMCAxNlYyNE0xMiAyMEM4LjY4NjI5IDIwIDYgMTcuMzEzNyA2IDE0QzYgMTAuNjg2MyA4LjY4NjI5IDggMTIgOEMyOCA4IDI4IDggMjggOEMzMS4zMTM3IDggMzQgMTAuNjg2MyAzNCAxNEMzNCAx 3LjMxMzcgMzEuMzEzNyAyMCAyOCAyMEgyNE0yMCAyOEMxNy4yMzg2IDI4IDE1IDI1Ljc2MTQgMTUgMjNWMjBIMjVWMjNDMjUgMjUuNzYxNCAyMi43NjE0IDI4IDIwIDI4WiIgc3Ryb2tlPSIjOTlBMUFBIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=";

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${className}`}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden">
            <img
              src={product.images[0] || placeholderImage}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = placeholderImage;
              }}
            />
          </div>

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center">
              <span className="material-icons-round text-sm mr-1">star</span>
              Featured
            </div>
          )}

          {/* Stock Badge */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-bold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>

        {/* Category */}
        <div className="mt-2">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
              product.category
            )}`}
          >
            {product.category.charAt(0).toUpperCase() +
              product.category.slice(1)}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-600 text-sm ml-2">
            {product.rating.toFixed(1)} ({product.reviewCount} reviews)
          </span>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.weight && (
              <span className="text-gray-500 text-sm ml-1">
                / {product.weight}g
              </span>
            )}
          </div>
          <span className={`text-sm font-medium ${getStockColor()}`}>
            {stockStatus}
          </span>
        </div>

        {/* Seller Info */}
        <div className="flex items-center mt-2">
          <span className="text-gray-500 text-sm">
            By {product.seller.name}
          </span>
          <div className="flex items-center ml-2">
            <svg
              className="w-3 h-3 text-yellow-400 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-gray-500 text-xs ml-1">
              {product.seller.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-4">
          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                isInCartNow
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-orange-600 text-white hover:bg-orange-700"
              }`}
            >
              {isInCartNow ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  In Cart ({cartQuantity})
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 8.32a2 2 0 01-1.98 1.68H9m6 0v-1a2 2 0 00-2-2H9a2 2 0 00-2 2v1m6 0h6"
                    />
                  </svg>
                  Add to Cart
                </span>
              )}
            </button>
          ) : (
            <button
              disabled
              className="w-full py-2 px-4 rounded-lg font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
