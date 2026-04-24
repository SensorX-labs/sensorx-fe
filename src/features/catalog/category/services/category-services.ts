import api from "@/shared/configs/axios-config";
import { Result } from "@/shared/models/base-response";
import { 
  CategoryAllListResult,
  CategoryListResult, 
  CategoryResult, 
  CreateCategoryRequest, 
  GetPageListCategoriesQuery, 
  SetParentCategoryRequest 
} from "../models/category-model";

const CategoryService = {
  /**
   * Lấy toàn bộ danh sách danh mục (không phân trang)
   */
  getAll: () =>
    api.data.get<any, CategoryAllListResult>("/catalog/categories/list-all"),

  /**
   * Lấy danh sách danh mục có phân trang và tìm kiếm
   */
  getList: (params: GetPageListCategoriesQuery) =>
    api.data.get<any, CategoryListResult>("/catalog/categories/list", { params }),

  /**
   * Tạo danh mục mới
   */
  create: (request: CreateCategoryRequest) =>
    api.data.post<any, CategoryResult>("/catalog/categories/create", request),

  /**
   * Cập nhật danh mục cha
   */
  updateParent: (id: string, request: SetParentCategoryRequest) =>
    api.data.put<any, Result>(`/catalog/categories/${id}/parent`, request),

  /**
   * Xóa danh mục
   */
  delete: (id: string) =>
    api.data.delete<any, Result>(`/catalog/categories/${id}`),
};

export default CategoryService;
