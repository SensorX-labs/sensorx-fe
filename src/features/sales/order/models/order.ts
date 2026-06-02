import { OrderStatus } from "../enums/order-status";
import { OrderItem } from "./order-item";

export interface Order {
  id: string;
  quoteId: string;
  code: string;
  customerId: string;
  recipientName: string;
  recipientPhone: string;
  companyName: string;
  email: string;
  customerEmail?: string;
  address: string;
  taxCode: string;
  senderName: string;
  senderEmail: string;
  status: OrderStatus;
  orderDate: string;
  subtotal: number;
  totalTax: number;
  grandTotal: number;
  items: OrderItem[];
  orderItems?: OrderItem[];
  paymentId?: string;
  paymentStatus?: string;
  paymentType?: string;
  paymentQRURls?: string[];
  paymentAmount?: number;
}

export interface OrderListItem {
  id: string;
  quoteId: string;
  code: string;
  customerId: string;
  recipientName: string;
  companyName: string;
  status: OrderStatus;
  orderDate: string;
  grandTotal: number;
  itemCount: number;
  createdAt: string;
}
