"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "antd";
import {
  DeleteOutlined,
  ShoppingOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useCartStore, useAuthStore } from "@/store";
import { showToast } from "@/components/ui/Toast";

const CartPage: React.FC = () => {
  const router = useRouter();
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } =
    useCartStore();
  const { user, loading } = useAuthStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      showToast("Please sign in to view your cart", "info", 4000);
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (redirect is happening)
  if (!user) {
    return null;
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      showToast("Please sign in to checkout", "info", 4000);
      router.push("/auth/login");
      return;
    }

    // Use Next.js router for smooth navigation
    await router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/products")}
              className="text-gray-600 hover:text-orange-600"
            >
              Continue Shopping
            </Button>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-8xl text-gray-300 mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button
              type="primary"
              size="large"
              icon={<ShoppingOutlined />}
              onClick={() => router.push("/products")}
              className="h-12 px-8 text-lg font-semibold"
            >
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/products")}
              className="text-gray-600 hover:text-orange-600"
            >
              Continue Shopping
            </Button>
            <Button
              danger
              onClick={clearCart}
              className="text-red-600 hover:text-red-700"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* Product Image */}
                  <Link href={`/products/${item.product.id}`}>
                    <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-75 transition-opacity">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors cursor-pointer">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {item.product.description}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-500 capitalize">
                        {item.product.category.replace("_", " ")}
                      </span>
                      {item.product.weight && (
                        <>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-sm text-gray-500">
                            {item.product.weight}g
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        <span className="material-icons-round text-sm">
                          remove
                        </span>
                      </button>
                      <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <span className="material-icons-round text-sm">
                          add
                        </span>
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right min-w-[5rem]">
                      <div className="text-lg font-bold text-gray-900">
                        {formatPrice(item.totalPrice)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatPrice(item.product.price)} each
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove item"
                    >
                      <DeleteOutlined className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                {/* Items breakdown */}
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                ))}

                <hr className="border-gray-200" />

                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">
                    Subtotal
                  </span>
                  <span className="text-base font-medium text-gray-900">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(total * 0.1)}
                  </span>
                </div>

                <hr className="border-gray-200" />

                {/* Total */}
                <div className="flex justify-between">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {formatPrice(total + total * 0.1)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                type="primary"
                size="large"
                onClick={handleCheckout}
                className="w-full mt-6 h-12 text-lg font-semibold"
              >
                Proceed to Checkout
              </Button>

              {/* Security Info */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <span className="material-icons-round text-sm mr-1">
                    security
                  </span>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
