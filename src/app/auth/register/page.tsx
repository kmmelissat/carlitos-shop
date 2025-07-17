"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { RegisterFormData } from "@/types";
import Image from "next/image";

const RegisterPage: React.FC = () => {
  const { register, loginWithGoogle, loading, error, user } = useAuthStore();
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  // Redirect based on user role when registration is complete
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      await register(formData);
      // Redirection is handled in useEffect when user changes
    } catch (err) {
      // Error is already handled in context
      console.error("Registration error:", err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Redirection is handled in useEffect when user changes
    } catch (err) {
      // Error is already handled in context
      console.error("Google registration error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg min-w-[400px] bg-white rounded-3xl shadow-xl p-8 border border-orange-100">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/carlitos-logo.svg"
            alt="CarlitosStore Logo"
            width={64}
            height={64}
            className="mb-2"
            priority
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Create account in CarlitosStore
          </h2>
          <p className="text-gray-500">Join us and enjoy the best snacks!</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-2">
              <div className="flex">
                <span className="material-icons-round text-red-400 mr-2">
                  error
                </span>
                <div>
                  <h3 className="text-sm font-bold text-red-800">
                    Error creating account
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <div className="relative">
                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  person
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="Your full name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  mail
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone (optional)
              </label>
              <div className="relative">
                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  phone
                </span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="+1 555 123 4567"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  lock
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <div className="relative">
              <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                lock
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                placeholder="Repeat your password"
              />
            </div>
          </div>
          <div className="md:col-span-2 flex items-center gap-2 mt-2">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="block text-sm text-gray-900">
              I accept the{" "}
              <Link
                href="/terms"
                className="text-orange-600 hover:underline font-bold"
              >
                terms of service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-orange-600 hover:underline font-bold"
              >
                privacy policy
              </Link>
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center h-12 px-6 rounded-full font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:scale-105 transition-all duration-200 shadow-md gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-icons-round text-base">person_add</span>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <div className="mt-6">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-gray-400 text-sm">or continue with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center h-12 px-6 rounded-full border border-gray-300 bg-white text-gray-700 font-bold shadow-sm hover:bg-gray-50 transition-all duration-200 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-orange-600 hover:underline font-bold"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
