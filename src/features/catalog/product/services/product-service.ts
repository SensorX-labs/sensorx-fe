import {dataUrl} from "@/shared/constants/environment";
import {PaginationResponse} from "@/shared/models/pagination";
import {ProductListItem} from "../models/product-list-response";

export interface ProductFilter {
    PageIndex: number;
    PageSize: number;
    SearchTerm?: string;
    CategoryId?: string;
}

export class ProductService {
    async getProducts(params : ProductFilter): Promise < PaginationResponse < ProductListItem >> {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(
            ([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            }
        );

        const url = `${dataUrl}/api/catalog/products?${
            queryParams.toString()
        }`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (! response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Lỗi hệ thống: ${
                response.status
            }`);
        }

        const result = await response.json();

        if (result && result.isSuccess) {
            return result.value;
        }

        throw new Error(result.error || "Đã xảy ra lỗi khi lấy danh sách sản phẩm");
    }

}
