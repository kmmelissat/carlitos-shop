"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { Card, Tag, Spin } from "antd";
import { format } from "date-fns";

interface OrdersSectionProps {
  userId: string;
}

const OrdersSection: React.FC<OrdersSectionProps> = ({ userId }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-10">
        <Spin size="large" />
      </div>
    );
  if (!orders.length)
    return (
      <div className="text-gray-500 text-center py-10">No orders found.</div>
    );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <Card
            key={order.id}
            className="rounded-xl shadow border border-gray-100"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div className="flex items-center space-x-4 mb-2 md:mb-0">
                <span className="font-semibold text-gray-900">
                  Order #{order.id.slice(-6).toUpperCase()}
                </span>
                <Tag
                  color={
                    order.status?.status === "pending"
                      ? "orange"
                      : order.status?.status === "confirmed"
                      ? "green"
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="text-gray-700 mb-1">
                  <span className="font-medium">Total:</span> $
                  {order.total?.toFixed(2) || "0.00"}
                </div>
                <div className="text-gray-700 mb-1">
                  <span className="font-medium">Items:</span>{" "}
                  {order.items
                    ?.map((item: any) => item.product?.name)
                    .join(", ")}
                </div>
                <div className="text-gray-700 mb-1">
                  <span className="font-medium">Payment:</span>{" "}
                  {order.paymentMethod?.type}
                </div>
                <div className="text-gray-700 mb-1">
                  <span className="font-medium">Delivery:</span>{" "}
                  {order.deliveryOption?.type}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrdersSection;
