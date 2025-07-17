"use client";

import React from "react";
import { Card, Row, Col, Statistic, Typography, Table, Tag } from "antd";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const { Title, Text } = Typography;

interface RevenueData {
  date: string;
  formattedDate: string;
  revenue: number;
  orders: number;
}

interface BestSellingProduct {
  productId: string;
  name: string;
  sales: number;
  revenue: number;
}

interface HourlyData {
  hour: number;
  formattedHour: string;
  orders: number;
  revenue: number;
}

interface WeeklyComparison {
  thisWeek: { revenue: number; orders: number };
  lastWeek: { revenue: number; orders: number };
  changes: { revenue: number; orders: number };
}

interface SalesDashboardProps {
  revenueData: RevenueData[];
  bestSellingProducts: BestSellingProduct[];
  hourlyData: HourlyData[];
  weeklyComparison: WeeklyComparison;
}

const SalesDashboard: React.FC<SalesDashboardProps> = ({
  revenueData,
  bestSellingProducts,
  hourlyData,
  weeklyComparison,
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Orange-red color scheme for charts (matching app theme)
  const chartColors = {
    primary: "#f97316", // orange-600
    secondary: "#ea580c", // orange-700
    gradient: ["#f97316", "#ea580c", "#dc2626", "#b91c1c", "#991b1b"],
    area: {
      stroke: "#f97316",
      fill: "url(#colorRevenue)",
    },
  };

  // Prepare data for pie chart (top 5 products) with orange theme colors
  const pieData = bestSellingProducts.slice(0, 5).map((product, index) => ({
    name:
      product.name.length > 20
        ? product.name.substring(0, 20) + "..."
        : product.name,
    value: product.sales,
    fullName: product.name,
    color: chartColors.gradient[index % chartColors.gradient.length],
  }));

  // Custom tooltip for revenue chart
  const RevenueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-orange-200 rounded-xl shadow-xl">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-orange-600 font-medium">
              💰 Revenue: {formatPrice(payload[0].value)}
            </p>
            <p className="text-blue-600 font-medium">
              🛍️ Orders: {payload[1]?.value || 0}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for hourly chart
  const HourlyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-orange-200 rounded-xl shadow-xl">
          <p className="font-semibold text-gray-900 mb-2">🕒 {label}</p>
          <div className="space-y-1">
            <p className="text-orange-600 font-medium">
              🛍️ Orders: {payload[0].value}
            </p>
            <p className="text-red-600 font-medium">
              💰 Revenue: {formatPrice(payload[1]?.value || 0)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Table columns for best selling products with orange theme
  const productColumns = [
    {
      title: "Rank",
      key: "rank",
      width: 70,
      render: (_: any, __: any, index: number) => (
        <div className="flex items-center justify-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              index === 0
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                : index === 1
                ? "bg-gradient-to-r from-gray-300 to-gray-400 text-white"
                : index === 2
                ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                : "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700"
            }`}
          >
            {index + 1}
          </div>
        </div>
      ),
    },
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <div className="font-semibold text-gray-900">{name}</div>
      ),
    },
    {
      title: "Units Sold",
      dataIndex: "sales",
      key: "sales",
      align: "center" as const,
      render: (sales: number) => (
        <div className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-3 py-1 rounded-full font-medium text-sm">
          {sales}
        </div>
      ),
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      align: "right" as const,
      render: (revenue: number) => (
        <div className="font-bold text-orange-600">{formatPrice(revenue)}</div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="material-icons-round text-5xl text-orange-600 mr-4 animate-pulse">
              analytics
            </span>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Sales Analytics Dashboard
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive insights into your store's performance and sales
            trends
          </p>
        </div>

        {/* Weekly Comparison Cards */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="material-icons-round text-white text-xl">
                    attach_money
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    This Week Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(weeklyComparison.thisWeek.revenue)}
                  </p>
                  <div
                    className={`flex items-center text-sm mt-1 ${
                      weeklyComparison.changes.revenue >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    <span className="material-icons-round text-sm mr-1">
                      {weeklyComparison.changes.revenue >= 0
                        ? "trending_up"
                        : "trending_down"}
                    </span>
                    {Math.abs(weeklyComparison.changes.revenue)}%
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="material-icons-round text-white text-xl">
                    shopping_cart
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    This Week Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {weeklyComparison.thisWeek.orders}
                  </p>
                  <div
                    className={`flex items-center text-sm mt-1 ${
                      weeklyComparison.changes.orders >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    <span className="material-icons-round text-sm mr-1">
                      {weeklyComparison.changes.orders >= 0
                        ? "trending_up"
                        : "trending_down"}
                    </span>
                    {Math.abs(weeklyComparison.changes.orders)}%
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="material-icons-round text-white text-xl">
                    attach_money
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Last Week Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(weeklyComparison.lastWeek.revenue)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Previous period</p>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="material-icons-round text-white text-xl">
                    shopping_cart
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Last Week Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {weeklyComparison.lastWeek.orders}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Previous period</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Charts Row */}
        <Row gutter={[16, 16]} className="mb-8">
          {/* Revenue Trends Chart */}
          <Col xs={24} lg={16}>
            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
              <div className="flex items-center mb-6">
                <span className="material-icons-round text-orange-600 text-2xl mr-3">
                  trending_up
                </span>
                <h3 className="text-xl font-bold text-gray-900">
                  Revenue Trends (Last 30 Days)
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#f97316"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="formattedDate"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    interval={4}
                    stroke="#d1d5db"
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    stroke="#d1d5db"
                  />
                  <Tooltip content={<RevenueTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f97316"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Col>

          {/* Best Selling Products Pie Chart */}
          <Col xs={24} lg={8}>
            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
              <div className="flex items-center mb-6">
                <span className="material-icons-round text-orange-600 text-2xl mr-3">
                  star
                </span>
                <h3 className="text-xl font-bold text-gray-900">
                  Top Products
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#f97316"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any, props: any) => [
                      `${value} units`,
                      props.payload.fullName,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>

        {/* Second Row of Charts */}
        <Row gutter={[16, 16]} className="mb-8">
          {/* Peak Sales Hours */}
          <Col xs={24} lg={14}>
            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
              <div className="flex items-center mb-6">
                <span className="material-icons-round text-orange-600 text-2xl mr-3">
                  schedule
                </span>
                <h3 className="text-xl font-bold text-gray-900">
                  Peak Sales Hours
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="formattedHour"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    interval={1}
                    stroke="#d1d5db"
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    stroke="#d1d5db"
                  />
                  <Tooltip content={<HourlyTooltip />} />
                  <Bar
                    dataKey="orders"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Col>

          {/* Best Selling Products Table */}
          <Col xs={24} lg={10}>
            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
              <div className="flex items-center mb-6">
                <span className="material-icons-round text-orange-600 text-2xl mr-3">
                  emoji_events
                </span>
                <h3 className="text-xl font-bold text-gray-900">
                  Best Sellers
                </h3>
              </div>
              <Table
                columns={productColumns}
                dataSource={bestSellingProducts}
                pagination={false}
                size="small"
                rowKey="productId"
                scroll={{ y: 280 }}
                className="custom-table"
              />
            </div>
          </Col>
        </Row>
      </div>

      <style jsx global>{`
        .custom-table .ant-table-thead > tr > th {
          background: linear-gradient(to right, #fef7f0, #fef2f2) !important;
          border-bottom: 2px solid #fed7aa !important;
          font-weight: 600 !important;
          color: #ea580c !important;
        }
        .custom-table .ant-table-tbody > tr:hover > td {
          background: #fef7f0 !important;
        }
      `}</style>
    </div>
  );
};

export default SalesDashboard;
