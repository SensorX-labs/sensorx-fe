import { OffsetPagedQuery, OffsetPagedResult } from "@/shared/models/offset-page.base";
import { InternalPrice, InternalPriceStatus } from "./common";

export type InternalPriceListResult = OffsetPagedResult<InternalPrice>

export interface GetPageListInternalPriceQuery extends OffsetPagedQuery {
  status?: InternalPriceStatus;
}
