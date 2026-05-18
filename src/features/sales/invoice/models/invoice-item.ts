export interface InvoiceItem {
  id?: string;
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  lineAmount: number;
  taxAmount: number;
  totalLineAmount: number;
}
