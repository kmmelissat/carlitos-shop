"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore, useCartStore } from "@/store";
import { UserRole, AuthUser } from "@/types";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { user, loading, logout } = useAuthStore();
  const { itemCount } = useCartStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsMenuOpen(false); // Close mobile menu after search
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-7xl w-[95vw] md:w-[90vw] rounded-full shadow-xl bg-white/80 backdrop-blur-lg border border-gray-200 transition-all duration-300 animate-fadeIn ${
          className || ""
        }`}
        style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        <div className="px-4 sm:px-8 py-2">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center"
              onClick={closeMobileMenu}
            >
              <Image
                src="/carlitos-logo.svg"
                alt="Carlitos Store"
                width={160}
                height={160}
                className="h-14 w-auto drop-shadow-md"
              />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-5 py-2 pr-12 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 bg-white/90 text-gray-900 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
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
              </form>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center h-10 px-4 rounded-full font-bold text-gray-700 hover:text-white bg-transparent hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 transition-all duration-200 shadow-sm hover:shadow-lg gap-2"
              >
                <span className="material-icons-round text-sm">home</span>
                Home
              </Link>
              <Link
                href="/products"
                className="flex items-center h-10 px-4 rounded-full font-bold text-gray-700 hover:text-white bg-transparent hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 transition-all duration-200 shadow-sm hover:shadow-lg gap-2"
              >
                <span className="material-icons-round text-sm">storefront</span>
                Products
              </Link>

              {loading ? (
                // Show loading state - preserve space to prevent layout shift
                <div className="flex items-center gap-2">
                  {/* Placeholder for cart */}
                  <div className="relative flex items-center h-10 px-4 rounded-full opacity-50">
                    <span className="material-icons-round text-2xl text-gray-400">
                      shopping_cart
                    </span>
                  </div>
                  {/* Placeholder for user menu */}
                  <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                </div>
              ) : user ? (
                <>
                  {/* Only show for ADMIN */}
                  {user.role === UserRole.ADMIN && (
                    <Link
                      href="/admin"
                      className="flex items-center h-10 px-4 rounded-full font-bold text-gray-700 hover:text-white bg-transparent hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 transition-all duration-200 shadow-sm hover:shadow-lg gap-2"
                    >
                      <span className="material-icons-round text-sm">
                        admin_panel_settings
                      </span>
                      Admin Panel
                    </Link>
                  )}

                  {/* Cart */}
                  <Link
                    href="/cart"
                    className="relative flex items-center h-10 px-4 rounded-full text-orange-600 hover:text-red-600 transition-colors duration-200"
                  >
                    <span className="material-icons-round text-2xl">
                      shopping_cart
                    </span>
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-md border-2 border-white">
                        {itemCount}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="flex items-center justify-center h-10 w-10 rounded-full border-2 border-orange-400 shadow bg-gradient-to-br from-orange-500 to-red-500 text-white text-lg font-bold ring-2 ring-orange-200 focus:outline-none"
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Profile"
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-base">
                          {user.name?.charAt(0).toUpperCase() ||
                            user.email?.charAt(0).toUpperCase() ||
                            "U"}
                        </span>
                      )}
                    </button>
                    <svg
                      className="w-4 h-4 absolute right-0 bottom-0 mb-1 mr-1 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>

                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white/95 rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 backdrop-blur-lg">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        {user.role === UserRole.ADMIN && (
                          <>
                            <hr className="my-1" />
                            <Link
                              href="/admin/products"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              Admin Panel
                            </Link>
                          </>
                        )}
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="flex items-center h-10 px-4 rounded-full font-bold border border-orange-200 text-gray-700 hover:text-orange-600 hover:bg-orange-50 hover:shadow-orange-100 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-lg gap-2"
                  >
                    <span className="material-icons-round text-sm">login</span>
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center h-10 px-4 rounded-full font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:shadow-lg hover:shadow-orange-200 hover:scale-105 transition-all duration-200 shadow-md gap-2"
                  >
                    <span className="material-icons-round text-sm">
                      person_add
                    </span>
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-orange-600 focus:outline-none focus:text-orange-600 bg-white/80 rounded-full p-2 shadow border border-gray-200 transition-all duration-200"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Mobile menu content */}
          <div className="relative top-28 mx-4">
            <div className="bg-white/95 rounded-3xl shadow-2xl border border-gray-200 backdrop-blur-lg overflow-hidden">
              <div className="px-6 py-6 space-y-1">
                {/* Mobile Search */}
                <div className="mb-6">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products..."
                        className="w-full px-5 py-3 pr-12 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 bg-white/90 text-gray-900 transition-all duration-200"
                      />
                      <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600"
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
                  </form>
                </div>

                {/* Navigation Links */}
                <Link
                  href="/"
                  className="flex items-center px-4 py-3 text-lg font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  <span className="material-icons-round text-xl mr-3">
                    home
                  </span>
                  Home
                </Link>

                <Link
                  href="/products"
                  className="flex items-center px-4 py-3 text-lg font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  <span className="material-icons-round text-xl mr-3">
                    storefront
                  </span>
                  Products
                </Link>

                {loading ? (
                  // Show loading state in mobile menu
                  <div className="px-4 py-3 opacity-50">
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded bg-gray-200 animate-pulse mr-3"></div>
                      <div className="text-lg font-medium text-gray-400">
                        Loading...
                      </div>
                    </div>
                  </div>
                ) : user ? (
                  <>
                    <Link
                      href="/cart"
                      className="flex items-center px-4 py-3 text-lg font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      <span className="material-icons-round text-xl mr-3">
                        shopping_cart
                      </span>
                      Cart{" "}
                      {itemCount > 0 && (
                        <span className="ml-2 bg-orange-600 text-white text-sm font-bold rounded-full min-w-[24px] h-6 flex items-center justify-center">
                          {itemCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-lg font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      <span className="material-icons-round text-xl mr-3">
                        person
                      </span>
                      My Profile
                    </Link>

                    {user.role === UserRole.ADMIN && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-3 text-lg font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all duration-200"
                        onClick={closeMobileMenu}
                      >
                        <span className="material-icons-round text-xl mr-3">
                          admin_panel_settings
                        </span>
                        Admin Panel
                      </Link>
                    )}

                    <div className="border-t border-gray-200 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-lg font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-2xl transition-all duration-200"
                    >
                      <span className="material-icons-round text-xl mr-3">
                        logout
                      </span>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="flex items-center px-4 py-3 text-lg font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      <span className="material-icons-round text-xl mr-3">
                        login
                      </span>
                      Sign In
                    </Link>

                    <Link
                      href="/auth/register"
                      className="flex items-center px-4 py-3 text-lg font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all duration-200 mt-2"
                      onClick={closeMobileMenu}
                    >
                      <span className="material-icons-round text-xl mr-3">
                        person_add
                      </span>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
