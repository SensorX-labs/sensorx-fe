export interface InternalPriceStats {
  totalCount: number;
  activeCount: number;
  expiringSoonCount: number;
  expiredCount: number;
}

export type InternalPriceStatsResult = InternalPriceStats
