"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Input,
  Select,
  Table,
  Tag,
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Space,
  Button,
  Modal,
  List,
  Avatar,
  Empty,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ShoppingOutlined,
  DollarOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  total: number;
  status: {
    status: string;
    updatedAt: Date;
    notes?: string;
  };
  items: any[];
  createdAt: Date;
}

interface CustomerWithStats extends Customer {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  averageOrderValue: number;
  status: "active" | "inactive" | "new";
}

interface CustomersManagementProps {
  initialCustomers: Customer[];
  orders: Order[];
}

const CustomersManagement: React.FC<CustomersManagementProps> = ({
  initialCustomers,
  orders,
}) => {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<
    CustomerWithStats[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerWithStats | null>(null);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

  // Enhanced customer data with statistics
  useEffect(() => {
    const enhancedCustomers = initialCustomers.map((customer) => {
      const customerOrders = orders.filter(
        (order) => order.userId === customer.id
      );
      const completedOrders = customerOrders.filter(
        (order) => order.status?.status === "completed"
      );

      const totalSpent = completedOrders.reduce(
        (sum, order) => sum + (order.total || 0),
        0
      );
      const totalOrders = customerOrders.length;
      const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

      const lastOrderDate =
        customerOrders.length > 0
          ? new Date(
              Math.max(
                ...customerOrders.map((order) =>
                  new Date(order.createdAt).getTime()
                )
              )
            )
          : undefined;

      // Determine customer status
      const daysSinceLastOrder = lastOrderDate
        ? Math.floor(
            (new Date().getTime() - lastOrderDate.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : Infinity;

      const daysSinceCreated = Math.floor(
        (new Date().getTime() - new Date(customer.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      let status: "active" | "inactive" | "new";
      if (daysSinceCreated <= 7) {
        status = "new";
      } else if (daysSinceLastOrder <= 30) {
        status = "active";
      } else {
        status = "inactive";
      }

      return {
        ...customer,
        totalOrders,
        totalSpent,
        lastOrderDate,
        averageOrderValue,
        status,
      };
    });

    setCustomers(enhancedCustomers);
    setFilteredCustomers(enhancedCustomers);
  }, [initialCustomers, orders]);

  // Filter customers based on search and status
  useEffect(() => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (customer.phone && customer.phone.includes(searchTerm))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (customer) => customer.status === statusFilter
      );
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, statusFilter]);

  // Calculate statistics
  const stats = {
    total: customers.length,
    new: customers.filter((c) => c.status === "new").length,
    active: customers.filter((c) => c.status === "active").length,
    inactive: customers.filter((c) => c.status === "inactive").length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    averageOrderValue:
      customers.length > 0
        ? customers.reduce((sum, c) => sum + c.averageOrderValue, 0) /
          customers.length
        : 0,
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "blue";
      case "active":
        return "green";
      case "inactive":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "new":
        return "New Customer";
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      default:
        return status;
    }
  };

  const handleViewCustomer = (customer: CustomerWithStats) => {
    setSelectedCustomer(customer);
    const customerOrdersList = orders.filter(
      (order) => order.userId === customer.id
    );
    setCustomerOrders(customerOrdersList);
    setCustomerModalVisible(true);
  };

  const columns: ColumnsType<CustomerWithStats> = [
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar
            size={40}
            src={record.avatar}
            icon={<UserOutlined />}
            className="bg-purple-100 text-purple-600"
          />
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
      width: 250,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      filters: [
        { text: "New Customer", value: "new" },
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      width: 120,
    },
    {
      title: "Orders",
      dataIndex: "totalOrders",
      key: "totalOrders",
      render: (orders) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{orders}</div>
          <div className="text-xs text-gray-500">orders</div>
        </div>
      ),
      sorter: (a, b) => a.totalOrders - b.totalOrders,
      width: 100,
    },
    {
      title: "Total Spent",
      dataIndex: "totalSpent",
      key: "totalSpent",
      render: (amount) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {formatPrice(amount)}
          </div>
          <div className="text-xs text-gray-500">lifetime</div>
        </div>
      ),
      sorter: (a, b) => a.totalSpent - b.totalSpent,
      width: 120,
    },
    {
      title: "Average Order",
      dataIndex: "averageOrderValue",
      key: "averageOrderValue",
      render: (avg) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {formatPrice(avg)}
          </div>
          <div className="text-xs text-gray-500">average</div>
        </div>
      ),
      sorter: (a, b) => a.averageOrderValue - b.averageOrderValue,
      width: 120,
    },
    {
      title: "Last Order",
      dataIndex: "lastOrderDate",
      key: "lastOrderDate",
      render: (date) =>
        date ? (
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">
              {format(date, "MMM d, yyyy")}
            </div>
            <div className="text-xs text-gray-500">
              {format(date, "h:mm a")}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 text-sm">No orders</div>
        ),
      sorter: (a, b) => {
        if (!a.lastOrderDate) return 1;
        if (!b.lastOrderDate) return -1;
        return b.lastOrderDate.getTime() - a.lastOrderDate.getTime();
      },
      width: 120,
    },
    {
      title: "Member Since",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">
            {format(date, "MMM d, yyyy")}
          </div>
          <div className="text-xs text-gray-500">
            {Math.floor(
              (new Date().getTime() - new Date(date).getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            days
          </div>
        </div>
      ),
      sorter: (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      width: 120,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewCustomer(record)}
          size="small"
          className="bg-purple-600 hover:bg-purple-700"
        >
          View Details
        </Button>
      ),
      width: 120,
      align: "center",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <Statistic
              title={
                <span className="text-blue-700 font-medium">
                  Total Customers
                </span>
              }
              value={stats.total}
              prefix={<UserOutlined className="text-blue-600" />}
              valueStyle={{
                color: "#1d4ed8",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <Statistic
              title={
                <span className="text-green-700 font-medium">
                  Active Customers
                </span>
              }
              value={stats.active}
              prefix={<span className="text-green-600">✅</span>}
              valueStyle={{
                color: "#16a34a",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <Statistic
              title={
                <span className="text-purple-700 font-medium">
                  New Customers
                </span>
              }
              value={stats.new}
              prefix={<span className="text-purple-600">✨</span>}
              valueStyle={{
                color: "#9333ea",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <Statistic
              title={
                <span className="text-orange-700 font-medium">
                  Total Revenue
                </span>
              }
              value={formatPrice(stats.totalRevenue)}
              prefix={<DollarOutlined className="text-orange-600" />}
              valueStyle={{
                color: "#ea580c",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card className="shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div>
            <Title level={3} className="mb-2 flex items-center">
              <span className="text-purple-600 mr-2">👥</span>
              Customer Directory
            </Title>
            <Text type="secondary">
              Showing {filteredCustomers.length} of {customers.length} customers
            </Text>
          </div>
          <Space size="middle" wrap>
            <Search
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value="all">All Status</Option>
              <Option value="new">New</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Space>
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="shadow-lg">
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} customers`,
          }}
          scroll={{ x: 1000 }}
          className="ant-table-striped"
        />
      </Card>

      {/* Customer Details Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-3">
            <Avatar
              size={48}
              src={selectedCustomer?.avatar}
              icon={<UserOutlined />}
              className="bg-purple-100 text-purple-600"
            />
            <div>
              <div className="text-lg font-semibold">
                {selectedCustomer?.name}
              </div>
              <Tag color={getStatusColor(selectedCustomer?.status || "")}>
                {getStatusText(selectedCustomer?.status || "")}
              </Tag>
            </div>
          </div>
        }
        open={customerModalVisible}
        onCancel={() => setCustomerModalVisible(false)}
        footer={null}
        width={800}
        className="customer-details-modal"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card size="small" className="bg-gray-50">
                <div className="flex items-center space-x-2">
                  <MailOutlined className="text-blue-500" />
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-medium">{selectedCustomer.email}</div>
                  </div>
                </div>
              </Card>
              {selectedCustomer.phone && (
                <Card size="small" className="bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <PhoneOutlined className="text-green-500" />
                    <div>
                      <div className="text-xs text-gray-500">Phone</div>
                      <div className="font-medium">
                        {selectedCustomer.phone}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              <Card size="small" className="bg-gray-50">
                <div className="flex items-center space-x-2">
                  <CalendarOutlined className="text-purple-500" />
                  <div>
                    <div className="text-xs text-gray-500">Member Since</div>
                    <div className="font-medium">
                      {format(selectedCustomer.createdAt, "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
              </Card>
              <Card size="small" className="bg-gray-50">
                <div className="flex items-center space-x-2">
                  <DollarOutlined className="text-orange-500" />
                  <div>
                    <div className="text-xs text-gray-500">Total Spent</div>
                    <div className="font-medium">
                      {formatPrice(selectedCustomer.totalSpent)}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Customer Statistics */}
            <Row gutter={16}>
              <Col span={8}>
                <Card size="small" className="text-center bg-blue-50">
                  <Statistic
                    title="Total Orders"
                    value={selectedCustomer.totalOrders}
                    prefix={<ShoppingOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" className="text-center bg-green-50">
                  <Statistic
                    title="Average Order"
                    value={formatPrice(selectedCustomer.averageOrderValue)}
                    prefix={<DollarOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" className="text-center bg-purple-50">
                  <Statistic
                    title="Last Order"
                    value={
                      selectedCustomer.lastOrderDate
                        ? format(selectedCustomer.lastOrderDate, "MMM d")
                        : "Never"
                    }
                    prefix={<CalendarOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            {/* Order History */}
            <div>
              <Title level={5} className="mb-3">
                Order History ({customerOrders.length})
              </Title>
              {customerOrders.length > 0 ? (
                <List
                  dataSource={customerOrders.slice(0, 5)}
                  renderItem={(order) => (
                    <List.Item className="border rounded-lg mb-2 px-4">
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <div className="font-medium">
                            Order #{order.id.slice(-6).toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(order.createdAt, "MMM d, yyyy h:mm a")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {formatPrice(order.total)}
                          </div>
                          <Tag
                            color={
                              order.status?.status === "completed"
                                ? "green"
                                : order.status?.status === "pending"
                                ? "gold"
                                : "blue"
                            }
                          >
                            {order.status?.status || "pending"}
                          </Tag>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="No orders yet" />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomersManagement;
