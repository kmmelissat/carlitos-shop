"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { Button, Card } from "antd";

const OrderConfirmationPage = () => {
  const router = useRouter();
  const params = useParams();
  console.log("🔍 Confirmation page params:", params);

  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";
  console.log("📄 Order ID:", id);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      console.log("🔄 Starting to fetch order data...");
      if (!id) {
        console.error("❌ Invalid order ID");
        setError("Invalid order ID");
        setLoading(false);
        return;
      }

      try {
        console.log("📥 Fetching order document from Firestore...");
        const orderDoc = await getDoc(doc(db, "orders", id));

        if (orderDoc.exists()) {
          const data = orderDoc.data();
          console.log("✅ Order data retrieved:", data);

          // Ensure createdAt is properly handled
          const createdAt = data.createdAt?.toDate?.() || new Date();
          console.log("📅 Formatted createdAt:", createdAt);

          setOrder({
            id: orderDoc.id,
            ...data,
            createdAt,
          });
        } else {
          console.error("❌ Order document not found");
          setError("Order not found");
        }
      } catch (error) {
        console.error("❌ Error fetching order:", error);
        setError("Failed to load order details");
      } finally {
        console.log("🏁 Finished fetching order");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <span className="material-icons-round text-red-500 text-6xl mb-4">
            error_outline
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Order Not Found"}
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the order you're looking for.
          </p>
          <div className="space-x-4">
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => router.back()}
              className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-icons-round text-green-600 text-4xl">
              check_circle
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thanks for your order!
          </h1>
          <p className="text-gray-600 mb-6">
            We'll send you a confirmation email with your order details.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Continue shopping
          </Link>
        </div>

        {/* Order Details Card */}
        <Card className="rounded-xl shadow-lg overflow-hidden">
          {/* Order Header */}
          <div className="bg-green-800 -mx-6 -mt-6 px-6 py-4 text-white mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Order ID: #{id.slice(-6).toUpperCase()}
                </h2>
                <p className="text-green-200">
                  Order Date: {format(order.createdAt, "PP")}
                </p>
              </div>
              <div className="mt-4 md:mt-0 space-x-3">
                <Button type="default" className="bg-white hover:bg-gray-100">
                  Download Invoice
                </Button>
                <Link href={`/orders/${id}`}>
                  <Button
                    type="primary"
                    className="bg-yellow-400 border-none hover:bg-yellow-500 text-black"
                  >
                    Track order
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item: any) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100"
              >
                <div className="flex items-center space-x-4">
                  {item.product.images?.[0] && (
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-medium text-gray-900">
                  ${(item.quantity * item.product.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Item cost</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping cost</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              {order.coupon && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon</span>
                  <span>-${order.coupon.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                <span>Total Cost</span>
                <span className="text-orange-600">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="grid md:grid-cols-2 gap-6 mt-8 pt-6 border-t">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Delivery Method
              </h3>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <span className="material-icons-round text-gray-400">
                  local_shipping
                </span>
                <div>
                  <p className="font-medium text-gray-800">
                    {order.deliveryOption.type}
                  </p>
                  {order.deliveryOption.location && (
                    <p className="text-sm text-gray-600">
                      {order.deliveryOption.location.building} -{" "}
                      {order.deliveryOption.location.classroom}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <span className="material-icons-round text-gray-400">
                  payments
                </span>
                <p className="font-medium text-gray-800">
                  {order.paymentMethod.type}
                </p>
              </div>
            </div>
          </div>

          {/* Need Help Section */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-medium text-gray-900 mb-4">Need help?</h3>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
              <Link
                href="/help"
                className="text-orange-600 hover:text-orange-700 flex items-center transition-colors"
              >
                <span className="material-icons-round mr-2">help_outline</span>
                Visit our help center
              </Link>
              <Link
                href="/contact"
                className="text-orange-600 hover:text-orange-700 flex items-center transition-colors"
              >
                <span className="material-icons-round mr-2">mail_outline</span>
                Contact support
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
