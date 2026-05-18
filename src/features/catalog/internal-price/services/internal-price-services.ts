import api from "@/shared/configs/axios-config";
import { CreateInternalPriceRequest, ExtendInternalPriceRequest, GetPageListInternalPriceQuery, InternalPrice, InternalPriceListResult, InternalPriceStatsResult, ProductInternalPriceHistoryResult } from "../models";
import { InternalPriceDetail } from "../models/internal-price-detail";
import { ProductInternalPriceSuggestionQuery, ProductInternalPriceSuggestionResult } from "../models/internal-price-suggestion";

const InternalPriceService = {
  /**
   * Lấy thống kế số lượng bảng giá nội bộ
   */
  getStats: () =>
    api.data.get<any, InternalPriceStatsResult>("/catalog/internal-prices/stats"),

  /**
   * Lấy chi tiết bảng giá nội bộ
   */
  getById: (id: string) =>
    api.data.get<any, InternalPriceDetail>(`/catalog/internal-prices/${id}`),

  /**
   * Lấy danh sách bảng giá nội bộ phân trang
   */
  getList: (params: GetPageListInternalPriceQuery) =>
    api.data.get<any, InternalPriceListResult>("/catalog/internal-prices/list", { params }),

  /**
   * Tạo bảng giá nội bộ
   */
  create: (request: CreateInternalPriceRequest) =>
    api.data.post<CreateInternalPriceRequest, string>("/catalog/internal-prices/create", request),

  /**
   * Vô hiệu hóa bảng giá nội bộ
   */
  deactivate: (id: string) =>
    api.data.patch<any, string>(`/catalog/internal-prices/${id}/deactivate`),

  /**
   * Gia hạn bảng giá nội bộ
   */
  extend: (id: string, request: ExtendInternalPriceRequest) =>
    api.data.patch<ExtendInternalPriceRequest, string>(`/catalog/internal-prices/${id}/extend`, request),

  /**
   * Lấy lịch sử bảng giá nội bộ
   */
  getHistory: (productId: string) =>
    api.data.get<any, ProductInternalPriceHistoryResult>(`/catalog/internal-prices/product/${productId}/history`),

  /**
   * Lấy gợi ý giá
   */
  getSuggest: (query: ProductInternalPriceSuggestionQuery) =>
    api.data.post<ProductInternalPriceSuggestionQuery, ProductInternalPriceSuggestionResult>(`/catalog/internal-prices/suggest`, query),
};

export default InternalPriceService;
