"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Tabs, Avatar, Tag, Empty } from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/store";
import { showToast } from "@/components/ui/Toast";
import { Order, OrderStatusType } from "@/types";

const { TabPane } = Tabs;

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      showToast("Please sign in to view your profile", "info", 4000);
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Simulate fetching user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock orders data - in real app, this would come from API
        const mockOrders: Order[] = [
          {
            id: "order_1234567890",
            userId: user?.id || "",
            items: [
              {
                product: {
                  id: "1",
                  name: "Coffee",
                  description: "Fresh brewed coffee",
                  price: 3.50,
                  images: ["/coffee.jpg"],
                  category: "Beverages",
                  stock: 100,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                quantity: 2,
                totalPrice: 7.00,
              },
            ],
            subtotal: 7.00,
            tax: 0.70,
            total: 7.70,
            paymentMethod: { type: "cash_on_delivery" as any },
            deliveryOption: {
              type: "deliver_to_location" as any,
              location: {
                building: "Main Building",
                classroom: "Room 205",
              },
            },
            status: {
              status: OrderStatusType.DELIVERED,
              updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
              notes: "Order delivered successfully",
            },
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            actualDeliveryTime: new Date(Date.now() - 23 * 60 * 60 * 1000),
          },
          {
            id: "order_1234567891",
            userId: user?.id || "",
            items: [
              {
                product: {
                  id: "2",
                  name: "Sandwich",
                  description: "Fresh sandwich",
                  price: 8.00,
                  images: ["/sandwich.jpg"],
                  category: "Food",
                  stock: 50,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                quantity: 1,
                totalPrice: 8.00,
              },
              {
                product: {
                  id: "3",
                  name: "Chips",
                  description: "Potato chips",
                  price: 2.50,
                  images: ["/chips.jpg"],
                  category: "Snacks",
                  stock: 200,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                quantity: 2,
                totalPrice: 5.00,
              },
            ],
            subtotal: 13.00,
            tax: 1.30,
            total: 14.30,
            paymentMethod: { type: "card" as any },
            deliveryOption: {
              type: "pickup" as any,
              location: {
                building: "Store Location",
                classroom: "Main Counter",
              },
            },
            status: {
              status: OrderStatusType.CONFIRMED,
              updatedAt: new Date(),
              notes: "Order confirmed and being prepared",
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
          },
        ];
        
        setOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        showToast("Error loading orders", "error");
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusColor = (status: OrderStatusType): string => {
    switch (status) {
      case OrderStatusType.PENDING:
        return "orange";
      case OrderStatusType.CONFIRMED:
        return "blue";
      case OrderStatusType.PREPARING:
        return "purple";
      case OrderStatusType.READY_FOR_DELIVERY:
        return "cyan";
      case OrderStatusType.OUT_FOR_DELIVERY:
        return "geekblue";
      case OrderStatusType.DELIVERED:
        return "green";
      case OrderStatusType.CANCELLED:
        return "red";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: OrderStatusType) => {
    switch (status) {
      case OrderStatusType.DELIVERED:
        return <CheckCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "success");
    router.push("/");
  };

  const renderOrderCard = (order: Order) => (
    <Card key={order.id} className="mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
            <Tag 
              color={getStatusColor(order.status.status)}
              icon={getStatusIcon(order.status.status)}
            >
              {order.status.status.replace(/_/g, " ")}
            </Tag>
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            {order.items.length} {order.items.length === 1 ? "item" : "items"} • {formatPrice(order.total)}
          </div>
          
          <div className="text-sm text-gray-500">
            Placed on {formatDate(order.createdAt)}
          </div>
          
          {order.status.notes && (
            <div className="mt-2 text-sm text-blue-600">
              {order.status.notes}
            </div>
          )}
        </div>
        
        <Button
          type="text"
          icon={<ArrowRightOutlined />}
          onClick={() => router.push(`/orders/${order.id}`)}
          className="ml-4"
        >
          View Details
        </Button>
      </div>
    </Card>
  );

  const activeOrders = orders.filter(order => 
    order.status.status !== OrderStatusType.DELIVERED && 
    order.status.status !== OrderStatusType.CANCELLED
  );

  const completedOrders = orders.filter(order => 
    order.status.status === OrderStatusType.DELIVERED || 
    order.status.status === OrderStatusType.CANCELLED
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account and view orders</p>
          </div>
          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700"
          >
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* User Info */}
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center">
                <Avatar 
                  size={80} 
                  icon={<UserOutlined />} 
                  className="mb-4 bg-orange-500"
                />
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {user.name}
                </h2>
                <p className="text-gray-600 mb-4">{user.email}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders:</span>
                    <span className="font-medium">{orders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Orders:</span>
                    <span className="font-medium">{activeOrders.length}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Orders */}
          <div className="lg:col-span-3">
            <Card>
              <Tabs defaultActiveKey="active">
                <TabPane 
                  tab={
                    <span>
                      <ClockCircleOutlined />
                      Active Orders ({activeOrders.length})
                    </span>
                  } 
                  key="active"
                >
                  {ordersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading orders...</p>
                    </div>
                  ) : activeOrders.length > 0 ? (
                    <div className="space-y-4">
                      {activeOrders.map(renderOrderCard)}
                    </div>
                  ) : (
                    <Empty
                      image={<ShoppingOutlined className="text-6xl text-gray-300" />}
                      description="No active orders"
                      className="py-8"
                    >
                      <Button 
                        type="primary" 
                        onClick={() => router.push("/products")}
                      >
                        Start Shopping
                      </Button>
                    </Empty>
                  )}
                </TabPane>
                
                <TabPane 
                  tab={
                    <span>
                      <CheckCircleOutlined />
                      Order History ({completedOrders.length})
                    </span>
                  } 
                  key="completed"
                >
                  {ordersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading orders...</p>
                    </div>
                  ) : completedOrders.length > 0 ? (
                    <div className="space-y-4">
                      {completedOrders.map(renderOrderCard)}
                    </div>
                  ) : (
                    <Empty
                      image={<CheckCircleOutlined className="text-6xl text-gray-300" />}
                      description="No completed orders yet"
                      className="py-8"
                    >
                      <Button 
                        type="primary" 
                        onClick={() => router.push("/products")}
                      >
                        Start Shopping
                      </Button>
                    </Empty>
                  )}
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 