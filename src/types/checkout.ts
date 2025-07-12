import { CartItem } from "./product";
import { User } from "./user";

export enum PaymentMethodType {
  CASH_ON_DELIVERY = "cash_on_delivery",
  CARD = "card",
  TRANSFER = "transfer",
}

export enum DeliveryType {
  DELIVER_TO_LOCATION = "deliver_to_location",
  PICKUP = "pickup",
}

export enum OrderStatusType {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  READY_FOR_DELIVERY = "ready_for_delivery",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export interface PaymentMethod {
  type: PaymentMethodType;
  details?: {
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
    transferReference?: string;
  };
}

export interface DeliveryOption {
  type: DeliveryType;
  location: {
    building: string;
    classroom: string;
    additionalInfo?: string;
  };
  preferredTime?: string;
  notes?: string;
}

export interface CheckoutFormData {
  paymentMethod: PaymentMethod;
  deliveryOption: DeliveryOption;
  customerNotes?: string;
}

export interface OrderStatus {
  status: OrderStatusType;
  updatedAt: Date;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  deliveryOption: DeliveryOption;
  customerNotes?: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
}
