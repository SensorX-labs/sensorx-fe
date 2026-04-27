import api from "@/shared/configs/axios-config";
import { GetPageProductDetailResult, ProductCommand, ProductDetailResult, ProductLoadMoreForModalQuery, ProductLoadMoreForModalResult, ProductPageListQuery, ProductPageListResult, ProductStatsResult } from "../models";
import { ProductStatus } from "../enums/product-status";

export const ProductService = {
    /**
     * Lấy danh sách sản phẩm phân trang (Offset Pagination)
     */
    getProducts: async (params: ProductPageListQuery) =>
        api.data.get<any, ProductPageListResult>('/catalog/products/list', { params }),

    /**
     * Lấy danh sách sản phẩm theo kiểu load-more (Keyset Pagination)
     */
    getLoadMore: (query: ProductLoadMoreForModalQuery) =>
        api.data.get<any, ProductLoadMoreForModalResult>("/catalog/products/load-more-products-for-modal", { params: query }),

    /**
     * Lấy chi tiết sản phẩm
     */
    getDetail: (id: string) =>
        api.data.get<any, ProductDetailResult>(`/catalog/products/${id}`),

    /**
     * Lấy thông tin trang chi tiết sản phẩm
     */
    getPageDetail: (id: string) =>
        api.data.get<any, GetPageProductDetailResult>(`/pages/product-detail/${id}`),

    /**
     * Lấy thông tin thống kê sản phẩm
     */
    getStats: () =>
        api.data.get<any, ProductStatsResult>('/catalog/products/list-stats'),

    /**
     * Thay đổi trạng thái sản phẩm
     */
    changeStatus: (id: string, status: ProductStatus) =>
        api.data.patch<{ status: ProductStatus }, ProductPageListResult>(`/catalog/products/${id}/status`, { status }),

    /**
     * Xóa sản phẩm
     */
    deleteProduct: (id: string) =>
        api.data.delete<any, ProductPageListResult>(`/catalog/products/${id}`),

    /**
     * Tạo sản phẩm
     */
    create: (command: ProductCommand) =>
        api.data.post<ProductCommand, any>(`/catalog/products/create`, command),

    update: (id: string, command: ProductCommand) =>
        api.data.put<ProductCommand, any>(`/catalog/products/${id}`, command),
};

export default ProductService;
