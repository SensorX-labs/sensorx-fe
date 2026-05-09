import api from "@/shared/configs/axios-config";

import {
  CategoryAllListResult,
  CategoryListResult,
  CreateCategoryRequest,
  GetPageListCategoriesQuery,
  LoadMoreCategoriesForModalQuery,
  LoadMoreCategoriesForModalResult,
  SetParentCategoryRequest
} from "../models";

const CategoryService = {
  /**
   * Lấy toàn bộ danh sách danh mục (không phân trang)
   */
  getAll: () =>
    api.data.get<any, CategoryAllListResult>("/catalog/categories/list-all"),

  /**
   * Tạo danh mục mới
   */
  create: (request: CreateCategoryRequest) =>
    api.data.post<any, string>("/catalog/categories/create", request),

  /**
   * Cập nhật danh mục cha
   */
  updateParent: (id: string, request: SetParentCategoryRequest) =>
    api.data.put<any, string>(`/catalog/categories/${id}/parent`, request),

  /**
   * Xóa danh mục
   */
  delete: (id: string) =>
    api.data.delete<any, string>(`/catalog/categories/${id}`),

  /**
   * Lấy danh sách danh mục theo kiểu load-more cho modal selection
   */
  loadMoreForModal: (query: LoadMoreCategoriesForModalQuery) =>
    api.data.get<any, LoadMoreCategoriesForModalResult>(`/catalog/categories/load-more-for-modal`, { params: query }),
};

export default CategoryService;
