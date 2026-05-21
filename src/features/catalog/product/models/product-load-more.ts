import { LoadMorePagedQuery, LoadMorePagedResult } from "@/shared/models/load-more.base";

/**
 * Interface cho API LoadMore
 */
export interface ProductLoadMoreForModalQuery extends LoadMorePagedQuery {
  categoryId?: string;
  sortByName: boolean;
}

export interface ProductLoadMoreForModal {
  id: string;
  code: string;
  name: string;
  supplierName: string;
  unitOfQuantityName: string;
  categoryId?: string;
  categoryName?: string;
  createdAt: string;
  images: string[];
}

export type ProductLoadMoreForModalResult = LoadMorePagedResult<ProductLoadMoreForModal>
