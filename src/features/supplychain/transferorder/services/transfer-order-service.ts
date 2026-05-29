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

export const createTransferOrder = async (payload: CreateTransferOrderPayload): Promise<any> => {
  const response = await api.master.post('/transfer-orders', payload);
  return response as any;
};

export const getTransferOrders = async (page: number = 1, pageSize: number = 20): Promise<any> => {
  const response = await api.master.get(`/transfer-orders?page=${page}&pageSize=${pageSize}`);
  return response as any;
};

export const getTransferOrderById = async (id: string): Promise<any> => {
  const response = await api.master.get(`/transfer-orders/${id}`);
  return response as any;
};

export default createTransferOrder;
