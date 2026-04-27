import { BaseQueryOffsetPagedList } from "@/shared/models/base-query-page-list";
import { OffsetPagedResult, Result } from "@/shared/models/base-response";
import { ProductStatus } from "../enums/product-status";

/**
 * Interface cho API get page list
 */
export interface ProductPageListQuery extends BaseQueryOffsetPagedList {
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

export type ProductPageListResult = Result<OffsetPagedResult<ProductPageList>>
