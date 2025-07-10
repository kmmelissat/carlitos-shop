import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Carousel } from "antd";
import { ProductCard, SearchBar } from "@/components";
import { ProductCategory } from "@/types";
import { getProductsServer } from "@/lib/api-server";

// This is now a Server Component that fetches real data
const HomePage = async () => {
  // Fetch featured products from the database
  const allProducts = await getProductsServer();
  const featuredProducts = allProducts
    .filter((product) => product.featured)
    .slice(0, 3);

  const categories = [
    {
      id: ProductCategory.CHIPS,
      name: "Chips & Snacks",
      icon: "restaurant",
      color: "bg-gradient-to-br from-yellow-400 to-orange-500",
      textColor: "text-white",
    },
    {
      id: ProductCategory.COOKIES,
      name: "Cookies",
      icon: "cake",
      color: "bg-gradient-to-br from-amber-400 to-orange-600",
      textColor: "text-white",
    },
    {
      id: ProductCategory.CANDY,
      name: "Candy",
      icon: "favorite",
      color: "bg-gradient-to-br from-pink-400 to-red-500",
      textColor: "text-white",
    },
    {
      id: ProductCategory.CHOCOLATE,
      name: "Chocolate",
      icon: "spa",
      color: "bg-gradient-to-br from-amber-600 to-brown-700",
      textColor: "text-white",
    },
    {
      id: ProductCategory.NUTS,
      name: "Nuts",
      icon: "eco",
      color: "bg-gradient-to-br from-green-400 to-emerald-600",
      textColor: "text-white",
    },
    {
      id: ProductCategory.BEVERAGES,
      name: "Beverages",
      icon: "local_drink",
      color: "bg-gradient-to-br from-blue-400 to-cyan-600",
      textColor: "text-white",
    },
    {
      id: ProductCategory.CRACKERS,
      name: "Crackers",
      icon: "grain",
      color: "bg-gradient-to-br from-orange-400 to-red-500",
      textColor: "text-white",
    },
    {
      id: ProductCategory.POPCORN,
      name: "Popcorn",
      icon: "movie",
      color: "bg-gradient-to-br from-yellow-400 to-orange-500",
      textColor: "text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Carousel Background */}
      <div className="relative h-[50vh]">
        {/* Carousel Background */}
        <div className="absolute inset-0 z-0">
          <Carousel
            autoplay
            autoplaySpeed={2000}
            dots={true}
            className="h-full"
          >
            <div className="relative h-[50vh]">
              <Image
                src="/esen-1.jpg"
                alt="ESEN Campus - Image 1"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
            <div className="relative h-[50vh]">
              <Image
                src="/esen-2.jpg"
                alt="ESEN Campus - Image 2"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          </Carousel>
        </div>

        {/* Static Content Overlay */}
        <div className="relative z-10 flex items-center justify-center h-[50vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="mb-4">
                <Image
                  src="/carlitos_large.svg"
                  alt="Welcome to CarlitosStore"
                  width={600}
                  height={200}
                  className="mx-auto drop-shadow-lg"
                  priority
                />
              </div>
              <p className="text-xl md:text-2xl mb-8 text-white opacity-90 drop-shadow-md">
                Your favorite snack store with the best products
              </p>
              <div className="max-w-2xl mx-auto">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover your favorite snacks organized by categories. From sweet
              treats to savory delights, we have something for everyone.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}
                  >
                    <span
                      className={`material-icons-round text-2xl ${category.textColor}`}
                    >
                      {category.icon}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                    {category.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                    <span className="mr-1">Explore</span>
                    <span className="material-icons-round text-lg transform group-hover:translate-x-1 transition-transform duration-200">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <span className="material-icons-round text-4xl text-orange-600 mr-3">
                star
              </span>
              <h2 className="text-4xl font-bold text-gray-900">
                Featured Products
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular snacks, including authentic El Salvador
              favorites and international classics loved by our customers.
            </p>
            <div className="flex items-center justify-center mt-4">
              <div className="flex items-center bg-orange-50 px-4 py-2 rounded-full">
                <span className="material-icons-round text-orange-600 mr-2">
                  star
                </span>
                <span className="text-orange-700 font-medium">
                  All products below are featured items
                </span>
              </div>
            </div>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons-round text-4xl text-gray-400">
                  inventory_2
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No featured products available
              </h3>
              <p className="text-gray-500 mb-6">
                Check back soon for our latest featured products, or browse our
                full catalog.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
              >
                <span className="material-icons-round mr-2">shopping_bag</span>
                Browse All Products
              </Link>
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              href="/products"
              className="group inline-flex items-center px-10 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white text-lg font-semibold rounded-2xl hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="material-icons-round mr-2">explore</span>
              Explore All Products
              <span className="material-icons-round ml-2 transform group-hover:translate-x-1 transition-transform duration-200">
                arrow_forward
              </span>
            </Link>
          </div>
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
