import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-server";
import { getUsersServer, getOrdersServer } from "@/lib/api-server";
import CustomersManagement from "@/components/admin/CustomersManagement";

const AdminCustomersPage = async () => {
  // Check authentication server-side
  try {
    await requireAdmin();
  } catch (error) {
    redirect("/auth/login");
  }

  // Fetch customers and orders for analytics
  const [customers, orders] = await Promise.all([
    getUsersServer(),
    getOrdersServer(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Customer Management
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage all customer accounts and their activity
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/analytics"
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 text-sm font-medium shadow-md"
              >
                📊 Analytics
              </Link>
              <Link
                href="/admin/orders"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-md"
              >
                📋 Orders
              </Link>
              <Link
                href="/admin"
                className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-2 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 text-sm font-medium shadow-md"
              >
                🏠 Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CustomersManagement initialCustomers={customers} orders={orders} />
      </div>
    </div>
  );
};

export default AdminCustomersPage;
