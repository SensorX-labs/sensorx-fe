export interface QuoteListItem {
  id: string;
  code: string;
  status: string;
  quoteDate: string;
  customerId: string;
  recipientName: string;
  recipientPhone?: string; // Có thể không có trong list
  companyName: string;
  email?: string;          // Có thể không có trong list
  taxCode?: string;        // Có thể không có trong list
  address?: string;        // Có thể không có trong list
  grandTotal: number;
  itemCount: number;
  createdAt: string;
  parentId?: string | null;
}
