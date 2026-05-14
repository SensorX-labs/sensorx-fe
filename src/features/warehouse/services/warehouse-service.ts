import api from '@/shared/configs/axios-config';

export const getPickingNotes = async (params: Record<string, any>) => {
  const { warehouseId, ...restParams } = params;
  const config: any = { params: restParams };
  if (warehouseId) {
    config.headers = { 'X-Warehouse-Id': warehouseId };
  }
  return await api.warehouse.get('/pickingNote/getPickingNotes', config);
};

export const getPickingNote = async (id: string) => {
  return await api.warehouse.get(`/pickingNote/getPickingNote/${id}`);
};

export const getStockIns = async (params: Record<string, any>) => {
  const { warehouseId, ...restParams } = params;
  const config: any = { params: restParams };
  if (warehouseId) {
    config.headers = { 'X-Warehouse-Id': warehouseId };
  }
  return await api.warehouse.get('/stockIn/list', config);
};

export const getStockInDetail = async (id: string) => {
  return await api.warehouse.get(`/stockIn/${id}`);
};

export const getStockOuts = async (params: Record<string, any>) => {
  const { warehouseId, ...restParams } = params;
  const config: any = { params: { ...restParams, isAdjustmentOnly: false } };
  if (warehouseId) {
    config.headers = { 'X-Warehouse-Id': warehouseId };
  }
  return await api.warehouse.get('/stockOut/list', config);
};

export const getStockOutDetail = async (id: string) => {
  return await api.warehouse.get(`/stockOut/detail/${id}`);
};

export const getStockAdjustments = async (params: Record<string, any>) => {
  const { warehouseId, ...restParams } = params;
  const config: any = { params: { ...restParams, isAdjustmentOnly: true } };
  if (warehouseId) {
    config.headers = { 'X-Warehouse-Id': warehouseId };
  }
  return await api.warehouse.get('/stockOut/list', config);
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

export const createStockAdjustment = async (data: any, warehouseId?: string) => {
  const config = warehouseId ? { headers: { 'X-Warehouse-Id': warehouseId } } : {};
  return await api.warehouse.post('/stockOut/createStockOut', data, config);
};

export const createPickingNote = async (data: any, warehouseId?: string) => {
  const config = warehouseId ? { headers: { 'X-Warehouse-Id': warehouseId } } : {};
  return await api.warehouse.post('/pickingNote/createPickingNote', data, config);
};

export const createStockIn = async (data: any, warehouseId?: string) => {
  const config = warehouseId ? { headers: { 'X-Warehouse-Id': warehouseId } } : {};
  return await api.warehouse.post('/stockIn/createStockIn', data, config);
};

