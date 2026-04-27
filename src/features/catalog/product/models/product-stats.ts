import { Result } from "@/shared/models/base-response";

/**
 * Interface cho API get stats
 */
export type ProductStats = {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
};

export type ProductStatsResult = Result<ProductStats>
