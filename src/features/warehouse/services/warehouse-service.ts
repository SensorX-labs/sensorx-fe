import axios from 'axios';

// Axios instance with default baseURL & interceptors if needed
const api = axios.create({
  baseURL: '/api',
  headers: {
    'X-User-FullName': 'TestUser',
  },
});

// --- Picking Note ---
export const getPickingNotes = async (params: Record<string, any>) => {
  const { data } = await api.get('/pickingNote/getPickingNotes', { params });
  return data;
};

export const getPickingNote = async (id: string) => {
  const { data } = await api.get(`/pickingNote/getPickingNote/${id}`);
  return data;
};

export const createPickingNote = async (payload: any) => {
  const { data } = await api.post('/pickingNote/createPickingNote', payload);
  return data;
};

export const startPicking = async (payload: any) => {
  const { data } = await api.post('/pickingNote/startPicking', payload);
  return data;
};

export const completePicking = async (payload: any) => {
  const { data } = await api.post('/pickingNote/completePicking', payload);
  return data;
};

export const cancelPicking = async (payload: any) => {
  const { data } = await api.post('/pickingNote/cancelPicking', payload);
  return data;
};

// --- Stock Adjustment ---
export const getStockAdjustments = async (params: Record<string, any>) => {
  const { data } = await api.get('/stockAdjustment/list', { params });
  return data;
};

export const getStockAdjustmentDetail = async (id: string) => {
  const { data } = await api.get(`/stockAdjustment/detail/${id}`);
  return data;
};

export const createStockAdjustment = async (payload: any) => {
  const { data } = await api.post('/stockAdjustment/create', payload);
  return data;
};

export const approveStockAdjustment = async (payload: any) => {
  const { data } = await api.post('/stockAdjustment/approve', payload);
  return data;
};

export const rejectStockAdjustment = async (payload: any) => {
  const { data } = await api.post('/stockAdjustment/reject', payload);
  return data;
};

// --- Stock In ---
export const getStockIns = async (params: Record<string, any>) => {
  const { data } = await api.get('/stockIn/list', { params });
  return data;
};

export const createStockIn = async (payload: any) => {
  const { data } = await api.post('/stockIn/createStockIn', payload);
  return data;
};

// --- Stock Out ---
export const getStockOuts = async (params: Record<string, any>) => {
  const { data } = await api.get('/stockOut/list', { params });
  return data;
};

export const createStockOut = async (payload: any) => {
  const { data } = await api.post('/stockOut/createStockOut', payload);
  return data;
};

export default {
  getPickingNotes,
  getPickingNote,
  createPickingNote,
  startPicking,
  completePicking,
  cancelPicking,
  getStockAdjustments,
  getStockAdjustmentDetail,
  createStockAdjustment,
  approveStockAdjustment,
  rejectStockAdjustment,
  getStockIns,
  createStockIn,
  getStockOuts,
  createStockOut,
};
