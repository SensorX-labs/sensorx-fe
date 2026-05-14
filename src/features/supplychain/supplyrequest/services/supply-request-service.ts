import api from '@/shared/configs/axios-config';

export const getSupplyRequests = async (params?: Record<string, any>) => {
  const response = await api.master.get('/supply-requests', { params });
  return response.data?.value || response.data;
};

export const getSupplyRequestById = async (id: string) => {
  const response = await api.master.get(`/supply-requests/${id}`);
  return response.data?.value || response.data;
};

export const createSupplyRequest = async (payload: {
  code: string;
  warehouseId: string;
  note: string;
  items: { productId: string; requestedQuantity: number }[];
}) => {
  const response = await api.master.post('/supply-requests', payload);
  return response.data?.value || response.data;
};

export const processSupplyRequest = async (payload: {
  supplyRequestId: string;
  purchaseOptions: { productId: string; quantity: number; note: string }[];
  completeRequest: boolean;
}) => {
  const response = await api.master.post('/supply-requests/process', payload);
  return response.data?.value || response.data;
};
