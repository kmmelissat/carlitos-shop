import React, { useState, useEffect } from "react";
import { Form, Input, Select } from "antd";
import { DeliveryType } from "@/types";

interface DeliveryOptionSectionProps {
  form: any;
}

const deliveryOptions = [
  {
    type: DeliveryType.DELIVER_TO_LOCATION,
    title: "Deliver to my location",
    description: "Carlitos will bring your order to your classroom",
    icon: <span className="material-icons-round">location_on</span>,
  },
  {
    type: DeliveryType.PICKUP,
    title: "Pick up at store",
    description: "Pick up your order at the store location",
    icon: <span className="material-icons-round">store</span>,
  },
];

const { Option } = Select;

const DeliveryOptionSection: React.FC<DeliveryOptionSectionProps> = ({
  form,
}) => {
  const [selectedDelivery, setSelectedDelivery] = useState(
    DeliveryType.DELIVER_TO_LOCATION
  );

  useEffect(() => {
    form.setFieldsValue({ deliveryOption: { type: selectedDelivery } });
  }, []);

  const handleSelectDelivery = (type: DeliveryType) => {
    setSelectedDelivery(type);
    form.setFieldsValue({ deliveryOption: { type } });

    // Clear location details when switching to pickup
    if (type === DeliveryType.PICKUP) {
      form.setFieldsValue({
        deliveryOption: {
          type,
          location: {
            building: undefined,
            classroom: undefined,
            additionalInfo: undefined,
          },
          preferredTime: undefined,
        },
      });
    }
  };

  return (
    <div className="mb-8">
      <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-6">
        <span className="material-icons-round w-7 h-7 mr-3 text-gray-800">
          local_shipping
        </span>
        Delivery Option
      </h2>
      <div className="space-y-4">
        {deliveryOptions.map((option) => {
          const selected = selectedDelivery === option.type;
          const colorMap = {
            [DeliveryType.DELIVER_TO_LOCATION]:
              "bg-orange-50 border-orange-300",
            [DeliveryType.PICKUP]: "bg-blue-50 border-blue-300",
          };
          const iconBgMap = {
            [DeliveryType.DELIVER_TO_LOCATION]: "bg-orange-200 text-orange-600",
            [DeliveryType.PICKUP]: "bg-blue-200 text-blue-600",
          };
          return (
            <button
              type="button"
              key={option.type}
              tabIndex={0}
              aria-checked={selected}
              aria-label={option.title}
              onClick={() => handleSelectDelivery(option.type)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  handleSelectDelivery(option.type);
              }}
              className={`flex items-center w-full cursor-pointer rounded-2xl border transition-all px-6 py-5 text-left focus:outline-none ${
                selected
                  ? `${colorMap[option.type]}`
                  : "bg-white border-gray-200"
              }`}
            >
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-full mr-5 text-2xl ${
                  iconBgMap[option.type]
                }`}
              >
                {option.icon}
              </span>
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-900">
                  {option.title}
                </div>
                <div className="text-gray-600 text-base">
                  {option.description}
                </div>
              </div>
              <span
                className={`ml-4 w-5 h-5 flex items-center justify-center border-2 rounded-full ${
                  selected
                    ? `border-${
                        option.type === DeliveryType.DELIVER_TO_LOCATION
                          ? "orange"
                          : "blue"
                      }-500`
                    : "border-gray-300"
                }`}
              >
                {selected && (
                  <span
                    className={`w-3 h-3 rounded-full ${
                      option.type === DeliveryType.DELIVER_TO_LOCATION
                        ? "bg-orange-500"
                        : "bg-blue-500"
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
        {selectedDelivery === DeliveryType.DELIVER_TO_LOCATION && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name={["deliveryOption", "location", "building"]}
              label={
                <span className="font-semibold text-gray-900">Building</span>
              }
              rules={[
                {
                  required:
                    selectedDelivery === DeliveryType.DELIVER_TO_LOCATION,
                  message: "Please enter building",
                },
              ]}
              className="mb-0"
            >
              <Input
                placeholder="e.g., Main Building, Science Center"
                className="h-12 text-base placeholder-gray-400"
              />
            </Form.Item>
            <Form.Item
              name={["deliveryOption", "location", "classroom"]}
              label={
                <span className="font-semibold text-gray-900">
                  Classroom/Office
                </span>
              }
              rules={[
                {
                  required:
                    selectedDelivery === DeliveryType.DELIVER_TO_LOCATION,
                  message: "Please enter classroom/office",
                },
              ]}
              className="mb-0"
            >
              <Input
                placeholder="e.g., Room 101, Office 205"
                className="h-12 text-base placeholder-gray-400"
              />
            </Form.Item>
            <Form.Item
              name={["deliveryOption", "location", "additionalInfo"]}
              label={
                <span className="font-semibold text-gray-900">
                  Additional Information
                </span>
              }
              className="mb-0"
            >
              <Input
                placeholder="e.g., 2nd floor, near elevator"
                className="h-12 text-base placeholder-gray-400"
              />
            </Form.Item>
            <Form.Item
              name={["deliveryOption", "preferredTime"]}
              label={
                <span className="font-semibold text-gray-900">
                  Preferred Time
                </span>
              }
              className="mb-0"
            >
              <Select
                placeholder="Select preferred time"
                className="h-12 text-base"
              >
                <Option value="asap">As soon as possible</Option>
                <Option value="lunch">During lunch break</Option>
                <Option value="afternoon">Afternoon</Option>
                <Option value="evening">Evening</Option>
              </Select>
            </Form.Item>
          </div>
        )}
        {selectedDelivery === DeliveryType.PICKUP && (
          <div className="mt-6 bg-blue-50 rounded-2xl p-6 flex flex-col items-center">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-200 text-blue-600 text-3xl mb-4">
              <span className="material-icons-round text-4xl">store</span>
            </span>
            <div className="font-bold text-xl text-blue-700 mb-2">
              Pick up at Store Selected
            </div>
            <div className="text-blue-700 text-base mb-4 text-center">
              You will pick up your order at the store location. Please wait for
              confirmation before coming.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryOptionSection;
