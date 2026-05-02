import { BaseQueryOffsetPagedList } from "@/shared/models/base-query-page-list";
import { OffsetPagedResult } from "@/shared/models/base-response";
import { InternalPrice, InternalPriceStatus } from "./common";

export type InternalPriceListResult = OffsetPagedResult<InternalPrice>

export interface GetPageListInternalPriceQuery extends BaseQueryOffsetPagedList {
  status?: InternalPriceStatus;
}
