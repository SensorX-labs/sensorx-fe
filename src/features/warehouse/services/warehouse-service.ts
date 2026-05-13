import api from '@/shared/configs/axios-config';

export const getPickingNotes = async (params: Record<string, any>) => {
  return await api.warehouse.get('/pickingNote/getPickingNotes', { params });
};

export const getPickingNote = async (id: string) => {
  return await api.warehouse.get(`/pickingNote/getPickingNote/${id}`);
};

export const getStockIns = async (params: Record<string, any>) => {
  return await api.warehouse.get('/stockIn/list', { params });
};

export const getStockInDetail = async (id: string) => {
  return await api.warehouse.get(`/stockIn/${id}`);
};

export const getStockOuts = async (params: Record<string, any>) => {
  return await api.warehouse.get('/stockOut/list', { params: { ...params, isAdjustmentOnly: false } });
};

export const getStockOutDetail = async (id: string) => {
  return await api.warehouse.get(`/stockOut/detail/${id}`);
};

export const getStockAdjustments = async (params: Record<string, any>) => {
  return await api.warehouse.get('/stockOut/list', { params: { ...params, isAdjustmentOnly: true } });
};

export const getStockAdjustmentDetail = async (id: string) => {
  return await api.warehouse.get(`/stockOut/detail/${id}`);
};

export const getWarehouses = async () => {
  return await api.master.get('/warehouses');
};

export const getWarehouse = async (id: string) => {
  return await api.master.get(`/warehouses/${id}`);
};

