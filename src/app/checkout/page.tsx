"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Form,
  Input,
  Select,
  Radio,
  Card,
  Divider,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CreditCardOutlined,
  BankOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useCart, useAuth } from "@/store";
import { showToast } from "@/components/ui/Toast";
import {
  PaymentMethodType,
  DeliveryType,
  CheckoutFormData,
  PaymentMethod,
  DeliveryOption,
} from "@/types";
import PaymentMethodSection from "@/components/forms/PaymentMethodSection";

const { Option } = Select;
const { TextArea } = Input;

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user, loading } = useAuth();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(
    PaymentMethodType.CASH_ON_DELIVERY
  );

  useEffect(() => {
    // Sync form and state on mount
    form.setFieldsValue({ paymentMethod: { type: selectedPayment } });
  }, []);

  // When user changes payment method, update both state and form
  const handleSelectPayment = (type: PaymentMethodType) => {
    setSelectedPayment(type);
    form.setFieldsValue({ paymentMethod: { type } });
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      showToast("Please sign in to checkout", "info", 4000);
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0 && !loading) {
      showToast("Your cart is empty", "info", 4000);
      router.push("/cart");
    }
  }, [items, loading, router]);

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

  // Don't render anything if user is not authenticated or cart is empty
  if (!user || items.length === 0) {
    return null;
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateTax = (): number => {
    return total * 0.0; // no tax, we are not charging tax
  };

  const calculateTotal = (): number => {
    return total + calculateTax();
  };

  const handleSubmit = async (values: CheckoutFormData) => {
    setSubmitting(true);

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order object
      const order = {
        id: `order_${Date.now()}`,
        userId: user.id,
        items,
        subtotal: total,
        tax: calculateTax(),
        total: calculateTotal(),
        paymentMethod: values.paymentMethod,
        deliveryOption: values.deliveryOption,
        customerNotes: values.customerNotes,
        status: {
          status: "pending" as const,
          updatedAt: new Date(),
          notes: "Order placed successfully",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Clear cart after successful order
      clearCart();

      // Show success message
      message.success(
        "Order placed successfully! Carlitos will contact you soon."
      );

      // Redirect to order confirmation
      router.push(`/orders/${order.id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      message.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const paymentMethods = [
    {
      type: PaymentMethodType.CASH_ON_DELIVERY,
      title: "Cash on Delivery",
      description: "Pay when Carlitos delivers your order",
      icon: <DollarOutlined className="text-2xl text-green-600" />,
    },
    {
      type: PaymentMethodType.CARD,
      title: "Credit/Debit Card",
      description: "Pay securely with your card",
      icon: <CreditCardOutlined className="text-2xl text-blue-600" />,
    },
    {
      type: PaymentMethodType.TRANSFER,
      title: "Bank Transfer",
      description: "Transfer to our bank account",
      icon: <BankOutlined className="text-2xl text-purple-600" />,
    },
  ];

  const deliveryOptions = [
    {
      type: DeliveryType.DELIVER_TO_LOCATION,
      title: "Deliver to my location",
      description: "Carlitos will bring your order to your classroom",
      icon: <EnvironmentOutlined className="text-2xl text-orange-600" />,
    },
    {
      type: DeliveryType.PICKUP,
      title: "Pick up at store",
      description: "Pick up your order at the store location",
      icon: <ShoppingOutlined className="text-2xl text-red-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-1">
              Complete your order for delivery on campus
            </p>
          </div>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/cart")}
            className="text-gray-600 hover:text-orange-600"
          >
            Back to Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                paymentMethod: { type: PaymentMethodType.CASH_ON_DELIVERY },
                deliveryOption: { type: DeliveryType.DELIVER_TO_LOCATION },
              }}
            >
              {/* Payment Method */}
              <PaymentMethodSection form={form} />

              {/* Delivery Options */}
              <Card className="mb-6">
                <div className="flex items-center mb-4">
                  <EnvironmentOutlined className="text-xl text-gray-700 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Delivery Options
                  </h2>
                </div>

                <Form.Item
                  name={["deliveryOption", "type"]}
                  rules={[{ required: true }]}
                >
                  <Radio.Group className="w-full">
                    <div className="space-y-4">
                      {deliveryOptions.map((option) => (
                        <Radio
                          key={option.type}
                          value={option.type}
                          className="w-full"
                        >
                          <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                            <div className="mr-4">{option.icon}</div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">
                                {option.title}
                              </div>
                              <div className="text-sm text-gray-600">
                                {option.description}
                              </div>
                            </div>
                          </div>
                        </Radio>
                      ))}
                    </div>
                  </Radio.Group>
                </Form.Item>

                {/* Location Details */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      name={["deliveryOption", "location", "building"]}
                      label="Building"
                      rules={[
                        { required: true, message: "Please enter building" },
                      ]}
                    >
                      <Input placeholder="e.g., Main Building, Science Center" />
                    </Form.Item>
                    <Form.Item
                      name={["deliveryOption", "location", "classroom"]}
                      label="Classroom/Office"
                      rules={[
                        {
                          required: true,
                          message: "Please enter classroom/office",
                        },
                      ]}
                    >
                      <Input placeholder="e.g., Room 101, Office 205" />
                    </Form.Item>
                  </div>

                  <Form.Item
                    name={["deliveryOption", "location", "additionalInfo"]}
                    label="Additional Information"
                  >
                    <Input placeholder="e.g., 2nd floor, near elevator" />
                  </Form.Item>

                  <Form.Item
                    name={["deliveryOption", "preferredTime"]}
                    label="Preferred Time"
                  >
                    <Select placeholder="Select preferred time">
                      <Option value="asap">As soon as possible</Option>
                      <Option value="lunch">During lunch break</Option>
                      <Option value="afternoon">Afternoon</Option>
                      <Option value="evening">Evening</Option>
                    </Select>
                  </Form.Item>
                </div>
              </Card>

              {/* Additional Notes */}
              <Card className="mb-6">
                <Form.Item name="customerNotes" label="Additional Notes">
                  <TextArea
                    rows={4}
                    placeholder="Any special instructions for Carlitos..."
                  />
                </Form.Item>
              </Card>
            </Form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                {/* Items */}
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {item.product.name}
                      </div>
                      <div className="text-gray-600">Qty: {item.quantity}</div>
                    </div>
                    <span className="font-medium text-gray-900 ml-4">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                ))}

                <Divider />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">
                      {formatPrice(calculateTax())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                </div>

                <Divider />

                <div className="flex justify-between">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>

                {/* Submit Button */}
                <Button
                  type="primary"
                  size="large"
                  onClick={() => form.submit()}
                  loading={submitting}
                  className="w-full h-12 text-lg font-semibold mt-6"
                  icon={<ShoppingOutlined />}
                >
                  {submitting ? "Processing..." : "Place Order"}
                </Button>

                {/* Security Info */}
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <span className="material-icons-round text-sm mr-1">
                      security
                    </span>
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
