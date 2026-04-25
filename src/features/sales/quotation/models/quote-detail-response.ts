export interface QuoteDetailItem {
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
}

export interface QuoteDetail {
  id: string;
  code: string;
  rfqId: string;
  customerId: string;
  status: string;
  quoteDate: string;
  note: string;
  reasonReject: string;
  recipientName: string;
  recipientPhone: string;
  companyName: string;
  email: string;
  address: string;
  taxCode: string;
  customerResponseType: string;
  shippingAddress: string;
  paymentTerm: string;
  customerFeedback: string;
  subtotal: number;
  totalTax: number;
  grandTotal: number;
  items: QuoteDetailItem[];
}
