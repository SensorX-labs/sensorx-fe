import api from "@/shared/configs/axios-config";
import { ProductDetailResult, ProductLoadMoreForModalQuery, ProductLoadMoreForModalResult, ProductPageListQuery, ProductPageListResult, ProductStatsResult } from "../models";
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

    getStats: () =>
        api.data.get<any, ProductStatsResult>('/catalog/products/list-stats'),

    changeStatus: (id: string, status: ProductStatus) =>
        api.data.patch<{ status: ProductStatus }, ProductPageListResult>(`/catalog/products/${id}/status`, { status }),

    deleteProduct: (id: string) =>
        api.data.delete<any, ProductPageListResult>(`/catalog/products/${id}`),

};

export default ProductService;
