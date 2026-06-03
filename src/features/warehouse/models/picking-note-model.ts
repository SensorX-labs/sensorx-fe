export interface PickingNoteDeliveryInfo {
  receiverName: string;
  receiverPhone: string;
  deliveryAddress: string;
  companyName?: string;
  taxCode?: string;
}

export interface PickingNoteItem {
  productId: string;
  productCode: string;
  productName: string;
  unit: string;
  quantity: number;
  manufactureName?: string;
  note?: string;
}

export type PickingNoteStatus = "Pending" | "Picking" | "Completed" | "Canceled";

export interface PickingNote {
  id: string;
  code: string;
  description?: string;
  status: PickingNoteStatus;
  createdAt: string;
  createdBy: string;
  deliveryInfo?: PickingNoteDeliveryInfo;
  items: PickingNoteItem[];
  transferOrderCode?: string;
  warehouseId?: string;
}