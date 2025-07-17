"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store";
import { AuthUser } from "@/types";
import { Navbar, Footer } from "@/components";

interface ClientWrapperProps {
  children: React.ReactNode;
  serverUser: AuthUser | null;
}

const ClientWrapper: React.FC<ClientWrapperProps> = ({
  children,
  serverUser,
}) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  // Initialize auth store with server user data
  useEffect(() => {
    initializeAuth(serverUser);
  }, [initializeAuth, serverUser]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className={`flex-1 ${isHomePage ? "" : "pt-32"}`}>{children}</main>
      <Footer />
    </div>
  );
};

export default ClientWrapper;
