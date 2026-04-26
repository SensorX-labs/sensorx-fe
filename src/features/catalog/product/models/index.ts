import { BaseQueryLoadMore, BaseQueryOffsetPagedList } from "@/shared/models/base-query-page-list";
import { LoadMorePagedResult, OffsetPagedResult, Result } from "@/shared/models/base-response";
import { ProductStatus } from "../enums/product-status";

/**
 * Interface cho API get page list
 */
export interface ProductPageListQuery extends BaseQueryOffsetPagedList {
  categoryId?: string;
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

/**
 * Interface cho API LoadMore
 */
export type ProductLoadMoreForModalQuery = BaseQueryLoadMore;
export interface ProductLoadMoreForModal {
  id: string;
  code: string;
  name: string;
  manufacture: string;
  categoryId?: string;
  categoryName?: string;
  createdAt: string;
  images: string[];
}
export type ProductLoadMoreForModalResult = Result<LoadMorePagedResult<ProductLoadMoreForModal>>

/**
 * Interface cho API get stats
 */
export type ProductStats = {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
};
export type ProductStatsResult = Result<ProductStats>

/**
 * Interface cho API get details
 */
export interface ProductAttribute {
  name: string;
  value: string;
};

export interface ProductDetail {
  id: string;
  code: string;
  name: string;
  manufacture: string;
  categoryName: string;
  unit: string;
  showcase?: string;
  attributes: ProductAttribute[];
  status: ProductStatus;
  createdAt: string;
  updatedAt?: string;
  images: string[];
}
export type ProductDetailResult = Result<ProductDetail>

