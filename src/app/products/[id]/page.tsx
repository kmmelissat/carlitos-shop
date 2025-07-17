"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "antd";
import {
  ArrowLeftOutlined,
  HeartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useCartStore, useAuthStore } from "@/store";
import { Product } from "@/types";
import { getProductById } from "@/lib/api";
import { showToast } from "@/components/ui/Toast";

const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addItem, isInCart, getItemQuantity } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!user) {
      showToast("Please sign in to add items to your cart", "info", 4000);
      router.push("/auth/login");
      return;
    }

    if (product) {
      addItem(product, quantity);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">🛍️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Button
            type="primary"
            size="large"
            onClick={() => router.push("/products")}
          >
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const isInCartNow = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-orange-600"
        >
          Back to Products
        </Button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Featured Badge */}
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center">
                    <span className="material-icons-round text-sm mr-1">
                      star
                    </span>
                    Featured
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute bottom-4 right-4">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border shadow-sm backdrop-blur-sm ${getCategoryColor(
                      product.category
                    )}`}
                  >
                    {product.category.charAt(0).toUpperCase() +
                      product.category.slice(1).replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-orange-500"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4">
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
                  <span className="ml-2 text-gray-600 font-medium">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-b border-gray-200 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {formatPrice(product.price)}
                    </span>
                    {product.weight && (
                      <span className="text-gray-500 text-lg ml-2">
                        / {product.weight}g
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-semibold ${
                        product.stock === 0
                          ? "text-red-600"
                          : product.stock < 10
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : product.stock < 10
                        ? `Only ${product.stock} left`
                        : "In Stock"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-lg font-medium text-gray-900">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                      disabled={quantity <= 1}
                    >
                      <span className="material-icons-round">remove</span>
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                      disabled={quantity >= product.stock}
                    >
                      <span className="material-icons-round">add</span>
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 h-12 text-lg font-semibold"
                  >
                    {!user ? (
                      <span className="flex items-center justify-center">
                        <span className="material-icons-round mr-2">login</span>
                        Sign In to Add to Cart
                      </span>
                    ) : isInCartNow ? (
                      <span className="flex items-center justify-center">
                        <span className="material-icons-round mr-2">
                          check_circle
                        </span>
                        In Cart ({cartQuantity})
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <span className="material-icons-round mr-2">
                          add_shopping_cart
                        </span>
                        Add to Cart
                      </span>
                    )}
                  </Button>

                  <Button
                    icon={<HeartOutlined />}
                    size="large"
                    className="h-12"
                  />

                  <Button
                    icon={<ShareAltOutlined />}
                    size="large"
                    className="h-12"
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {product.weight && (
                    <div>
                      <span className="font-medium text-gray-700">Weight:</span>
                      <span className="ml-2 text-gray-600">
                        {product.weight}g
                      </span>
                    </div>
                  )}
                  {product.ingredients && (
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">
                        Ingredients:
                      </span>
                      <p className="mt-1 text-gray-600">
                        {product.ingredients}
                      </p>
                    </div>
                  )}
                  {product.allergens && (
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">
                        Allergens:
                      </span>
                      <p className="mt-1 text-gray-600">{product.allergens}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
