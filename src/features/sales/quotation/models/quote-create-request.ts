export interface QuoteCreateItem {
  productId: string;
  productCode: string;
  manufacturer: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export interface QuoteCreateRequest {
  rfqId: string;
  customerId: string;
  recipientName: string;
  recipientPhone: string;
  companyName: string;
  email: string;
  address: string;
  taxCode: string;
  note: string;
  quoteDate: string;
  shippingAddress: string;
  paymentTermDays: number;
  items: QuoteCreateItem[];
}
