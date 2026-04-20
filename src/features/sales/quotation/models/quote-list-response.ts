export interface QuoteListItem {
  id: string;
  code: string;
  customerId: string;
  companyName: string;
  recipientName: string;
  recipientPhone: string;
  email: string;
  taxCode: string;
  address: string;
  totalAmount: number;
  status: string;
  quoteDate: string;
  parentId: string | null;
}
