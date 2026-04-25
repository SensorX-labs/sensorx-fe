import api from "@/shared/configs/axios-config";
import { Result } from "@/shared/models/base-response";
import { CreateInternalPriceRequest, GetPageListInternalPriceQuery, InternalPriceListResult, InternalPriceStatsResult, ProductInternalPriceHistoryResult } from "../models";

const InternalPriceService = {
  /**
   * Lấy thống kế số lượng bảng giá nội bộ
   */
  getStats: () =>
    api.data.get<any, InternalPriceStatsResult>("/catalog/internalPrices/stats"),

  /**
   * Lấy danh sách bảng giá nội bộ phân trang
   */
  getList: (params: GetPageListInternalPriceQuery) =>
    api.data.get<any, InternalPriceListResult>("/catalog/internalPrices/list", { params }),

  /**
   * Tạo bảng giá nội bộ
   */
  create: (request: CreateInternalPriceRequest) =>
    api.data.post<CreateInternalPriceRequest, Result<string>>("/catalog/internalPrices/create", request),

  /**
   * Vô hiệu hóa bảng giá nội bộ
   */
  deactivate: (id: string) =>
    api.data.post<any, Result<string>>(`/catalog/internalPrices/${id}/deactivate`),

  /**
   * Gia hạn bảng giá nội bộ
   */
  extend: (id: string) =>
    api.data.post<any, Result<string>>(`/catalog/internalPrices/${id}/extend`),

  /**
   * Lấy lịch sử bảng giá nội bộ
   */
  getHistory: (productId: string) =>
    api.data.get<any, ProductInternalPriceHistoryResult>(`/catalog/internalPrices/product/${productId}/history`),
};

export default InternalPriceService;
