"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AuthProvider, CartProvider } from "@/store";
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

  return (
    <AuthProvider serverUser={serverUser}>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className={`flex-1 ${isHomePage ? "" : "pt-32"}`}>
            {children}
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default ClientWrapper;
