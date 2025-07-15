"use client";

import React from "react";
import { useAuth } from "@/store";
import { useRouter } from "next/navigation";
import { OrdersSection } from "@/components";
import Link from "next/link";

const OrdersPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Show loading state
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

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="material-icons-round text-gray-400 text-6xl mb-4">
            account_circle
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to view your orders
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access your order history
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            <span className="material-icons-round mr-2">login</span>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track and manage all your orders in one place
          </p>
        </div>

        {/* Orders List */}
        <OrdersSection userId={user.id} />
      </div>
    </div>
  );
};

export default OrdersPage;
