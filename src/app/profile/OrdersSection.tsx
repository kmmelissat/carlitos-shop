"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { Card, Tag, Spin } from "antd";
import { format } from "date-fns";
import Link from "next/link";

interface OrdersSectionProps {
  userId: string;
  statusFilter?: string;
  sortOrder?: "newest" | "oldest";
}

const OrdersSection: React.FC<OrdersSectionProps> = ({
  userId,
  statusFilter,
  sortOrder = "newest",
}) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Start with base query
        let q = query(collection(db, "orders"), where("userId", "==", userId));

        // Add status filter if provided
        if (statusFilter) {
          q = query(q, where("status.status", "==", statusFilter));
        }

        // Add sort order
        q = query(
          q,
          orderBy("createdAt", sortOrder === "newest" ? "desc" : "asc")
        );

        const snapshot = await getDocs(q);
        setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId, statusFilter, sortOrder]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-10">
        <Spin size="large" />
      </div>
    );

  if (!orders.length)
    return (
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
    );

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card
          key={order.id}
          className="rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div className="flex items-center space-x-4 mb-2 md:mb-0">
              <Link
                href={`/orders/${order.id}`}
                className="font-mono text-orange-600 hover:text-orange-700 font-semibold"
              >
                #{order.id.slice(-6).toUpperCase()}
              </Link>
              <Tag
                color={
                  order.status?.status === "pending"
                    ? "orange"
                    : order.status?.status === "confirmed"
                    ? "green"
                    : order.status?.status === "delivered"
                    ? "blue"
                    : "default"
                }
              >
                {order.status?.status || "pending"}
              </Tag>
            </div>
            <div className="text-gray-500 text-sm">
              {order.createdAt?.toDate
                ? format(order.createdAt.toDate(), "PPpp")
                : format(new Date(order.createdAt), "PPpp")}
            </div>
          </div>

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
              <div className="space-y-1 text-sm">
                <div className="flex items-start">
                  <span className="material-icons-round text-gray-400 mr-2">
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
                <div className="flex items-center">
                  <span className="material-icons-round text-gray-400 mr-2">
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
              {order.items?.map((item: any) => (
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
        </Card>
      ))}
    </div>
  );
};

export default OrdersSection;
