import { QuoteStatus } from "../constants/quote-status";
import { QuoteResponseStatus } from '../services/quote.service';

export interface GetDetailQuoteByIdResponse {
  id: string;
  code: string;
  rfqId: string;
  status: QuoteStatus;
  quoteDate?: string | null;
  note?: string | null;
  reasonReject?: string | null;

  subtotal: number;
  totalTax: number;
  grandTotal: number;
  items: QuoteItemResponse[];

  customer: CustomerInfoResponse;
  customerFeedback: QuoteCustomerResponse;
  sender: SenderInfoResponse;
};

export interface CustomerInfoResponse {
  id: string;
  companyName: string;
  phone: string;
  email: string;
  address: string;
  taxCode: string;
};

export interface SenderInfoResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};

export interface QuoteCustomerResponse {
  responseType: QuoteResponseStatus | number;
  paymentTerm: string;
  shippingAddress: string;
  recipientName: string;
  recipientPhone: string;
  feedback: string | null;
};

export interface QuoteItemResponse {
  id: string;
  productId: string;
  productCode: string;
  manufacturer: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  lineAmount: number;
  taxAmount: number;
  totalLineAmount: number;
};