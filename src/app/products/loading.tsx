import React from "react";

const ProductsLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Search Bar Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Mobile Categories Toggle Skeleton */}
          <div className="lg:hidden">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                </div>
                <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Main Content - Two Column Layout Skeleton */}
          <div className="flex gap-6">
            {/* Desktop Categories Sidebar Skeleton */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-6 w-6 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded-full w-6 animate-pulse"></div>
                </div>

                {/* Category Items */}
                <div className="space-y-3">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border-2 border-gray-200 animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-gray-200 mr-3 w-10 h-10"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded-lg w-20 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded-lg w-16"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Section Skeleton */}
            <div className="flex-1 space-y-6">
              {/* Toolbar Skeleton */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="h-6 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Products Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {/* Image Skeleton */}
                    <div className="aspect-square bg-gray-200"></div>

                    {/* Content Skeleton */}
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-6 bg-gray-200 rounded-lg w-16"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                      <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Skeleton */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-10 bg-gray-200 rounded-lg w-10 animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsLoading;
