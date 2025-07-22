"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { Button, Card } from "antd";
import { useCartStore } from "@/store";

const OrderConfirmationPage = () => {
  const router = useRouter();
  const params = useParams();
  const { clearCart, setProcessingOrder } = useCartStore();

  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCleared, setCartCleared] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError("Invalid order ID");
        setLoading(false);
        return;
      }

      try {
        // Retry logic for potential timing issues with Firestore
        let attempts = 0;
        const maxAttempts = 3;
        let orderDoc;

        while (attempts < maxAttempts) {
          orderDoc = await getDoc(doc(db, "orders", id));

        if (orderDoc.exists()) {
            break;
          }

          attempts++;
          if (attempts < maxAttempts) {
            // Wait 1 second before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        if (orderDoc && orderDoc.exists()) {
          const data = orderDoc.data();

          // Ensure createdAt is properly handled
          const createdAt = data.createdAt?.toDate?.() || new Date();

          setOrder({
            id: orderDoc.id,
            ...data,
            createdAt,
          });
        } else {
          setError(
            "Order not found. If you just placed this order, please wait a moment and refresh the page."
          );
        }
      } catch (error) {
        setError(
          "Failed to load order details. Please try refreshing the page."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Clear cart when order is successfully loaded
  useEffect(() => {
    if (order && !cartCleared) {
      clearCart();
      setProcessingOrder(false);
      setCartCleared(true);
    }
  }, [order, cartCleared, clearCart, setProcessingOrder]);

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
        <div className="text-center max-w-md mx-auto px-4">
          <span className="material-icons-round text-red-500 text-6xl mb-4">
            error_outline
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Order Not Found"}
          </h1>
          <p className="text-gray-600 mb-6">
            {error?.includes("not found")
              ? "We couldn't find the order you're looking for. If you just placed this order, it might still be processing."
              : "We couldn't load the order details."}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                // Trigger re-fetch by changing the dependency
                window.location.reload();
              }}
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/orders"
              className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Orders
            </Link>
            <Link
              href="/products"
              className="block w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Continue Shopping
            </Link>
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
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-100">
            <span className="material-icons-round text-orange-600 text-5xl">
              check_circle
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thanks for your order!
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            We'll send you a confirmation email with your order details.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg text-base"
          >
            <span className="material-icons-round mr-2 text-xl">
              shopping_bag
            </span>
            Continue shopping
          </Link>
        </div>

        {/* Order Details Card */}
        <Card className="rounded-2xl shadow-xl overflow-hidden border-0">
          {/* Order Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 -mx-6 -mt-6 px-6 py-6 text-white mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-1">
                  Order #{id.slice(-6).toUpperCase()}
                </h2>
                <p className="text-orange-100">
                  Order Date: {format(order.createdAt, "PP")}
                </p>
              </div>
              <div className="mt-4 md:mt-0 space-x-4">
                <Button
                  type="default"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none inline-flex items-center shadow-md hover:shadow-lg px-6 py-2 h-auto text-base"
                  icon={
                    <span className="material-icons-round mr-2 text-xl">
                      download
                    </span>
                  }
                >
                  Download Invoice
                </Button>
                <Link href={`/orders/${id}`}>
                  <Button
                    type="primary"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none inline-flex items-center shadow-md hover:shadow-lg px-6 py-2 h-auto text-base"
                    icon={
                      <span className="material-icons-round mr-2 text-xl">
                        local_shipping
                      </span>
                    }
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
                className="flex items-center justify-between p-4 bg-orange-50/50 rounded-xl border border-orange-100"
              >
                <div className="flex items-center space-x-4">
                  {item.product.images?.[0] && (
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden border border-orange-100 shadow-sm">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAyMEgyNE0yMCAxNlYyNE0xMiAyMEM4LjY4NjI5IDIwIDYgMTcuMzEzNyA2IDE0QzYgMTAuNjg2MyA4LjY4NjI5IDggMTIgOEMyOCA4IDI4IDggMjggOEMzMS4zMTM3IDggMzQgMTAuNjg2MyAzNCAxNEMzNCAx 3LjMxMzcgMzEuMzEzNyAyMCAyOCAyMEgyNE0yMCAyOEMxNy4yMzg2IDI4IDE1IDI1Ljc2MTQgMTUgMjNWMjBIMjVWMjNDMjUgMjUuNzYxNCAyMi43NjE0IDI4IDIwIDI4WiIgc3Ryb2tlPSIjOTlBMUFBIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=";
                        }}
                        loading="lazy"
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
          <div className="border-t border-gray-100 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Item cost</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping cost</span>
                <span className="text-green-600 font-medium">Free</span>
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
              <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Cost</span>
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="grid md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-100">
            {/* Delivery Method */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Delivery Method
              </h3>
              <div className="flex items-start space-x-4 p-5 bg-gradient-to-br from-green-50 to-green-50/30 rounded-2xl border border-green-100 shadow-sm">
                <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-xl">
                  <span className="material-icons-round text-2xl text-green-600">
                    {order.deliveryOption.type === "deliver_to_location"
                      ? "local_shipping"
                      : "store"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">
                    {order.deliveryOption.type === "deliver_to_location"
                      ? "Deliver to Location"
                      : "Store Pickup"}
                  </p>
                  {order.deliveryOption.location && (
                    <div className="space-y-1">
                      <p className="text-gray-600 text-sm flex items-center">
                        <span className="material-icons-round text-green-500 mr-1 text-base">
                          apartment
                        </span>
                        Building: {order.deliveryOption.location.building}
                      </p>
                      <p className="text-gray-600 text-sm flex items-center">
                        <span className="material-icons-round text-green-500 mr-1 text-base">
                          meeting_room
                        </span>
                        Classroom: {order.deliveryOption.location.classroom}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Payment Method
              </h3>
              <div className="flex items-start space-x-4 p-5 bg-gradient-to-br from-pink-50 to-pink-50/30 rounded-2xl border border-pink-100 shadow-sm">
                <div className="w-12 h-12 flex items-center justify-center bg-pink-100 rounded-xl">
                  <span className="material-icons-round text-2xl text-pink-600">
                    {order.paymentMethod.type === "cash_on_delivery"
                      ? "payments"
                      : order.paymentMethod.type === "transfer"
                      ? "account_balance"
                      : order.paymentMethod.type === "card"
                      ? "credit_card"
                      : "payment"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">
                    {order.paymentMethod.type === "cash_on_delivery"
                      ? "Cash on Delivery"
                      : order.paymentMethod.type === "transfer"
                      ? "Bank Transfer"
                      : order.paymentMethod.type === "card"
                      ? "Credit/Debit Card"
                      : "Other"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {order.paymentMethod.type === "cash_on_delivery"
                      ? "Pay with cash when your order arrives"
                      : order.paymentMethod.type === "transfer"
                      ? "Payment will be processed through bank transfer"
                      : order.paymentMethod.type === "card"
                      ? "Payment processed securely via card"
                      : "Payment method selected"}
                  </p>

                  {/* Show transfer reference if available */}
                  {order.paymentMethod.type === "transfer" &&
                    order.paymentMethod.details?.transferReference && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-purple-200">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Transfer Reference ID:
                        </p>
                        <p className="text-sm font-mono text-purple-700 bg-purple-50 px-2 py-1 rounded">
                          {order.paymentMethod.details.transferReference}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Need Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="font-medium text-gray-900 mb-4">Need help?</h3>
            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
              <Link
                href="/help"
                className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-base"
              >
                <span className="material-icons-round mr-2 text-xl">
                  help_outline
                </span>
                Visit our help center
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md text-base"
              >
                <span className="material-icons-round mr-2 text-xl">
                  mail_outline
                </span>
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
