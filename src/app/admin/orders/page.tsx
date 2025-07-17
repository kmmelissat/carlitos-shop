import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-server";
import { getOrdersServer } from "@/lib/api-server";
import OrdersManagement from "@/components/admin/OrdersManagement";

const AdminOrdersPage = async () => {
  // Check authentication server-side
  try {
    await requireAdmin();
  } catch (error) {
    redirect("/auth/login");
  }

  // Fetch all orders from the database
  const orders = await getOrdersServer();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Orders Management
              </h1>
              <p className="text-gray-600">
                View and manage all customer orders
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/analytics"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                📊 Analytics
              </Link>
              <Link
                href="/admin"
                className="text-orange-600 hover:text-orange-700"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrdersManagement initialOrders={orders} />
      </div>
    </div>
  );
};

export default AdminOrdersPage;
