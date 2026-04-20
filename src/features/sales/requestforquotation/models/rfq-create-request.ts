export interface RfqCreateItem {
  productId: string;
  productName: string;
  quantity: number;
  productCode: string;
  manufacturer: string;
  unit: string;
}

export interface RfqCreateRequest {
  customerId: string;
  recipientName: string;
  recipientPhone: string;
  companyName: string;
  email: string;
  address: string;
  taxCode: string;
  items: RfqCreateItem[];
}
