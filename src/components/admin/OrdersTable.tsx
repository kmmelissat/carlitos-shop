"use client";

import React, { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Input,
  Select,
  Button,
  Table,
  Tag,
  Space,
  Card,
  Typography,
  Tooltip,
  Empty,
} from "antd";
import { EyeOutlined, ShoppingOutlined } from "@ant-design/icons";
import { updateOrderStatus } from "@/lib/api";
import type { ColumnsType } from "antd/es/table";

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

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
  onOrdersUpdate?: (orders: Order[]) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  initialOrders,
  onOrdersUpdate,
}) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      completed: { color: "green", text: "Completed" },
      pending: { color: "gold", text: "Pending" },
      processing: { color: "blue", text: "Processing" },
      cancelled: { color: "red", text: "Cancelled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "default",
      text: status,
    };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getPaymentMethodText = (type: string) => {
    if (!type) return "💰 Not specified";

    const paymentTypes = {
      cash_on_delivery: "💵 Cash on Delivery",
      card: "💳 Credit Card",
      transfer: "🏦 Bank Transfer",
    };
    return paymentTypes[type as keyof typeof paymentTypes] || `💰 ${type}`;
  };

  const getDeliveryText = (type: string) => {
    if (!type) return "📦 Not specified";

    const deliveryTypes = {
      deliver_to_location: "🚚 Delivery",
      pickup: "🏪 Store Pickup",
    };
    return deliveryTypes[type as keyof typeof deliveryTypes] || `📦 ${type}`;
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
    console.log(`Updating order ${orderId} to status: ${newStatus}`);

    try {
      setUpdateLoading(orderId);

      // Make API call to update the order status
      await updateOrderStatus(orderId, newStatus);
      console.log(
        `Successfully updated order ${orderId} status to ${newStatus}`
      );

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

      // Update both orders and filteredOrders states
      setOrders(updatedOrders);

      // Notify parent component about the orders update for stats recalculation
      if (onOrdersUpdate) {
        onOrdersUpdate(updatedOrders);
      }

      // Apply filters to the updated orders to update filteredOrders
      let filtered = updatedOrders;

      // Apply status filter
      if (statusFilter !== "all") {
        filtered = filtered.filter(
          (order) => order.status?.status === statusFilter
        );
      }

      // Apply search filter
      if (searchTerm.trim()) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (order) =>
            order.id.toLowerCase().includes(search) ||
            order.userName.toLowerCase().includes(search) ||
            order.userEmail.toLowerCase().includes(search)
        );
      }

      setFilteredOrders(filtered);

      console.log(`Updated order ${orderId} locally. New status: ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      // Show error message to user
      alert(
        `Failed to update order status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setUpdateLoading(null);
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Order",
      dataIndex: "id",
      key: "order",
      width: 140,
      render: (id: string, record: Order) => (
        <div>
          <div className="font-semibold text-gray-900">
            #{id.slice(-6).toUpperCase()}
          </div>
          <div className="text-xs text-gray-500">
            {format(record.createdAt, "MMM d, HH:mm")}
          </div>
        </div>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      width: 200,
      render: (_, record: Order) => (
        <div>
          <div className="font-medium text-gray-900">{record.userName}</div>
          <div className="text-sm text-gray-500">{record.userEmail}</div>
        </div>
      ),
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      width: 80,
      align: "center",
      render: (items: any[]) => (
        <div className="flex items-center justify-center">
          <ShoppingOutlined className="mr-1 text-gray-400" />
          <span>{items?.length || 0}</span>
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 100,
      align: "right",
      render: (total: number) => (
        <span className="font-semibold">{formatPrice(total)}</span>
      ),
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Payment",
      dataIndex: "paymentMethod",
      key: "payment",
      width: 150,
      render: (paymentMethod: any) => (
        <span className="text-sm">
          {getPaymentMethodText(paymentMethod?.type || "")}
        </span>
      ),
    },
    {
      title: "Delivery",
      dataIndex: "deliveryOption",
      key: "delivery",
      width: 120,
      render: (deliveryOption: any) => (
        <span className="text-sm">
          {getDeliveryText(deliveryOption?.type || "")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: any, record: Order) => (
        <Select
          value={status?.status || "pending"}
          style={{ width: "100%" }}
          onChange={(value) => handleUpdateOrderStatus(record.id, value)}
          loading={updateLoading === record.id}
          size="small"
        >
          <Option value="pending">Pending</Option>
          <Option value="processing">Processing</Option>
          <Option value="completed">Completed</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      ),
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Processing", value: "processing" },
        { text: "Completed", value: "completed" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value, record) => record.status?.status === value,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      width: 100,
      render: (date: Date) => format(date, "MMM d, yyyy"),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      fixed: "right",
      align: "center",
      render: (_, record: Order) => (
        <Tooltip title="View Order Details">
          <Link href={`/orders/${record.id}/confirmation`}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              className="text-blue-600 hover:text-blue-800"
            />
          </Link>
        </Tooltip>
      ),
    },
  ];

  if (orders.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Title level={4} className="mb-2">
                  No orders yet
                </Title>
                <p className="text-gray-500">
                  Orders will appear here once customers start placing them.
                </p>
              </div>
            }
          />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <Title level={4} className="mb-0">
            All Orders ({filteredOrders.length})
          </Title>
          <Space className="mt-4 sm:mt-0">
            <Search
              placeholder="Search orders, customers, email..."
              allowClear
              style={{ width: 280 }}
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
          </Space>
        </div>
      }
      className="shadow-sm"
    >
      <Table<Order>
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        loading={loading}
        pagination={{
          total: filteredOrders.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} orders`,
        }}
        scroll={{ x: 1200 }}
        size="middle"
        locale={{
          emptyText: searchTerm ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={`No orders found matching "${searchTerm}"`}
            />
          ) : (
            <Empty description="No orders found" />
          ),
        }}
      />
    </Card>
  );
};

export default OrdersTable;
