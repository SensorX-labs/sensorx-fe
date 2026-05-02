import { BaseQueryOffsetPagedList } from "@/shared/models/base-query-page-list";
import { OffsetPagedResult, Result } from "@/shared/models/base-response";
import { InternalPrice } from "./common";

export interface ProductInternalPriceHistory {
  productId: string;
  productCode: string;
  productName: string;
  internalPrices: InternalPrice[];
}

export type ProductInternalPriceHistoryResult = Result<ProductInternalPriceHistory>

export interface GetProductInternalPriceHistoryQuery extends BaseQueryOffsetPagedList {}

export type ProductInternalPricePagedHistoryResult = Result<OffsetPagedResult<InternalPrice>>
