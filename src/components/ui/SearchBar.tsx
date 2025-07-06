"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCategory } from "@/types";

interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  showFilters?: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = "",
  onSearch,
  showFilters = false,
  className = "",
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Construir URL con filtros
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.set("q", searchQuery.trim());
      }

      if (filters.category) {
        params.set("category", filters.category);
      }

      if (filters.minPrice) {
        params.set("minPrice", filters.minPrice);
      }

      if (filters.maxPrice) {
        params.set("maxPrice", filters.maxPrice);
      }

      if (filters.inStock) {
        params.set("inStock", "true");
      }

      const queryString = params.toString();
      router.push(`/search${queryString ? `?${queryString}` : ""}`);
    }
  };

  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | boolean
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      inStock: false,
    });
    setSearchQuery("");
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar snacks, dulces, bebidas..."
            className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
          />

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {showFilters && (
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                title="Filtros avanzados"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
              </button>
            )}

            <button
              type="submit"
              className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </form>

      {/* Filtros Avanzados */}
      {showFilters && showAdvancedFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="">Todas las categorías</option>
                <option value={ProductCategory.CHIPS}>Papas fritas</option>
                <option value={ProductCategory.COOKIES}>Galletas</option>
                <option value={ProductCategory.CANDY}>Dulces</option>
                <option value={ProductCategory.NUTS}>Frutos secos</option>
                <option value={ProductCategory.CHOCOLATE}>Chocolate</option>
                <option value={ProductCategory.CRACKERS}>
                  Galletas saladas
                </option>
                <option value={ProductCategory.POPCORN}>Palomitas</option>
                <option value={ProductCategory.DRIED_FRUITS}>
                  Frutos secos
                </option>
                <option value={ProductCategory.HEALTHY}>Saludable</option>
                <option value={ProductCategory.BEVERAGES}>Bebidas</option>
                <option value={ProductCategory.OTHER}>Otros</option>
              </select>
            </div>

            {/* Precio mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio mínimo (€)
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Precio máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio máximo (€)
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                placeholder="100.00"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Solo en stock */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                checked={filters.inStock}
                onChange={(e) =>
                  handleFilterChange("inStock", e.target.checked)
                }
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label
                htmlFor="inStock"
                className="ml-2 block text-sm text-gray-700"
              >
                Solo productos en stock
              </label>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Limpiar filtros
            </button>

            <button
              type="button"
              onClick={handleSearch}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}

      {/* Filtros activos */}
      {(filters.category ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.inStock) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
              {filters.category}
              <button
                type="button"
                onClick={() => handleFilterChange("category", "")}
                className="ml-2 text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          )}

          {filters.minPrice && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
              Desde €{filters.minPrice}
              <button
                type="button"
                onClick={() => handleFilterChange("minPrice", "")}
                className="ml-2 text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          )}

          {filters.maxPrice && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
              Hasta €{filters.maxPrice}
              <button
                type="button"
                onClick={() => handleFilterChange("maxPrice", "")}
                className="ml-2 text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          )}

          {filters.inStock && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
              En stock
              <button
                type="button"
                onClick={() => handleFilterChange("inStock", false)}
                className="ml-2 text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
