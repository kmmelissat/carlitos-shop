"use client";

import React from "react";
import { AuthProvider, CartProvider } from "@/store";
import { AuthUser } from "@/types";
import ServerNavbar from "./ServerNavbar";
import Footer from "./Footer";

interface ClientLayoutProps {
  children: React.ReactNode;
  serverUser: AuthUser | null;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({
  children,
  serverUser,
}) => {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <ServerNavbar serverUser={serverUser} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default ClientLayout;
