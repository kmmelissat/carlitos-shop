"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Tag, Timeline, Divider } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ShoppingOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/store";
import { showToast } from "@/components/ui/Toast";
import {
  Order,
  OrderStatusType,
  PaymentMethodType,
  DeliveryType,
} from "@/types";

const OrderDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { user, loading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      showToast("Please sign in to view orders", "info", 4000);
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Simulate fetching order data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setOrderLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock order data - in real app, this would come from API
        const mockOrder: Order = {
          id: orderId,
          userId: user?.id || "",
          items: [
            {
              product: {
                id: "1",
                name: "Coffee",
                description: "Fresh brewed coffee",
                price: 3.5,
                images: ["/coffee.jpg"],
                category: "Beverages",
                stock: 100,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              quantity: 2,
              totalPrice: 7.0,
            },
            {
              product: {
                id: "2",
                name: "Sandwich",
                description: "Fresh sandwich",
                price: 8.0,
                images: ["/sandwich.jpg"],
                category: "Food",
                stock: 50,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              quantity: 1,
              totalPrice: 8.0,
            },
          ],
          subtotal: 15.0,
          tax: 1.5,
          total: 16.5,
          paymentMethod: {
            type: PaymentMethodType.CASH_ON_DELIVERY,
          },
          deliveryOption: {
            type: DeliveryType.DELIVER_TO_LOCATION,
            location: {
              building: "Main Building",
              classroom: "Room 205",
              additionalInfo: "2nd floor, near elevator",
            },
            preferredTime: "lunch",
            notes: "Please call when outside",
          },
          customerNotes: "Extra napkins please",
          status: {
            status: OrderStatusType.CONFIRMED,
            updatedAt: new Date(),
            notes: "Order confirmed and being prepared",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        };

        setOrder(mockOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
        showToast("Error loading order details", "error");
      } finally {
        setOrderLoading(false);
      }
    };

    if (orderId && user) {
      fetchOrder();
    }
  }, [orderId, user]);

  // Show loading while checking authentication or fetching order
  if (loading || orderLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user || !order) {
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
      month: "long",
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

  const getPaymentMethodText = (type: PaymentMethodType): string => {
    switch (type) {
      case PaymentMethodType.CASH_ON_DELIVERY:
        return "Cash on Delivery";
      case PaymentMethodType.CARD:
        return "Credit/Debit Card";
      case PaymentMethodType.TRANSFER:
        return "Bank Transfer";
      default:
        return "Unknown";
    }
  };

  const getDeliveryTypeText = (type: DeliveryType): string => {
    switch (type) {
      case DeliveryType.DELIVER_TO_LOCATION:
        return "Deliver to Location";
      case DeliveryType.PICKUP:
        return "Pick up at Store";
      default:
        return "Unknown";
    }
  };

  const timelineItems = [
    {
      color: "green",
      children: (
        <div>
          <p className="font-medium">Order Placed</p>
          <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
        </div>
      ),
    },
    {
      color: order.status.status !== OrderStatusType.PENDING ? "green" : "gray",
      children: (
        <div>
          <p className="font-medium">Order Confirmed</p>
          <p className="text-sm text-gray-600">
            {order.status.status !== OrderStatusType.PENDING
              ? formatDate(order.status.updatedAt)
              : "Pending confirmation"}
          </p>
        </div>
      ),
    },
    {
      color:
        order.status.status === OrderStatusType.PREPARING ||
        order.status.status === OrderStatusType.READY_FOR_DELIVERY ||
        order.status.status === OrderStatusType.OUT_FOR_DELIVERY ||
        order.status.status === OrderStatusType.DELIVERED
          ? "green"
          : "gray",
      children: (
        <div>
          <p className="font-medium">Preparing Order</p>
          <p className="text-sm text-gray-600">
            {order.status.status === OrderStatusType.PREPARING
              ? "Currently being prepared"
              : order.status.status === OrderStatusType.READY_FOR_DELIVERY ||
                order.status.status === OrderStatusType.OUT_FOR_DELIVERY ||
                order.status.status === OrderStatusType.DELIVERED
              ? "Order prepared"
              : "Pending"}
          </p>
        </div>
      ),
    },
    {
      color:
        order.status.status === OrderStatusType.OUT_FOR_DELIVERY ||
        order.status.status === OrderStatusType.DELIVERED
          ? "green"
          : "gray",
      children: (
        <div>
          <p className="font-medium">Out for Delivery</p>
          <p className="text-sm text-gray-600">
            {order.status.status === OrderStatusType.OUT_FOR_DELIVERY
              ? "Carlitos is on the way"
              : order.status.status === OrderStatusType.DELIVERED
              ? "Delivered successfully"
              : "Pending"}
          </p>
        </div>
      ),
    },
    {
      color:
        order.status.status === OrderStatusType.DELIVERED ? "green" : "gray",
      children: (
        <div>
          <p className="font-medium">Delivered</p>
          <p className="text-sm text-gray-600">
            {order.status.status === OrderStatusType.DELIVERED
              ? "Order completed"
              : "Pending"}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-1">Order #{order.id}</p>
          </div>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/profile")}
            className="text-gray-600 hover:text-orange-600"
          >
            Back to Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Status
                </h2>
                <Tag
                  color={getStatusColor(order.status.status)}
                  icon={getStatusIcon(order.status.status)}
                  className="text-sm font-medium"
                >
                  {order.status.status.replace(/_/g, " ")}
                </Tag>
              </div>

              <Timeline items={timelineItems} />

              {order.status.notes && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{order.status.notes}</p>
                </div>
              )}
            </Card>

            {/* Order Items */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ShoppingOutlined className="text-2xl text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(item.totalPrice)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.product.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Delivery Information */}
            <Card>
              <div className="flex items-center mb-4">
                <EnvironmentOutlined className="text-xl text-gray-700 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Delivery Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Type:</span>
                  <span className="font-medium">
                    {getDeliveryTypeText(order.deliveryOption.type)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Building:</span>
                  <span className="font-medium">
                    {order.deliveryOption.location.building}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Classroom/Office:</span>
                  <span className="font-medium">
                    {order.deliveryOption.location.classroom}
                  </span>
                </div>

                {order.deliveryOption.location.additionalInfo && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Additional Info:</span>
                    <span className="font-medium">
                      {order.deliveryOption.location.additionalInfo}
                    </span>
                  </div>
                )}

                {order.deliveryOption.preferredTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preferred Time:</span>
                    <span className="font-medium capitalize">
                      {order.deliveryOption.preferredTime.replace(/_/g, " ")}
                    </span>
                  </div>
                )}

                {order.estimatedDeliveryTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <span className="font-medium">
                      {formatDate(order.estimatedDeliveryTime)}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Payment Information */}
            <Card>
              <div className="flex items-center mb-4">
                <CreditCardOutlined className="text-xl text-gray-700 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">
                    {getPaymentMethodText(order.paymentMethod.type)}
                  </span>
                </div>

                {order.paymentMethod.details?.transferReference && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transfer Reference:</span>
                    <span className="font-medium">
                      {order.paymentMethod.details.transferReference}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Customer Notes */}
            {order.customerNotes && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Special Instructions
                </h2>
                <p className="text-gray-700">{order.customerNotes}</p>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">{formatPrice(order.tax)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>

                <Divider />

                <div className="flex justify-between">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {formatPrice(order.total)}
                  </span>
                </div>

                <Divider />

                {/* Contact Information */}
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Need Help?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Contact Carlitos for any questions about your order
                  </p>
                  <Button
                    type="primary"
                    icon={<PhoneOutlined />}
                    className="w-full"
                    onClick={() => showToast("Calling Carlitos...", "info")}
                  >
                    Call Carlitos
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
