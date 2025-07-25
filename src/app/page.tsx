import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductCard, SearchBar } from "@/components";
import { ProductCategory } from "@/types";
import { getProductsServer } from "@/lib/api-server";
import HeroCarousel from "@/components/ui/HeroCarousel";

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
      name: "Chips",
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
      {/* Hero Section with Carousel Background - Full Screen */}
      <div className="relative h-[75vh] md:h-[80vh]">
        {/* Carousel Background */}
        <HeroCarousel />

        {/* Static Content Overlay */}
        <div className="relative z-10 flex items-center justify-center h-[75vh] md:h-[80vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
            <div className="text-center">
              <div className="mb-6 md:mb-8">
                <Image
                  src="/carlitos_large.svg"
                  alt="Welcome to CarlitosStore"
                  width={600}
                  height={200}
                  className="mx-auto drop-shadow-lg max-w-full h-auto"
                  priority
                />
              </div>
              <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-white opacity-90 drop-shadow-md max-w-4xl mx-auto leading-relaxed">
                Your favorite snack store with the best products delivered right
                to your classroom
              </p>
              <div className="max-w-2xl mx-auto">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white pt-8 md:pt-12 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Categories
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover your favorite snacks organized by categories. From sweet
              treats to savory delights, we have something for everyone.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group relative p-3 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                {/* Mobile Layout - Vertical Stack */}
                <div className="flex flex-col items-center text-center space-y-2 md:hidden">
                  <div
                    className={`w-10 h-10 ${category.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}
                  >
                    <span
                      className={`material-icons-round text-lg ${category.textColor}`}
                    >
                      {category.icon}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 leading-tight">
                    {category.name}
                  </span>
                  <span className="flex items-center text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                    <span className="material-icons-round text-sm transform group-hover:translate-x-1 transition-transform duration-200">
                      arrow_forward
                    </span>
                  </span>
                </div>

                {/* Desktop Layout - Horizontal */}
                <div className="hidden md:flex flex-row items-center justify-center gap-4 w-full">
                  <div
                    className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}
                  >
                    <span
                      className={`material-icons-round text-2xl ${category.textColor}`}
                    >
                      {category.icon}
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                    {category.name}
                  </span>
                  <span className="flex items-center text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 ml-2">
                    <span className="material-icons-round text-lg transform group-hover:translate-x-1 transition-transform duration-200">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gradient-to-br from-orange-50 via-white to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <span className="material-icons-round text-5xl text-orange-600 mr-4 animate-pulse">
                  star
                </span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                Featured Products
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our most popular snacks, including authentic El Salvador
              favorites and international classics loved by our customers.
            </p>
            <div className="flex items-center justify-center mt-6">
              <div className="flex items-center bg-gradient-to-r from-orange-50 to-red-50 px-6 py-3 rounded-full border-2 border-orange-200 shadow-lg">
                <span className="material-icons-round text-orange-600 mr-3 text-xl">
                  star
                </span>
                <span className="text-orange-700 font-bold text-lg">
                  All products below are featured items
                </span>
                <div className="ml-3 w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showAddToCart={false}
                  isFeatured={true}
                />
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
      <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <div className="flex items-center justify-center mb-4 md:mb-6">
              <div className="relative">
                <span className="material-icons-round text-3xl md:text-5xl text-orange-600 mr-2 md:mr-4 animate-pulse">
                  favorite
                </span>
                <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <h2 className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                Why Choose CarlitosStore?
              </h2>
            </div>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're not just another snack store - we're your campus companion
              for delicious treats and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <div className="group text-center p-4 md:p-8 bg-white rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-2 border-2 border-orange-100 hover:border-orange-300">
              <div className="relative mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="material-icons-round text-xl md:text-3xl text-white">
                    verified
                  </span>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-4 group-hover:text-green-600 transition-colors">
                Premium Quality
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-2 md:mb-0">
                <span className="hidden md:inline">
                  Every product is carefully selected and quality-tested to
                  ensure you get only the best snacks and treats
                </span>
                <span className="md:hidden">
                  Quality-tested snacks and treats you can trust
                </span>
              </p>
              <div className="mt-2 md:mt-4 flex items-center justify-center text-xs md:text-sm text-green-600 font-semibold">
                <span className="material-icons-round text-sm mr-1">
                  trending_up
                </span>
                <span className="hidden sm:inline">
                  100% Quality Guaranteed
                </span>
                <span className="sm:hidden">Quality Guaranteed</span>
              </div>
            </div>

            <div className="group text-center p-4 md:p-8 bg-white rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-2 border-2 border-orange-100 hover:border-orange-300">
              <div className="relative mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="material-icons-round text-xl md:text-3xl text-white">
                    local_shipping
                  </span>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-4 group-hover:text-blue-600 transition-colors">
                <span className="hidden md:inline">
                  Lightning Fast Delivery
                </span>
                <span className="md:hidden">Fast Delivery</span>
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-2 md:mb-0">
                <span className="hidden md:inline">
                  Get your favorite snacks delivered to your classroom in
                  minutes, not hours. Campus-wide coverage!
                </span>
                <span className="md:hidden">
                  Delivered to your classroom in minutes
                </span>
              </p>
              <div className="mt-2 md:mt-4 flex items-center justify-center text-xs md:text-sm text-blue-600 font-semibold">
                <span className="material-icons-round text-sm mr-1">
                  schedule
                </span>
                Under 15 minutes
              </div>
            </div>

            <div className="group text-center p-4 md:p-8 bg-white rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-2 border-2 border-orange-100 hover:border-orange-300">
              <div className="relative mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="material-icons-round text-xl md:text-3xl text-white">
                    payments
                  </span>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-4 group-hover:text-purple-600 transition-colors">
                <span className="hidden md:inline">Best Prices Guaranteed</span>
                <span className="md:hidden">Best Prices</span>
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-2 md:mb-0">
                <span className="hidden md:inline">
                  Student-friendly prices with regular discounts and special
                  offers. Quality snacks that won't break the bank!
                </span>
                <span className="md:hidden">
                  Student-friendly prices with great discounts
                </span>
              </p>
              <div className="mt-2 md:mt-4 flex items-center justify-center text-xs md:text-sm text-purple-600 font-semibold">
                <span className="material-icons-round text-sm mr-1">
                  local_offer
                </span>
                Up to 30% off
              </div>
            </div>

            <div className="group text-center p-4 md:p-8 bg-white rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-2 border-2 border-orange-100 hover:border-orange-300">
              <div className="relative mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="material-icons-round text-xl md:text-3xl text-white">
                    support_agent
                  </span>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-4 group-hover:text-orange-600 transition-colors">
                Personal Touch
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-2 md:mb-0">
                <span className="hidden md:inline">
                  Meet Carlitos himself! We're not a faceless corporation -
                  we're your friendly campus snack buddy
                </span>
                <span className="md:hidden">
                  Meet Carlitos - your friendly campus snack buddy
                </span>
              </p>
              <div className="mt-2 md:mt-4 flex items-center justify-center text-xs md:text-sm text-orange-600 font-semibold">
                <span className="material-icons-round text-sm mr-1">
                  person
                </span>
                Meet Carlitos
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                <span className="material-icons-round text-white">
                  schedule
                </span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">24/7 Ordering</h4>
                <p className="text-sm text-gray-600">
                  Order anytime, day or night
                </p>
              </div>
            </div>

            <div className="flex items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                <span className="material-icons-round text-white">eco</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Eco-Friendly</h4>
                <p className="text-sm text-gray-600">Sustainable packaging</p>
              </div>
            </div>

            <div className="flex items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                <span className="material-icons-round text-white">
                  security
                </span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Secure Payments</h4>
                <p className="text-sm text-gray-600">
                  Multiple payment options
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Experience the Difference?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of satisfied students who choose CarlitosStore
                for their snack needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center px-8 py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <span className="material-icons-round mr-2">
                    shopping_bag
                  </span>
                  Start Shopping
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-orange-600 transition-all duration-200 transform hover:scale-105"
                >
                  <span className="material-icons-round mr-2">person_add</span>
                  Join Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Products */}
            <div className="bg-white rounded-2xl shadow-md border border-orange-100 flex flex-col items-center p-8 animate-scale-in">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 mb-4 shadow">
                <span className="material-icons-round text-white text-3xl">
                  shopping_bag
                </span>
              </div>
              <div className="text-4xl font-extrabold text-orange-600 mb-2">
                500+
              </div>
              <div className="text-gray-600 text-lg font-medium">
                Available products
              </div>
            </div>
            {/* Customers */}
            <div
              className="bg-white rounded-2xl shadow-md border border-green-100 flex flex-col items-center p-8 animate-scale-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mb-4 shadow">
                <span className="material-icons-round text-white text-3xl">
                  groups
                </span>
              </div>
              <div className="text-4xl font-extrabold text-green-600 mb-2">
                1000+
              </div>
              <div className="text-gray-600 text-lg font-medium">
                Satisfied customers
              </div>
            </div>
            {/* Support */}
            <div
              className="bg-white rounded-2xl shadow-md border border-blue-100 flex flex-col items-center p-8 animate-scale-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 mb-4 shadow">
                <span className="material-icons-round text-white text-3xl">
                  support_agent
                </span>
              </div>
              <div className="text-4xl font-extrabold text-blue-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600 text-lg font-medium">
                Customer support
              </div>
            </div>
            {/* Satisfaction */}
            <div
              className="bg-white rounded-2xl shadow-md border border-pink-100 flex flex-col items-center p-8 animate-scale-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-red-500 mb-4 shadow">
                <span className="material-icons-round text-white text-3xl">
                  emoji_events
                </span>
              </div>
              <div className="text-4xl font-extrabold text-pink-600 mb-2">
                99%
              </div>
              <div className="text-gray-600 text-lg font-medium">
                Satisfaction guaranteed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
