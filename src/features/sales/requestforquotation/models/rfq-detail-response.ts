export interface RfqDetailItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  manufacturer: string;
  unit: string;
}

export interface RfqDetail {
  id: string;
  code: string;
  staffId: string | null;
  customerId: string;
  status: string;
  createdAt: string;
  recipientName: string;
  recipientPhone: string;
  companyName: string;
  email: string;
  address: string;
  taxCode: string;
  items: RfqDetailItem[];
}