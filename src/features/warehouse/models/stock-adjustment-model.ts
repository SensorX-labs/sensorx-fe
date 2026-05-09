export interface StockAdjustmentItem {
  productId: string;
  productCode: string;
  productName: string;
  unit: string;
  adjustedQuantity: number;
  note?: string;
}

export type StockAdjustmentStatus = "Pending" | "Approved" | "Rejected";

export interface StockAdjustment {
  id: string;
  code: string;
  reason?: string;
  description?: string;
  status: StockAdjustmentStatus;
  createdAt: string;
  createdBy: string;
  items: StockAdjustmentItem[];
}