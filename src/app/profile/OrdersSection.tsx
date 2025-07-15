"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { Card, Tag, Spin, Alert, Empty } from "antd";
import { format } from "date-fns";
import Link from "next/link";

interface OrderStatus {
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  notes: string;
  updatedAt: any;
}

interface DeliveryOption {
  type: string;
  location?: {
    building: string;
    classroom: string;
  };
}

interface PaymentMethod {
  type: string;
}

interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    images?: string[];
  };
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryOption: DeliveryOption;
  customerNotes?: string;
  createdAt: any;
  updatedAt: any;
}

interface OrdersSectionProps {
  userId: string;
  statusFilter?: string;
  sortOrder?: "newest" | "oldest";
}

// Move getStatusColor outside of OrdersSection component to make it accessible to both components
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "orange";
    case "confirmed":
      return "green";
    case "delivered":
      return "blue";
    case "cancelled":
      return "red";
    default:
      return "default";
  }
};

// Move formatDate outside of OrdersSection component to make it accessible to both components
const formatDate = (timestamp: any) => {
  try {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return format(date, "PPpp");
  } catch (error) {
    return "Invalid date";
  }
};

const OrdersSection: React.FC<OrdersSectionProps> = ({
  userId,
  statusFilter,
  sortOrder = "newest",
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        // Create a more efficient query
        const ordersRef = collection(db, "orders");
        const baseQuery = query(ordersRef, where("userId", "==", userId));

        let finalQuery;
        try {
          // Try to add the orderBy clause
          finalQuery = query(
            baseQuery,
            orderBy("createdAt", sortOrder === "newest" ? "desc" : "asc")
          );
          const snapshot = await getDocs(finalQuery);
          setOrders(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Order[]
          );
        } catch (indexError: any) {
          if (indexError.message?.includes("requires an index")) {
            // If index error, try to get data without sorting
            console.log("Index not ready, fetching without sort...");
            const snapshot = await getDocs(baseQuery);
            const unsortedOrders = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Order[];

            // Sort in memory while index builds
            const sortedOrders = unsortedOrders.sort((a, b) => {
              const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
              const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
              return sortOrder === "newest"
                ? dateB.getTime() - dateA.getTime()
                : dateA.getTime() - dateB.getTime();
            });

            setOrders(sortedOrders);
            setError(
              "Note: We're optimizing the database for better performance. Some features may be limited temporarily."
            );
          } else {
            throw indexError;
          }
        }
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        setError(
          error.message?.includes("requires an index")
            ? "We're setting up the database for first use. Please wait a few minutes and try again."
            : "Failed to load orders. Please try again later."
        );
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, statusFilter, sortOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert
          message={
            error.includes("optimizing")
              ? "Optimization in Progress"
              : "Loading Error"
          }
          description={error}
          type={error.includes("optimizing") ? "info" : "warning"}
          showIcon
          className="mb-6"
          action={
            error.includes("optimizing") ? null : (
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Try Again
              </button>
            )
          }
        />
        {orders.length > 0 && <OrdersList orders={orders} />}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="text-center py-10">
            <span className="material-icons-round text-gray-400 text-5xl mb-4">
              receipt_long
            </span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 mb-6">
              {statusFilter
                ? `No ${statusFilter} orders found.`
                : "You haven't placed any orders yet."}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <span className="material-icons-round mr-2">shopping_bag</span>
              Start Shopping
            </Link>
          </div>
        }
      />
    );
  }

  return <OrdersList orders={orders} />;
};

const OrdersList: React.FC<{ orders: Order[] }> = ({ orders }) => (
  <div className="space-y-6">
    {orders.map((order) => (
      <Card
        key={order.id}
        className="rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        {/* Order Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex items-center space-x-4 mb-2 md:mb-0">
            <Link
              href={`/orders/${order.id}`}
              className="font-mono text-orange-600 hover:text-orange-700 font-semibold"
            >
              #{order.id.slice(-6).toUpperCase()}
            </Link>
            <Tag color={getStatusColor(order.status?.status)}>
              {order.status?.status || "pending"}
            </Tag>
          </div>
          <div className="text-gray-500 text-sm">
            {formatDate(order.createdAt)}
          </div>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Order Details */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  ${order.subtotal?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">${order.tax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold text-orange-600">
                  ${order.total?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Delivery & Payment
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <span className="material-icons-round text-gray-400">
                  local_shipping
                </span>
                <div>
                  <span className="text-gray-600">Delivery Method:</span>
                  <p className="font-medium">{order.deliveryOption?.type}</p>
                  {order.deliveryOption?.location && (
                    <p className="text-gray-500 text-xs mt-1">
                      {order.deliveryOption.location.building} -{" "}
                      {order.deliveryOption.location.classroom}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="material-icons-round text-gray-400">
                  payments
                </span>
                <div>
                  <span className="text-gray-600">Payment Method:</span>
                  <p className="font-medium">{order.paymentMethod?.type}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Items</h4>
          <div className="space-y-2">
            {order.items?.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">
                    {item.product.name}
                  </span>
                  <span className="text-gray-500 mx-2">×</span>
                  <span className="text-gray-600">{item.quantity}</span>
                </div>
                <span className="font-medium">
                  ${(item.quantity * item.product.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {order.customerNotes && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center mb-1">
              <span className="material-icons-round text-yellow-600 mr-2 text-sm">
                sticky_note_2
              </span>
              <span className="text-sm font-medium text-gray-900">Notes</span>
            </div>
            <p className="text-sm text-gray-600">{order.customerNotes}</p>
          </div>
        )}

        {/* Status Notes */}
        {order.status?.notes && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-1">
              <span className="material-icons-round text-blue-600 mr-2 text-sm">
                info
              </span>
              <span className="text-sm font-medium text-gray-900">
                Status Update
              </span>
            </div>
            <p className="text-sm text-gray-600">{order.status.notes}</p>
            <p className="text-xs text-gray-500 mt-1">
              Updated: {formatDate(order.status.updatedAt)}
            </p>
          </div>
        )}
      </Card>
    ))}
  </div>
);

export default OrdersSection;
