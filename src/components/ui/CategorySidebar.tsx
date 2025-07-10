"use client";

import React from "react";
import { ProductCategory } from "@/types";

interface CategorySidebarProps {
  allProducts: any[];
  searchParams: {
    category?: ProductCategory;
  };
  onCategoryFilter: (category: ProductCategory | "") => void;
  showMobileSidebar?: boolean;
  onToggleMobileSidebar?: () => void;
}

const categories = [
  { id: ProductCategory.CHIPS, name: "Chips & Snacks", icon: "lunch_dining" },
  { id: ProductCategory.COOKIES, name: "Cookies", icon: "cookie" },
  { id: ProductCategory.CANDY, name: "Candy", icon: "icecream" },
  { id: ProductCategory.CHOCOLATE, name: "Chocolate", icon: "pix" },
  { id: ProductCategory.NUTS, name: "Nuts", icon: "eco" },
  { id: ProductCategory.BEVERAGES, name: "Beverages", icon: "local_drink" },
  { id: ProductCategory.CRACKERS, name: "Crackers", icon: "grain" },
  { id: ProductCategory.POPCORN, name: "Popcorn", icon: "movie" },
  {
    id: ProductCategory.DRIED_FRUITS,
    name: "Dried Fruits",
    icon: "local_florist",
  },
  { id: ProductCategory.HEALTHY, name: "Healthy", icon: "health_and_safety" },
  { id: ProductCategory.OTHER, name: "Other", icon: "category" },
];

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  allProducts,
  searchParams,
  onCategoryFilter,
  showMobileSidebar,
  onToggleMobileSidebar,
}) => {
  // Get category color
  const getCategoryColor = (category: string) => {
    const colors = {
      chips:
        "bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200 hover:from-yellow-100 hover:to-yellow-200",
      cookies:
        "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-800 border-amber-200 hover:from-amber-100 hover:to-amber-200",
      beverages:
        "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 border-blue-200 hover:from-blue-100 hover:to-blue-200",
      chocolate:
        "bg-gradient-to-br from-amber-100 to-orange-200 text-amber-900 border-amber-300 hover:from-amber-200 hover:to-orange-300",
      nuts: "bg-gradient-to-br from-green-50 to-green-100 text-green-800 border-green-200 hover:from-green-100 hover:to-green-200",
      candy:
        "bg-gradient-to-br from-pink-100 to-rose-200 text-pink-900 border-pink-300 hover:from-pink-200 hover:to-rose-300",
      crackers:
        "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-800 border-amber-200 hover:from-amber-100 hover:to-amber-200",
      popcorn:
        "bg-gradient-to-br from-red-50 to-red-100 text-red-800 border-red-200 hover:from-red-100 hover:to-red-200",
      dried_fruits:
        "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-800 border-purple-200 hover:from-purple-100 hover:to-purple-200",
      healthy:
        "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200",
      other:
        "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border-gray-200 hover:from-gray-100 hover:to-gray-200",
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  // Get category product count
  const getCategoryCount = (categoryId: ProductCategory | "") => {
    if (categoryId === "") {
      return allProducts.length;
    }
    return allProducts.filter((product) => product.category === categoryId)
      .length;
  };

  // Categories Sidebar Component
  const SidebarContent = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="material-icons-round text-orange-600 mr-2">
            category
          </span>
          Categories
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {categories.length + 1}
        </span>
      </div>

      <div className="space-y-3">
        {/* All Categories Card */}
        <button
          onClick={() => onCategoryFilter("")}
          className={`w-full p-3 rounded-xl border-2 transition-all duration-200 ${
            !searchParams.category
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-lg"
              : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200 hover:from-gray-100 hover:to-gray-200 hover:shadow-md"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-lg mr-3 flex items-center justify-center ${
                !searchParams.category ? "bg-white/20" : "bg-white shadow-sm"
              }`}
            >
              <span
                className={`material-icons-round text-lg ${
                  !searchParams.category ? "text-white" : "text-gray-600"
                }`}
              >
                apps
              </span>
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-medium text-sm">All Products</h4>
              <p className="text-xs opacity-75">{getCategoryCount("")} items</p>
            </div>
          </div>
        </button>

        {/* Category Cards */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryFilter(category.id)}
            className={`w-full p-3 rounded-xl border-2 transition-all duration-200 ${
              searchParams.category === category.id
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-lg"
                : `${getCategoryColor(
                    category.id
                  )} border-2 shadow-sm hover:shadow-md`
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-lg mr-3 flex items-center justify-center ${
                  searchParams.category === category.id
                    ? "bg-white/20"
                    : "bg-white shadow-sm"
                }`}
              >
                <span
                  className={`material-icons-round text-lg ${
                    searchParams.category === category.id
                      ? "text-white"
                      : "text-current"
                  }`}
                >
                  {category.icon}
                </span>
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-medium text-sm">{category.name}</h4>
                <p className="text-xs opacity-75">
                  {getCategoryCount(category.id)} items
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Categories Toggle */}
      <div className="lg:hidden">
        <button
          onClick={onToggleMobileSidebar}
          className="w-full flex items-center justify-between bg-white rounded-lg shadow-sm p-4 text-gray-700 hover:text-orange-600 transition-colors"
        >
          <div className="flex items-center">
            <span className="material-icons-round mr-2">category</span>
            <span className="font-medium">Categories</span>
            {searchParams.category && (
              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                {categories.find((c) => c.id === searchParams.category)?.name ||
                  "Selected"}
              </span>
            )}
          </div>
          <span className="material-icons-round">
            {showMobileSidebar ? "expand_less" : "expand_more"}
          </span>
        </button>

        {/* Mobile Categories Dropdown */}
        {showMobileSidebar && (
          <div className="mt-2">
            <SidebarContent />
          </div>
        )}
      </div>

      {/* Desktop Categories Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <SidebarContent />
      </div>
    </>
  );
};

export default CategorySidebar;
