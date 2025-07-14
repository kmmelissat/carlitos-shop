import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🛒</span>
              <span className="text-xl font-bold">CarlitosStore</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your favorite snack store with the best products to satisfy all
              your cravings.
            </p>
            <div className="flex space-x-4 mt-4">
              {/* Instagram */}
              <Link
                href="#"
                aria-label="Instagram"
                className="text-gray-300 hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0a1 1 0 0 1 2 0z" />
                </svg>
              </Link>
              {/* Twitter */}
              <Link
                href="#"
                aria-label="Twitter"
                className="text-gray-300 hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 5.924c-.793.352-1.646.59-2.542.698a4.48 4.48 0 0 0 1.963-2.475a8.94 8.94 0 0 1-2.828 1.082a4.48 4.48 0 0 0-7.64 4.086A12.72 12.72 0 0 1 3.112 4.89a4.48 4.48 0 0 0 1.388 5.976a4.44 4.44 0 0 1-2.03-.561v.057a4.48 4.48 0 0 0 3.594 4.393a4.5 4.5 0 0 1-2.025.077a4.48 4.48 0 0 0 4.184 3.112A8.98 8.98 0 0 1 2 19.54a12.67 12.67 0 0 0 6.88 2.018c8.26 0 12.78-6.84 12.78-12.78c0-.195-.004-.39-.013-.583A9.22 9.22 0 0 0 24 4.59a8.93 8.93 0 0 1-2.54.697z" />
                </svg>
              </Link>
              {/* WhatsApp */}
              <Link
                href="#"
                aria-label="WhatsApp"
                className="text-gray-300 hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967c-.273-.099-.472-.148-.67.15c-.198.297-.767.967-.94 1.166c-.173.198-.347.223-.644.075c-.297-.149-1.255-.463-2.39-1.475c-.883-.788-1.48-1.761-1.653-2.059c-.173-.297-.018-.458.13-.606c.134-.133.298-.347.446-.52c.149-.174.198-.298.298-.497c.099-.198.05-.372-.025-.521c-.075-.149-.669-1.612-.916-2.207c-.242-.58-.487-.501-.669-.51c-.173-.007-.372-.009-.571-.009c-.198 0-.52.074-.792.372c-.272.297-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074c.149.198 2.099 3.205 5.077 4.372c.71.306 1.263.489 1.695.626c.712.227 1.36.195 1.872.118c.571-.085 1.758-.719 2.006-1.413c.248-.694.248-1.288.173-1.413c-.074-.124-.272-.198-.57-.347m-5.421 6.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214l-3.741.982l1-3.646l-.235-.374A9.86 9.86 0 0 1 2.1 11.513C2.073 6.706 6.11 2.64 10.918 2.64c2.636 0 5.104 1.027 6.963 2.887a9.823 9.823 0 0 1 2.885 6.95c-.003 5.807-4.04 9.873-8.749 9.873m8.413-18.287A11.815 11.815 0 0 0 10.918.64C5.037.64.073 5.605.1 11.486c.021 2.021.533 3.993 1.538 5.728L.057 23.36a1 1 0 0 0 1.225 1.225l6.146-1.58a11.89 11.89 0 0 0 5.49 1.354h.005c6.02 0 10.924-4.905 10.927-10.925a11.82 11.82 0 0 0-3.47-8.617" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link
                  href="/products?category=chips"
                  className="hover:text-white"
                >
                  Chips & Snacks
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=cookies"
                  className="hover:text-white"
                >
                  Cookies
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=candy"
                  className="hover:text-white"
                >
                  Candy
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=chocolate"
                  className="hover:text-white"
                >
                  Chocolate
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/help" className="hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
              <div className="flex space-x-4">
                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">VISA</span>
                </div>
                <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">MC</span>
                </div>
                <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">AMEX</span>
                </div>
                <div className="w-12 h-8 bg-yellow-500 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-black">PP</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                Secure shopping with SSL encryption
              </p>
              <div className="flex items-center justify-center md:justify-end mt-2">
                <svg
                  className="w-4 h-4 text-green-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-400">Secure payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 CarlitosStore. All rights reserved.
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white text-sm"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-gray-400 hover:text-white text-sm"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
