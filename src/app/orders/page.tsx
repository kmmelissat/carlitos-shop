"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, Radio, Card, Button } from "antd";
import { useAuth } from "@/store";
import OrdersSection from "@/app/profile/OrdersSection";

const { Option } = Select;

const OrdersPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

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

  // Show sign in prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-8">
          <span className="material-icons-round text-orange-600 text-5xl mb-4">
            account_circle
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to view your orders
          </h1>
          <p className="text-gray-600 mb-6">
            Sign in to access your order history and track your deliveries.
          </p>
          <Button
            type="primary"
            size="large"
            onClick={() => router.push("/auth/login")}
            className="w-full h-12 text-lg font-semibold"
          >
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>

          {/* Filters */}
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-full sm:w-40"
              placeholder="Filter by status"
            >
              <Option value="all">All Orders</Option>
              <Option value="pending">Pending</Option>
              <Option value="confirmed">Confirmed</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>

            <Radio.Group
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="flex"
            >
              <Radio.Button value="newest">Newest First</Radio.Button>
              <Radio.Button value="oldest">Oldest First</Radio.Button>
            </Radio.Group>
          </div>
        </div>

        {/* Orders List */}
        <OrdersSection
          userId={user.id}
          statusFilter={statusFilter === "all" ? undefined : statusFilter}
          sortOrder={sortOrder}
        />
      </div>
    </div>
  );
};

export default OrdersPage;
