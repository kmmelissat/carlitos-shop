"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const OrdersPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/profile");
  }, [router]);

  return null;
};

export default OrdersPage;
