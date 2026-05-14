export interface StockInItem {
  productId: string;
  productCode: string;
  productName: string;
  unit: string;
  quantity: number;
}

export interface StockIn {
  id: string;
  code: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  devliveredBy?: string;
  warehouseKeeper?: string;
  items: StockInItem[];
}