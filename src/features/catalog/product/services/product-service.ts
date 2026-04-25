import api from "@/shared/configs/axios-config";
import {PaginationResponse} from "@/shared/models/pagination";
import {ProductListItem} from "../models/product-list-response";

export interface ProductFilter {
    PageNumber: number;
    PageSize: number;
    SearchTerm?: string;
    CategoryId?: string;
}

export class ProductService {
    async getProducts(params: ProductFilter): Promise<PaginationResponse<ProductListItem>> {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString());
            }
        });

        return api.data.get(`/catalog/products/list?${queryParams.toString()}`);
    }
}
