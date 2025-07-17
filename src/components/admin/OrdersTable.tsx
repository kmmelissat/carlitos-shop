"use client";

import React, { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Input, Select, Button } from "antd";
import { updateOrderStatus } from "@/lib/api";

const { Search } = Input;
const { Option } = Select;

interface Order {
  id: string;
  userName: string;
  userEmail: string;
  total: number;
  status: {
    status: string;
    updatedAt: Date;
    notes?: string;
  };
  paymentMethod: {
    type: string;
    details?: any;
  };
  deliveryOption: {
    type: string;
    location?: any;
  };
  items: any[];
  createdAt: Date;
}

interface OrdersTableProps {
  initialOrders: Order[];
}

const OrdersTable: React.FC<OrdersTableProps> = ({ initialOrders }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200";
      case "pending":
        return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "processing":
        return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200";
      case "cancelled":
        return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200";
      default:
        return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "cash_on_delivery":
        return "💵";
      case "card":
        return "💳";
      case "transfer":
        return "🏦";
      default:
        return "💰";
    }
  };

  const getDeliveryIcon = (type: string) => {
    switch (type) {
      case "deliver_to_location":
        return "🚚";
      case "pickup":
        return "🏪";
      default:
        return "📦";
    }
  };

  // Filter and search functionality
  const applyFilters = (searchValue: string, statusValue: string) => {
    let filtered = orders;

    // Apply status filter
    if (statusValue !== "all") {
      filtered = filtered.filter(
        (order) => order.status?.status === statusValue
      );
    }

    // Apply search filter
    if (searchValue.trim()) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(search) ||
          order.userName.toLowerCase().includes(search) ||
          order.userEmail.toLowerCase().includes(search)
      );
    }

    setFilteredOrders(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, statusFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    applyFilters(searchTerm, value);
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string
  ) => {
    try {
      setUpdateLoading(orderId);

      // Make API call to update the order status
      await updateOrderStatus(orderId, newStatus);

      // Update local state after successful API call
      const updatedOrders = orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: {
                ...order.status,
                status: newStatus,
                updatedAt: new Date(),
              },
            }
          : order
      );

      setOrders(updatedOrders);
      applyFilters(searchTerm, statusFilter);
    } catch (error) {
      console.error("Error updating order status:", error);
      // Show error message to user
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdateLoading(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Orders</h3>
        </div>
        <div className="text-center py-12">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-500 mb-4">
            Orders will appear here once customers start placing them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">
            All Orders ({filteredOrders.length})
          </h3>

          <div className="flex flex-col sm:flex-row gap-4">
            <Search
              placeholder="Search orders, customers, email..."
              allowClear
              style={{ width: 250 }}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <Select
              value={statusFilter}
              style={{ width: 150 }}
              onChange={handleStatusFilter}
            >
              <Option value="all">All Status</Option>
              <Option value="pending">Pending</Option>
              <Option value="processing">Processing</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{order.id.slice(-6).toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(order.createdAt, "MMM d, HH:mm")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.userName}
                  </div>
                  <div className="text-sm text-gray-500">{order.userEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.items?.length || 0} items
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatPrice(order.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <span className="mr-2">
                      {getPaymentMethodIcon(order.paymentMethod?.type)}
                    </span>
                    <span className="capitalize">
                      {order.paymentMethod?.type?.replace("_", " ")}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <span className="mr-2">
                      {getDeliveryIcon(order.deliveryOption?.type)}
                    </span>
                    <span className="capitalize">
                      {order.deliveryOption?.type === "deliver_to_location"
                        ? "Delivery"
                        : "Pickup"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Select
                    value={order.status?.status || "pending"}
                    style={{ width: 120 }}
                    onChange={(value) =>
                      handleUpdateOrderStatus(order.id, value)
                    }
                    loading={updateLoading === order.id}
                    size="small"
                  >
                    <Option value="pending">Pending</Option>
                    <Option value="processing">Processing</Option>
                    <Option value="completed">Completed</Option>
                    <Option value="cancelled">Cancelled</Option>
                  </Select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(order.createdAt, "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/orders/${order.id}/confirmation`}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Order"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No orders found matching "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
