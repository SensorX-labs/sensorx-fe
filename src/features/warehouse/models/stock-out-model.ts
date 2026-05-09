export interface StockOutItem {
  productId: string;
  productCode: string;
  productName: string;
  unit: string;
  quantity: number;
}

export interface StockOut {
  id: string;
  code: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  pickingNoteId?: string;
  items: StockOutItem[];
}