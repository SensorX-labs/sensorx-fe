import api from '@/shared/configs/axios-config';

export interface TransferOrderItem {
  productId: string;
  productCode: string;
  productName: string;
  unit: string;
  quantity: number;
  manufactureName: string;
  note?: string;
}

export interface CreateTransferOrderPayload {
  code: string;
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  note: string;
  items: TransferOrderItem[];
  pickingNoteId?: string | null;
  supplyRequestId?: string | null;
}

export const createTransferOrder = async (payload: CreateTransferOrderPayload) => {
  const response = await api.master.post('/transfer-orders', payload);
  return response.data?.value || response.data;
};

export default createTransferOrder;
