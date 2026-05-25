import api from "@/shared/configs/axios-config";
import {
  CreateUnitOfQuantityRequest,
  UnitOfQuantity,
  UnitOfQuantityListResult,
  UnitOfQuantityPageListQuery,
  UnitOfQuantityPageListResult,
  UpdateUnitOfQuantityRequest,
} from "../models";

const UnitOfQuantityService = {
  getPaged: (params: UnitOfQuantityPageListQuery) =>
    api.data.get<unknown, UnitOfQuantityPageListResult>("/catalog/unit-of-quantities/list", { params }),

  getAll: () =>
    api.data.get<unknown, UnitOfQuantityListResult>("/catalog/unit-of-quantities/list-all"),

  getById: (id: string) =>
    api.data.get<unknown, UnitOfQuantity>(`/catalog/unit-of-quantities/${id}`),

  create: (request: CreateUnitOfQuantityRequest) =>
    api.data.post<unknown, string>("/catalog/unit-of-quantities/create", request),

  update: (id: string, request: UpdateUnitOfQuantityRequest) =>
    api.data.put<unknown, string>(`/catalog/unit-of-quantities/${id}`, request),

  delete: (id: string) =>
    api.data.delete<unknown, string>(`/catalog/unit-of-quantities/${id}`),
};

export default UnitOfQuantityService;
