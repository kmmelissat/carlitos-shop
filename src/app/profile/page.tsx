"use client";
import React from "react";
import { useAuth } from "@/store";
import OrdersSection from "./OrdersSection";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to view your profile.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="mb-8 bg-white rounded-xl shadow p-6">
        <div className="text-lg font-semibold mb-2">Account Info</div>
        <div className="mb-1">
          Name: <span className="font-medium">{user.name}</span>
        </div>
        <div className="mb-1">
          Email: <span className="font-medium">{user.email}</span>
        </div>
      </div>
      <OrdersSection userId={user.id} />
    </div>
  );
};

export default ProfilePage;
