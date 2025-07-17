import React from "react";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-server";
import {
  getRevenueTrendsServer,
  getBestSellingProductsServer,
  getPeakSalesHoursServer,
  getWeeklyComparisonServer,
} from "@/lib/api-server";
import SalesDashboard from "@/components/admin/SalesDashboard";
import Link from "next/link";

const AdminAnalyticsPage = async () => {
  // Check authentication server-side
  try {
    await requireAdmin();
  } catch (error) {
    redirect("/auth/login");
  }

  // Fetch all analytics data
  const [revenueData, bestSellingProducts, hourlyData, weeklyComparison] =
    await Promise.all([
      getRevenueTrendsServer(),
      getBestSellingProductsServer(),
      getPeakSalesHoursServer(),
      getWeeklyComparisonServer(),
    ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sales Analytics
              </h1>
              <p className="text-gray-600">
                Comprehensive sales data and performance insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Back to Dashboard
              </Link>
              <Link
                href="/admin/orders"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Dashboard Component */}
      <SalesDashboard
        revenueData={revenueData}
        bestSellingProducts={bestSellingProducts}
        hourlyData={hourlyData}
        weeklyComparison={weeklyComparison}
      />
    </div>
  );
};

export default AdminAnalyticsPage;
