import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'X-User-FullName': 'TestUser' },
});

export const getPickingNotes = async (params: Record<string, any>) => {
  const { data } = await api.get('/pickingNote/getPickingNotes', { params });
  return data.items || [];
};

export const getPickingNote = async (id: string) => {
  const { data } = await api.get(`/pickingNote/getPickingNote/${id}`);
  return data;
};

export const getStockIns = async (params: Record<string, any>) => {
  const { data } = await api.get('/stockIn/list', { params });
  return data.items || [];
};

export const getStockInDetail = async (id: string) => {
  const { data } = await api.get(`/stockIn/detail/${id}`);
  return data;
};

export const getStockOuts = async (params: Record<string, any>) => {
  const { data } = await api.get('/stockOut/list', { params });
  return data.items || [];
};

export const getStockOutDetail = async (id: string) => {
  const { data } = await api.get(`/stockOut/detail/${id}`);
  return data;
};

export const getStockAdjustments = async (params: Record<string, any>) => {
  const { data } = await api.get('/stockAdjustment/list', { params });
  return data.items || [];
};

export const getStockAdjustmentDetail = async (id: string) => {
  const { data } = await api.get(`/stockAdjustment/detail/${id}`);
  return data;
};

export const getWarehouses = async () => {
  const { data } = await api.get('/warehouse/list');
  return data;
};

export const getWarehouse = async (id: string) => {
  const { data } = await api.get(`/warehouse/getWarehouse/${id}`);
  return data;
};