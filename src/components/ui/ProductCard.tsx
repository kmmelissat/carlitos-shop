"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { useCart, useAuth } from "@/store";
import { showToast } from "@/components/ui/Toast";

interface ProductCardProps {
  product: Product;
  className?: string;
  showAddToCart?: boolean; // New prop to control Add to Cart button
  isFeatured?: boolean; // New prop to indicate if this is a featured product
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
  showAddToCart = true, // Default to true to maintain existing behavior
  isFeatured = false, // Default to false
}) => {
  const { addItem, isInCart, getItemQuantity } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation

    if (isAdding) return; // Prevent double clicks

    // Check if user is authenticated
    if (!user) {
      showToast("Please sign in to add items to your cart", "info", 4000);
      router.push("/auth/login");
      return;
    }

    setIsAdding(true);

    try {
      // Add item to cart
      addItem(product, 1);

      // Show success toast
      showToast(`${product.name} added to cart!`, "success", 3000);

      // Reset state
      setTimeout(() => {
        setIsAdding(false);
      }, 1000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Error adding item to cart", "error");
      setIsAdding(false);
    }
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
      return "text-amber-600";
    }
    return "text-emerald-600";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      chips:
        "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300",
      cookies:
        "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300",
      beverages:
        "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",
      chocolate:
        "bg-gradient-to-r from-amber-100 to-orange-200 text-amber-900 border-amber-300",
      nuts: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
      candy:
        "bg-gradient-to-r from-pink-100 to-rose-200 text-pink-900 border-pink-300",
      crackers:
        "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300",
      popcorn:
        "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
      dried_fruits:
        "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300",
      healthy:
        "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300",
      other:
        "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300",
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const stockStatus = getStockMessage();
  const isInCartNow = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  // Placeholder image as data URL
  const placeholderImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAyMEgyNE0yMCAxNlYyNE0xMiAyMEM4LjY4NjI5IDIwIDYgMTcuMzEzNyA2IDE0QzYgMTAuNjg2MyA4LjY4NjI5IDggMTIgOEMyOCA4IDI4IDggMjggOEMzMS4zMTM3IDggMzQgMTAuNjg2MyAzNCAxNEMzNCAx 3LjMxMzcgMzEuMzEzNyAyMCAyOCAyMEgyNE0yMCAyOEMxNy4yMzg2IDI4IDE1IDI1Ljc2MTQgMTUgMjNWMjBIMjVWMjNDMjUgMjUuNzYxNCAyMi43NjE0IDI4IDIwIDI4WiIgc3Ryb2tlPSIjOTlBMUFBIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=";

  // Enhanced card for featured products
  if (isFeatured) {
    return (
      <div
        className={`group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-orange-100 hover:border-orange-300 hover:-translate-y-2 relative animate-scale-in ${className}`}
      >
        {/* Featured Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-transparent to-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <Link href={`/products/${product.id}`}>
          <div className="relative overflow-hidden">
            {/* Product Image */}
            <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50">
              <img
                src={product.images[0] || placeholderImage}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.currentTarget.src = placeholderImage;
                }}
              />

              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out animate-shimmer"></div>
            </div>

            {/* Enhanced Featured Badge */}
            {product.featured && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl flex items-center animate-pulse animate-glow">
                <span className="material-icons-round text-lg mr-2">star</span>
                Featured
                <div className="ml-2 w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
            )}

            {/* Enhanced Category Badge */}
            <div className="absolute bottom-4 right-4">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 shadow-lg backdrop-blur-sm ${getCategoryColor(
                  product.category
                )} group-hover:scale-110 transition-transform duration-300 animate-float`}
              >
                {product.category.charAt(0).toUpperCase() +
                  product.category.slice(1).replace("_", " ")}
              </span>
            </div>

            {/* Stock Badge */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <span className="material-icons-round text-white text-5xl mb-3">
                    inventory_2
                  </span>
                  <span className="text-white text-xl font-bold block">
                    Out of Stock
                  </span>
                </div>
              </div>
            )}

            {/* Enhanced Low Stock Warning */}
            {product.stock > 0 && product.stock < 10 && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-xl flex items-center animate-bounce">
                <span className="material-icons-round text-sm mr-1">
                  warning
                </span>
                Low Stock
              </div>
            )}
          </div>
        </Link>

        {/* Enhanced Product Info */}
        <div className="p-6">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-2 mb-3 group-hover:text-orange-600">
              {product.name}
            </h3>
          </Link>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Enhanced Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
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
            <span className="text-gray-600 text-sm ml-2 font-semibold">
              {product.rating.toFixed(1)}
              <span className="text-gray-400 font-normal">
                ({product.reviewCount} reviews)
              </span>
            </span>
          </div>

          {/* Enhanced Price and Stock */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold animate-gradient-text">
                {formatPrice(product.price)}
              </span>
              {product.weight && (
                <span className="text-gray-500 text-sm ml-2">
                  / {product.weight}g
                </span>
              )}
            </div>
            <div className="flex items-center">
              <span
                className={`text-sm font-bold ${getStockColor()} flex items-center px-3 py-1 rounded-full bg-white shadow-sm`}
              >
                <span className="material-icons-round text-sm mr-1">
                  {product.stock === 0
                    ? "inventory_2"
                    : product.stock < 10
                    ? "warning"
                    : "check_circle"}
                </span>
                {stockStatus}
              </span>
            </div>
          </div>

          {/* Enhanced Add to Cart Button */}
          {showAddToCart && (
            <div className="space-y-3">
              {product.stock > 0 ? (
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAdding}
                  className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl relative overflow-hidden hover-lift ${
                    !user
                      ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-blue-200"
                      : isInCartNow
                      ? "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 shadow-emerald-200"
                      : isAdding
                      ? "bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 text-white shadow-orange-200"
                      : "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:from-orange-600 hover:via-red-600 hover:to-pink-600 shadow-orange-200"
                  }`}
                >
                  {!user ? (
                    <span className="flex items-center justify-center">
                      <span className="material-icons-round text-xl mr-2">
                        login
                      </span>
                      Sign In to Add to Cart
                    </span>
                  ) : isAdding ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                      Adding...
                    </span>
                  ) : isInCartNow ? (
                    <span className="flex items-center justify-center">
                      <span className="material-icons-round text-xl mr-2">
                        check_circle
                      </span>
                      In Cart ({cartQuantity})
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span className="material-icons-round text-xl mr-2">
                        add_shopping_cart
                      </span>
                      Add to Cart
                    </span>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-4 px-6 rounded-2xl font-bold bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300"
                >
                  <span className="flex items-center justify-center">
                    <span className="material-icons-round text-xl mr-2">
                      block
                    </span>
                    Out of Stock
                  </span>
                </button>
              )}

              {/* Enhanced Quick actions */}
              {isInCartNow && user && (
                <div className="flex space-x-3 animate-fadeIn">
                  <Link
                    href="/cart"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 text-center text-sm font-bold shadow-md hover:shadow-lg"
                  >
                    View Cart
                  </Link>
                  <Link
                    href={`/products/${product.id}`}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-xl hover:from-blue-200 hover:to-purple-200 transition-all duration-200 text-center text-sm font-bold shadow-md hover:shadow-lg"
                  >
                    View Details
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Regular card (existing implementation)
  return (
    <div
      className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 hover:-translate-y-1 ${className}`}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden">
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <img
              src={product.images[0] || placeholderImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = placeholderImage;
              }}
            />

            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center animate-pulse">
              <span className="material-icons-round text-sm mr-1">star</span>
              Featured
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute bottom-3 right-3">
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm backdrop-blur-sm ${getCategoryColor(
                product.category
              )}`}
            >
              {product.category.charAt(0).toUpperCase() +
                product.category.slice(1).replace("_", " ")}
            </span>
          </div>

          {/* Stock Badge */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <span className="material-icons-round text-white text-4xl mb-2">
                  inventory_2
                </span>
                <span className="text-white text-lg font-bold block">
                  Out of Stock
                </span>
              </div>
            </div>
          )}

          {/* Low Stock Warning */}
          {product.stock > 0 && product.stock < 10 && (
            <div className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-medium shadow-lg flex items-center">
              <span className="material-icons-round text-sm mr-1">warning</span>
              Low Stock
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-2 mb-2 group-hover:text-orange-600">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
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
          <span className="text-gray-600 text-sm ml-2 font-medium">
            {product.rating.toFixed(1)}
            <span className="text-gray-400 font-normal">
              ({product.reviewCount})
            </span>
          </span>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </span>
            {product.weight && (
              <span className="text-gray-500 text-sm ml-1">
                / {product.weight}g
              </span>
            )}
          </div>
          <div className="flex items-center">
            <span
              className={`text-sm font-semibold ${getStockColor()} flex items-center`}
            >
              <span className="material-icons-round text-sm mr-1">
                {product.stock === 0
                  ? "inventory_2"
                  : product.stock < 10
                  ? "warning"
                  : "check_circle"}
              </span>
              {stockStatus}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        {showAddToCart && (
          <div className="space-y-2">
            {product.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl relative overflow-hidden ${
                  !user
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-blue-200"
                    : isInCartNow
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-emerald-200"
                    : isAdding
                    ? "bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-orange-200"
                    : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-orange-200"
                }`}
              >
                {!user ? (
                  <span className="flex items-center justify-center">
                    <span className="material-icons-round text-lg mr-2">
                      login
                    </span>
                    Sign In to Add to Cart
                  </span>
                ) : isAdding ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Adding...
                  </span>
                ) : isInCartNow ? (
                  <span className="flex items-center justify-center">
                    <span className="material-icons-round text-lg mr-2">
                      check_circle
                    </span>
                    In Cart ({cartQuantity})
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="material-icons-round text-lg mr-2">
                      add_shopping_cart
                    </span>
                    Add to Cart
                  </span>
                )}
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 px-4 rounded-xl font-semibold bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300"
              >
                <span className="flex items-center justify-center">
                  <span className="material-icons-round text-lg mr-2">
                    block
                  </span>
                  Out of Stock
                </span>
              </button>
            )}

            {/* Quick actions */}
            {isInCartNow && user && (
              <div className="flex space-x-2 animate-fadeIn">
                <Link
                  href="/cart"
                  className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
                >
                  View Cart
                </Link>
                <Link
                  href={`/products/${product.id}`}
                  className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
                >
                  View Details
                </Link>
              </div>
            )}
          </div>
        )}

        {/* View Product Button (when Add to Cart is hidden) */}
        {!showAddToCart && (
          <Link
            href={`/products/${product.id}`}
            className="block w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-blue-200 text-center"
          >
            <span className="flex items-center justify-center">
              <span className="material-icons-round text-lg mr-2">
                visibility
              </span>
              View Product
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
