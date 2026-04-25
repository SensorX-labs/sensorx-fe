import api from "@/shared/configs/axios-config";
import { KeysetPagedResult, OffsetPagedResult, Result } from "@/shared/models/base-response";
import { BaseQueryKeysetPagedList, BaseQueryOffsetPagedList } from "@/shared/models/base-query-page-list";
import { ProductListItem } from "../models/product-list-response";
import { Product } from "../models/product-selection";

export interface ProductFilter extends BaseQueryOffsetPagedList {
    categoryId?: string;
}

export type ProductLoadMoreQuery = BaseQueryKeysetPagedList;

export const ProductService = {
    /**
     * Lấy danh sách sản phẩm phân trang (Offset Pagination)
     */
    getProducts: async (params: ProductFilter) =>
        api.data.get<any, Result<OffsetPagedResult<ProductListItem>>>('/catalog/products/list', { params }),

    /**
     * Lấy danh sách sản phẩm theo kiểu load-more (Keyset Pagination)
     */
    getLoadMore: (query: ProductLoadMoreQuery) =>
        api.data.get<any, Result<KeysetPagedResult<Product>>>("/catalog/products/load-more", { params: query }),
};

export default ProductService;
