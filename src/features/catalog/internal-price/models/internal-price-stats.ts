import { Result } from "@/shared/models/base-response";

export interface InternalPriceStats {
  totalCount: number;
  activeCount: number;
  expiringSoonCount: number;
  expiredCount: number;
}

export type InternalPriceStatsResult = Result<InternalPriceStats>
