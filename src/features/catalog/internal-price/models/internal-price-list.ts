import { BaseQueryOffsetPagedList } from "@/shared/models/base-query-page-list";
import { OffsetPagedResult, Result } from "@/shared/models/base-response";
import { InternalPrice, InternalPriceStatus } from "./common";

export type InternalPriceListResult = Result<OffsetPagedResult<InternalPrice>>

export interface GetPageListInternalPriceQuery extends BaseQueryOffsetPagedList {
  status?: InternalPriceStatus;
}
