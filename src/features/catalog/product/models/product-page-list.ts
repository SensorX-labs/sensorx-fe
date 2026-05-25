import { OffsetPagedQuery, OffsetPagedResult } from "@/shared/models/offset-page.base";
import { ProductStatus } from "../enums/product-status";

export interface ProductPageListQuery extends OffsetPagedQuery {
  searchTerm?: string;
  code?: string;
  name?: string;
  supplierName?: string;
  categoryName?: string;
  unitOfQuantityName?: string;
  retailPriceFrom?: number;
  retailPriceTo?: number;
  createdFrom?: string;
  createdTo?: string;
  categoryId?: string;
  status?: ProductStatus;
}

export interface ProductPageList {
  id: string;
  code: string;
  name: string;
  supplierName: string;
  unitOfQuantityName: string;
  status: string;
  categoryName: string;
  images: string[];
  createdAt: string;
}

export type ProductPageListResult = OffsetPagedResult<ProductPageList>;
