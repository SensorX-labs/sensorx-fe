import { OffsetPagedQuery, OffsetPagedResult } from "@/shared/models/offset-page.base";
import { InternalPrice, InternalPriceStatus } from "./common";

export type InternalPriceListResult = OffsetPagedResult<InternalPrice>

export interface GetPageListInternalPriceQuery extends OffsetPagedQuery {
  productCode?: string;
  productName?: string;
  status?: InternalPriceStatus;
  expiresFrom?: string;
  expiresTo?: string;
  suggestedPriceFrom?: number;
  suggestedPriceTo?: number;
  floorPriceFrom?: number;
  floorPriceTo?: number;
}
