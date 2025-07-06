"use client";

import React from "react";
import Link from "next/link";
import { ProductCard, SearchBar } from "@/components";
import { Product, ProductCategory } from "@/types";

// Mock data - In production this would come from the API
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Doritos Nacho Cheese",
    description: "Delicious nachos with cheese flavor",
    price: 2.99,
    category: ProductCategory.CHIPS,
    images: ["/api/placeholder/300/300"],
    stock: 25,
    ingredients: ["Corn", "Oil", "Cheese"],
    allergens: ["Dairy"],
    nutritionalInfo: {
      calories: 150,
      protein: 2,
      carbs: 18,
      fat: 8,
      fiber: 1,
      sugar: 1,
      sodium: 210,
    },
    seller: {
      id: "admin",
      name: "CarlitosStore",
      rating: 5.0,
    },
    rating: 4.5,
    reviewCount: 24,
    isActive: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Oreo Original",
    description: "Cookies with vanilla cream",
    price: 3.49,
    category: ProductCategory.COOKIES,
    images: ["/api/placeholder/300/300"],
    stock: 30,
    ingredients: ["Flour", "Sugar", "Cream"],
    allergens: ["Gluten", "Dairy"],
    nutritionalInfo: {
      calories: 160,
      protein: 1,
      carbs: 25,
      fat: 7,
      fiber: 1,
      sugar: 14,
      sodium: 135,
    },
    seller: {
      id: "admin",
      name: "CarlitosStore",
      rating: 5.0,
    },
    rating: 4.8,
    reviewCount: 32,
    isActive: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Haribo Gummy Bears",
    description: "Gummy bears with fruity flavors",
    price: 1.99,
    category: ProductCategory.CANDY,
    images: ["/api/placeholder/300/300"],
    stock: 40,
    ingredients: ["Glucose syrup", "Sugar", "Gelatin"],
    allergens: [],
    nutritionalInfo: {
      calories: 140,
      protein: 3,
      carbs: 32,
      fat: 0,
      fiber: 0,
      sugar: 22,
      sodium: 15,
    },
    seller: {
      id: "admin",
      name: "CarlitosStore",
      rating: 5.0,
    },
    rating: 4.2,
    reviewCount: 18,
    isActive: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const categories = [
  {
    id: ProductCategory.CHIPS,
    name: "Chips & Snacks",
    icon: "🍟",
    color: "bg-yellow-100",
  },
  {
    id: ProductCategory.COOKIES,
    name: "Cookies",
    icon: "🍪",
    color: "bg-amber-100",
  },
  {
    id: ProductCategory.CANDY,
    name: "Candy",
    icon: "🍭",
    color: "bg-pink-100",
  },
  {
    id: ProductCategory.CHOCOLATE,
    name: "Chocolate",
    icon: "🍫",
    color: "bg-amber-100",
  },
  {
    id: ProductCategory.NUTS,
    name: "Nuts",
    icon: "🥜",
    color: "bg-yellow-100",
  },
  {
    id: ProductCategory.BEVERAGES,
    name: "Beverages",
    icon: "🥤",
    color: "bg-blue-100",
  },
  {
    id: ProductCategory.CRACKERS,
    name: "Crackers",
    icon: "🧀",
    color: "bg-orange-100",
  },
  {
    id: ProductCategory.POPCORN,
    name: "Popcorn",
    icon: "🍿",
    color: "bg-yellow-100",
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to CarlitosStore
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Your favorite snack store with the best products
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore our categories
          </h2>
          <p className="text-gray-600">
            Find your favorite snacks organized by categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div
                className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}
              >
                <span className="text-2xl">{category.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured products
          </h2>
          <p className="text-gray-600">
            The most popular snacks at CarlitosStore
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
          >
            View all products
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why choose CarlitosStore?
            </h2>
            <p className="text-gray-600">We are your trusted snack store</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Guaranteed quality
              </h3>
              <p className="text-gray-600">
                All our products are carefully selected for their quality
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast delivery
              </h3>
              <p className="text-gray-600">
                Get your favorite snacks in record time
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Competitive prices
              </h3>
              <p className="text-gray-600">
                The best prices on all our products
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay up to date with CarlitosStore
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe and receive exclusive offers and news
          </p>
          <div className="max-w-md mx-auto">
            <form className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-orange-800 text-white rounded-r-lg hover:bg-orange-900 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                500+
              </div>
              <div className="text-gray-600">Available products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                1000+
              </div>
              <div className="text-gray-600">Satisfied customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Customer support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">99%</div>
              <div className="text-gray-600">Satisfaction guaranteed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
