import React, { useState, useEffect } from "react";
import { Form, Input } from "antd";
import {
  DollarOutlined,
  CreditCardOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { PaymentMethodType } from "@/types";

interface PaymentMethodSectionProps {
  form: any;
}

const paymentMethods = [
  {
    type: PaymentMethodType.CASH_ON_DELIVERY,
    title: "Cash on Delivery",
    description: "Pay when Carlitos delivers your order",
    icon: <span className="material-icons-round">attach_money</span>,
  },
  {
    type: PaymentMethodType.CARD,
    title: "Credit/Debit Card",
    description: "Pay securely with your card",
    icon: <span className="material-icons-round">credit_card</span>,
  },
  {
    type: PaymentMethodType.TRANSFER,
    title: "Bank Transfer",
    description: "Transfer to our bank account",
    icon: <span className="material-icons-round">account_balance</span>,
  },
];

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  form,
}) => {
  const [selectedPayment, setSelectedPayment] = useState(
    PaymentMethodType.CASH_ON_DELIVERY
  );

  useEffect(() => {
    form.setFieldsValue({ paymentMethod: { type: selectedPayment } });
  }, []);

  const handleSelectPayment = (type: PaymentMethodType) => {
    setSelectedPayment(type);
    form.setFieldsValue({ paymentMethod: { type } });
  };

  return (
    <div className="mb-8">
      <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-6">
        <svg
          className="w-7 h-7 mr-3 text-gray-800"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <rect
            x="2"
            y="7"
            width="20"
            height="10"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
        </svg>
        Payment Method
      </h2>
      <div className="space-y-4">
        {paymentMethods.map((method) => {
          const selected = selectedPayment === method.type;
          const colorMap = {
            [PaymentMethodType.CASH_ON_DELIVERY]:
              "bg-green-100 border-green-300",
            [PaymentMethodType.CARD]: "bg-blue-50 border-blue-300",
            [PaymentMethodType.TRANSFER]: "bg-purple-50 border-purple-300",
          };
          const iconBgMap = {
            [PaymentMethodType.CASH_ON_DELIVERY]: "bg-green-200 text-green-600",
            [PaymentMethodType.CARD]: "bg-blue-200 text-blue-600",
            [PaymentMethodType.TRANSFER]: "bg-purple-200 text-purple-600",
          };
          return (
            <button
              type="button"
              key={method.type}
              tabIndex={0}
              aria-checked={selected}
              aria-label={method.title}
              onClick={() => handleSelectPayment(method.type)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  handleSelectPayment(method.type);
              }}
              className={`flex items-center w-full cursor-pointer rounded-2xl border transition-all px-6 py-5 text-left focus:outline-none ${
                selected
                  ? `${colorMap[method.type]}`
                  : "bg-white border-gray-200"
              }`}
            >
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-full mr-5 text-2xl ${
                  iconBgMap[method.type]
                }`}
              >
                {method.icon}
              </span>
              <div className="flex-1">
                <div
                  className="font-bold text-lg text-gray-900"
                  style={{ fontFamily: "Mona Sans" }}
                >
                  {method.title}
                </div>
                <div
                  className="text-gray-600 text-base"
                  style={{ fontFamily: "Mona Sans" }}
                >
                  {method.description}
                </div>
              </div>
              <span
                className={`ml-4 w-5 h-5 flex items-center justify-center border-2 rounded-full ${
                  selected
                    ? `border-${
                        method.type === PaymentMethodType.CASH_ON_DELIVERY
                          ? "green"
                          : method.type === PaymentMethodType.CARD
                          ? "blue"
                          : "purple"
                      }-500`
                    : "border-gray-300"
                }`}
              >
                {selected && (
                  <span
                    className={`w-3 h-3 rounded-full ${
                      method.type === PaymentMethodType.CASH_ON_DELIVERY
                        ? "bg-green-500"
                        : method.type === PaymentMethodType.CARD
                        ? "bg-blue-500"
                        : "bg-purple-500"
                    }`}
                  ></span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Conditional Details */}
      <div className="mt-8">
        {selectedPayment === PaymentMethodType.CARD && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name={["paymentMethod", "details", "cardNumber"]}
              label={
                <span className="font-semibold text-gray-900">Card Number</span>
              }
              rules={[{ required: true, message: "Please enter card number" }]}
              className="mb-0"
            >
              <Input
                placeholder="1234 5678 9012 3456"
                className="h-12 text-base placeholder-gray-400"
                style={{ fontFamily: "Mona Sans" }}
              />
            </Form.Item>
            <Form.Item
              name={["paymentMethod", "details", "cardHolder"]}
              label={
                <span className="font-semibold text-gray-900">
                  Cardholder Name
                </span>
              }
              rules={[
                { required: true, message: "Please enter cardholder name" },
              ]}
              className="mb-0"
            >
              <Input
                placeholder="John Doe"
                className="h-12 text-base placeholder-gray-400"
                style={{ fontFamily: "Mona Sans" }}
              />
            </Form.Item>
            <Form.Item
              name={["paymentMethod", "details", "expiryDate"]}
              label={
                <span className="font-semibold text-gray-900">Expiry Date</span>
              }
              rules={[{ required: true, message: "Please enter expiry date" }]}
              className="mb-0"
            >
              <Input
                placeholder="MM/YY"
                className="h-12 text-base placeholder-gray-400"
                style={{ fontFamily: "Mona Sans" }}
              />
            </Form.Item>
            <Form.Item
              name={["paymentMethod", "details", "cvv"]}
              label={<span className="font-semibold text-gray-900">CVV</span>}
              rules={[{ required: true, message: "Please enter CVV" }]}
              className="mb-0"
            >
              <Input
                placeholder="123"
                className="h-12 text-base placeholder-gray-400"
                style={{ fontFamily: "Mona Sans" }}
              />
            </Form.Item>
          </div>
        )}
        {selectedPayment === PaymentMethodType.TRANSFER && (
          <div className="mt-6">
            <div className="bg-purple-50 rounded-2xl p-6 mb-6">
              <div
                className="font-bold text-xl text-purple-700 mb-4"
                style={{ fontFamily: "Mona Sans" }}
              >
                Bank Transfer Details
              </div>
              <div
                className="grid grid-cols-2 gap-2 text-base"
                style={{ fontFamily: "Mona Sans" }}
              >
                <div className="text-gray-700">Bank Name:</div>
                <div className="text-right text-gray-900 font-semibold">
                  Banco Agricola
                </div>
                <div className="text-gray-700">Account Number:</div>
                <div className="text-right text-gray-900 font-semibold">
                  1234567890
                </div>
                <div className="text-gray-700">Routing Number:</div>
                <div className="text-right text-gray-900 font-semibold">
                  987654321
                </div>
                <div className="text-gray-700">Account Name:</div>
                <div className="text-right text-gray-900 font-semibold">
                  Carlitos Snacks Ltd.
                </div>
              </div>
            </div>
            <Form.Item
              name={["paymentMethod", "details", "transferReference"]}
              label={
                <span className="font-semibold text-gray-900">
                  Transfer Reference ID
                </span>
              }
              rules={[
                { required: true, message: "Please enter transfer reference" },
              ]}
              className="mb-0"
            >
              <Input
                placeholder="Enter your transfer reference ID"
                className="h-12 text-base placeholder-gray-400"
                style={{ fontFamily: "Mona Sans" }}
              />
            </Form.Item>
            <div
              className="text-sm text-gray-500 mt-2"
              style={{ fontFamily: "Mona Sans" }}
            >
              Please enter the reference ID from your bank transfer receipt
            </div>
          </div>
        )}
        {selectedPayment === PaymentMethodType.CASH_ON_DELIVERY && (
          <div className="mt-6 bg-green-50 rounded-2xl p-6 flex flex-col items-center">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-green-200 text-green-600 text-3xl mb-4">
              <span className="material-icons-round text-4xl">
                attach_money
              </span>
            </span>
            <div
              className="font-bold text-xl text-green-700 mb-2"
              style={{ fontFamily: "Mona Sans" }}
            >
              Cash on Delivery Selected
            </div>
            <div
              className="text-green-700 text-base mb-4 text-center"
              style={{ fontFamily: "Mona Sans" }}
            >
              You will pay in cash when Carlitos delivers your order to your
              doorstep.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSection;
