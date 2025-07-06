import React from "react";
import Link from "next/link";
import Image from "next/image";
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
    e.preventDefault(); // Prevenir navegación del Link
    addItem(product, 1);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const getStockStatus = (): { text: string; color: string } => {
    if (product.stock === 0) {
      return { text: "Agotado", color: "text-red-600" };
    } else if (product.stock < 5) {
      return {
        text: `Solo ${product.stock} disponibles`,
        color: "text-orange-600",
      };
    }
    return { text: "Disponible", color: "text-green-600" };
  };

  const stockStatus = getStockStatus();
  const isInCartNow = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${className}`}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder-snack.png"}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Destacado
            </div>
          )}

          {/* Stock Badge */}
          {product.stock === 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Agotado
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
          <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
            {product.category}
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
            {product.rating.toFixed(1)} ({product.reviewCount} reseñas)
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
          <span className={`text-sm font-medium ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
        </div>

        {/* Seller Info */}
        <div className="flex items-center mt-2">
          <span className="text-gray-500 text-sm">
            Por {product.seller.name}
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
                  En carrito ({cartQuantity})
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
                  Agregar al carrito
                </span>
              )}
            </button>
          ) : (
            <button
              disabled
              className="w-full py-2 px-4 rounded-lg font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
            >
              No disponible
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
