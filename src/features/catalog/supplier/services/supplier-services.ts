import api from "@/shared/configs/axios-config";
import {
  CreateSupplierRequest,
  Supplier,
  SupplierListResult,
  SupplierPageListQuery,
  SupplierPageListResult,
  UpdateSupplierRequest,
} from "../models";

const SupplierService = {
  getPaged: (params: SupplierPageListQuery) =>
    api.data.get<unknown, SupplierPageListResult>("/catalog/suppliers/list", { params }),

  getAll: () =>
    api.data.get<unknown, SupplierListResult>("/catalog/suppliers/list-all"),

  getById: (id: string) =>
    api.data.get<unknown, Supplier>(`/catalog/suppliers/${id}`),

  create: (request: CreateSupplierRequest) =>
    api.data.post<unknown, string>("/catalog/suppliers/create", request),

  update: (id: string, request: UpdateSupplierRequest) =>
    api.data.put<unknown, string>(`/catalog/suppliers/${id}`, request),

  delete: (id: string) =>
    api.data.delete<unknown, string>(`/catalog/suppliers/${id}`),
};

export default SupplierService;
