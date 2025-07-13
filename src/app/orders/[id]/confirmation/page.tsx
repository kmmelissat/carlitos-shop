"use client";
import React from "react";
import Link from "next/link";

const OrderConfirmationPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
        <span className="material-icons-round text-green-500 text-6xl mb-4">
          check_circle
        </span>
        <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
        <p className="text-lg mb-6">
          Your order{" "}
          <span className="font-mono text-orange-600">
            #{id.slice(-6).toUpperCase()}
          </span>{" "}
          was placed successfully.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/profile"
            className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
          >
            View My Orders
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
