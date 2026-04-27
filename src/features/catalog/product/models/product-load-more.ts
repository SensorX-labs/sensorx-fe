import { BaseQueryLoadMore } from "@/shared/models/base-query-page-list";
import { LoadMorePagedResult, Result } from "@/shared/models/base-response";

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
