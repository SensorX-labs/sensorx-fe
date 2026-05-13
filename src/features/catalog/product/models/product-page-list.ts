import { OffsetPagedQuery, OffsetPagedResult } from "@/shared/models/offset-page.base";
import { ProductStatus } from "../enums/product-status";

/**
 * Interface cho API get page list
 */
export interface ProductPageListQuery extends OffsetPagedQuery {
  categoryId?: string;
  status?: ProductStatus;
}

export interface ProductPageList {
  id: string;
  code: string;
  name: string;
  manufacture: string; // Theo API của bạn
  unit: string;
  status: string;
  categoryName: string;
  images: string[];
  createdAt: string;
}

export type ProductPageListResult = OffsetPagedResult<ProductPageList>
