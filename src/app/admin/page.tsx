import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-server";
import {
  getAdminStatsServer,
  getRecentOrdersServer,
  getWeeklyComparisonServer,
  getBestSellingProductsServer,
  getProductsServer,
} from "@/lib/api-server";
import { format } from "date-fns";

const AdminDashboard = async () => {
  // Check authentication server-side
  try {
    const user = await requireAdmin();

    // Fetch comprehensive data from the database
    const [
      stats,
      recentOrders,
      weeklyComparison,
      bestSellingProducts,
      allProducts,
    ] = await Promise.all([
      getAdminStatsServer(),
      getRecentOrdersServer(),
      getWeeklyComparisonServer(),
      getBestSellingProductsServer(),
      getProductsServer(),
    ]);

    const formatPrice = (price: number): string => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
    };

    const getStatusBadge = (status: string) => {
      switch (status) {
        case "completed":
          return "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800";
        case "pending":
          return "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800";
        case "processing":
          return "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800";
        default:
          return "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800";
      }
    };

    const getRelativeTime = (date: Date) => {
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
      if (diffInMinutes < 1440)
        return `${Math.floor(diffInMinutes / 60)} hours ago`;
      return format(date, "MMM d");
    };

    // Get low stock products (stock <= 5)
    const lowStockProducts = allProducts.filter(
      (product) => product.stock <= 5 && product.stock > 0
    );
    const outOfStockProducts = allProducts.filter(
      (product) => product.stock === 0
    );

    // Get top customers from recent orders
    const customerStats = recentOrders.reduce((acc: any, order) => {
      const customerId = order.userId || "unknown";
      const customerName = order.userName || "Unknown Customer";

      if (!acc[customerId]) {
        acc[customerId] = {
          id: customerId,
          name: customerName,
          orders: 0,
          totalSpent: 0,
        };
      }

      acc[customerId].orders += 1;
      acc[customerId].totalSpent += order.total || 0;

      return acc;
    }, {});

    const topCustomers = Object.values(customerStats)
      .sort((a: any, b: any) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    // Calculate trend indicators
    const revenueTrend = weeklyComparison.changes?.revenue || 0;
    const ordersTrend = weeklyComparison.changes?.orders || 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
        {/* Enhanced Header */}
        <div className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Welcome back,{" "}
                  <span className="font-semibold text-orange-600">
                    {user.name}
                  </span>{" "}
                  - CarlitosStore Management
                </p>
              </div>

              {/* Quick Search */}
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search products, orders..."
                    className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </span>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center space-x-2">
                  <Link
                    href="/admin/analytics"
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 text-sm font-medium shadow-md"
                  >
                    📊 Analytics
                  </Link>
                  <Link
                    href="/admin/products"
                    className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-2 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 text-sm font-medium shadow-md"
                  >
                    📦 Products
                  </Link>
                  <Link
                    href="/admin/orders"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-md"
                  >
                    📋 Orders
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">💰</span>
                </div>
                <div
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                    revenueTrend >= 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <span>{revenueTrend >= 0 ? "↗️" : "↘️"}</span>
                  <span>{Math.abs(revenueTrend).toFixed(1)}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(stats.revenue)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  From {stats.completedOrders} completed orders
                </p>
              </div>
            </div>

            {/* Products Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">📦</span>
                </div>
                <div
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                    stats.outOfStock > 0
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  <span>{stats.outOfStock > 0 ? "⚠️" : "✅"}</span>
                  <span>
                    {stats.outOfStock === 0
                      ? "All stocked"
                      : `${stats.outOfStock} empty`}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalProducts}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {stats.activeProducts} in stock, {stats.outOfStock} out of
                  stock
                </p>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">📋</span>
                </div>
                <div
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                    ordersTrend >= 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <span>{ordersTrend >= 0 ? "↗️" : "↘️"}</span>
                  <span>{Math.abs(ordersTrend).toFixed(1)}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOrders}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {stats.pendingOrders} pending, {stats.completedOrders}{" "}
                  completed
                </p>
              </div>
            </div>

            {/* Customers Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">👥</span>
                </div>
                <div
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                    stats.newCustomers > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <span>✨</span>
                  <span>{stats.newCustomers} new</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCustomers}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {stats.newCustomers} joined this month
                </p>
              </div>
            </div>
          </div>

          {/* Alerts and Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Low Stock Alerts */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  Inventory Alerts
                </h3>
                <span className="text-sm text-gray-500">
                  {lowStockProducts.length + outOfStockProducts.length} items
                </span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {outOfStockProducts.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-red-600">Out of stock</p>
                    </div>
                    <span className="text-red-500 font-semibold">0</span>
                  </div>
                ))}
                {lowStockProducts.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-yellow-600">Low stock</p>
                    </div>
                    <span className="text-yellow-600 font-semibold">
                      {product.stock}
                    </span>
                  </div>
                ))}
                {lowStockProducts.length + outOfStockProducts.length === 0 && (
                  <div className="text-center py-6">
                    <span className="text-green-500 text-2xl">✅</span>
                    <p className="text-sm text-gray-500 mt-2">
                      All products well stocked!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Customers */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="text-purple-500 mr-2">🏆</span>
                  Top Customers
                </h3>
                <Link
                  href="/admin/customers"
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {topCustomers.map((customer: any, index) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-900">
                          {customer.name}
                        </p>
                        <p className="text-xs text-purple-600">
                          {customer.orders} orders
                        </p>
                      </div>
                    </div>
                    <span className="text-purple-600 font-semibold text-sm">
                      {formatPrice(customer.totalSpent)}
                    </span>
                  </div>
                ))}
                {topCustomers.length === 0 && (
                  <div className="text-center py-6">
                    <span className="text-gray-400 text-2xl">👥</span>
                    <p className="text-sm text-gray-500 mt-2">
                      No customer data yet
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Best Selling Products */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="text-orange-500 mr-2">🔥</span>
                  Best Sellers
                </h3>
                <Link
                  href="/admin/analytics"
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  Analytics
                </Link>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {bestSellingProducts.slice(0, 5).map((product: any, index) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-orange-600">
                          {product.sales} sold
                        </p>
                      </div>
                    </div>
                    <span className="text-orange-600 font-semibold text-sm">
                      {formatPrice(product.revenue)}
                    </span>
                  </div>
                ))}
                {bestSellingProducts.length === 0 && (
                  <div className="text-center py-6">
                    <span className="text-gray-400 text-2xl">📦</span>
                    <p className="text-sm text-gray-500 mt-2">
                      No sales data yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Enhanced Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <span className="text-blue-500 mr-2">⚡</span>
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/admin/products/new"
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-200 border border-orange-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <span className="text-white text-lg">➕</span>
                    </div>
                    <div>
                      <span className="font-medium text-orange-900 block">
                        Add Product
                      </span>
                      <span className="text-orange-600 text-sm">
                        Create new item
                      </span>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/orders"
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 border border-blue-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <span className="text-white text-lg">📋</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-900 block">
                        Manage Orders
                      </span>
                      <span className="text-blue-600 text-sm">
                        {stats.pendingOrders} pending
                      </span>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/analytics"
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-200 border border-purple-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <span className="text-white text-lg">📊</span>
                    </div>
                    <div>
                      <span className="font-medium text-purple-900 block">
                        View Analytics
                      </span>
                      <span className="text-purple-600 text-sm">
                        Sales insights
                      </span>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/"
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <span className="text-white text-lg">🏪</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 block">
                        View Store
                      </span>
                      <span className="text-gray-600 text-sm">
                        Customer view
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Enhanced Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <span className="text-green-500 mr-2">🔔</span>
                Recent Activity
              </h3>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {recentOrders.slice(0, 8).map((order, index) => (
                  <div
                    key={order.id}
                    className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        order.status?.status === "completed"
                          ? "bg-green-500"
                          : order.status?.status === "pending"
                          ? "bg-yellow-500"
                          : order.status?.status === "processing"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </p>
                        <span
                          className={getStatusBadge(
                            order.status?.status || "pending"
                          )}
                        >
                          {(order.status?.status || "pending")
                            .charAt(0)
                            .toUpperCase() +
                            (order.status?.status || "pending").slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          {order.userName || "Unknown Customer"}
                        </p>
                        <p className="text-xs font-medium text-gray-900">
                          {formatPrice(order.total || 0)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {getRelativeTime(order.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <div className="text-center py-8">
                    <span className="text-gray-400 text-3xl">📋</span>
                    <p className="text-sm text-gray-500 mt-2">
                      No recent activity
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Recent Orders Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="text-blue-500 mr-2">📊</span>
                  Recent Orders Overview
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-500">
                    Showing {Math.min(recentOrders.length, 10)} of{" "}
                    {recentOrders.length} orders
                  </div>
                  <Link
                    href="/admin/orders"
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                  >
                    View All Orders
                  </Link>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.slice(0, 10).length > 0 ? (
                    recentOrders.slice(0, 10).map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              #{order.id.slice(-6).toUpperCase()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                              <span className="text-gray-600 text-sm">👤</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.userName || "Unknown Customer"}
                              </div>
                              <div className="text-sm text-gray-500">
                                Customer
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatPrice(order.total || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={getStatusBadge(
                              order.status?.status || "pending"
                            )}
                          >
                            {(order.status?.status || "pending")
                              .charAt(0)
                              .toUpperCase() +
                              (order.status?.status || "pending").slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>{format(order.createdAt, "MMM d, yyyy")}</div>
                            <div className="text-xs text-gray-400">
                              {getRelativeTime(order.createdAt)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/admin/orders`}
                            className="text-orange-600 hover:text-orange-900 transition-colors duration-150"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-4xl mb-4">📋</span>
                          <span className="text-lg font-medium">
                            No orders yet
                          </span>
                          <span className="text-sm">
                            Orders will appear here when customers make
                            purchases
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    redirect("/auth/login");
  }
};

export default AdminDashboard;
