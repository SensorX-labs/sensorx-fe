import { useState, useEffect } from 'react';
import api from '@/shared/configs/axios-config';
import { getWarehouses } from '@/features/warehouse/services/warehouse-service';

export interface WarehouseReportStatsResponse {
  totalInventory: number;
  inboundThisPeriod: number;
  inboundGrowthPercent: number;
  outboundThisPeriod: number;
  outboundGrowthPercent: number;
  totalInventoryValue: number;

  inboundOutboundChart: Array<{
    period: string;
    inbound: number;
    outbound: number;
  }>;
  
  categoryDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;

  categoryTableData: Array<{
    categoryName: string;
    totalItems: number;
    inStock: number;
    imported: number;
    exported: number;
    value: number;
  }>;
}

export function useWarehouseAnalytics(timeRange: string = 'month') {
  const [data, setData] = useState<WarehouseReportStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const warehousesResponse = await getWarehouses();
        const warehouses = (warehousesResponse as any).value || warehousesResponse || [];

        const statsPromises = warehouses.map((w: any) => 
          api.warehouse.get<WarehouseReportStatsResponse>('/analytics/dashboard-stats', { 
            params: { timeRange },
            headers: { 'X-Warehouse-Id': w.id }
          })
        );

        const statsResponses = await Promise.all(statsPromises);
        
        if (!isMounted) return;

        const aggregated: WarehouseReportStatsResponse = {
          totalInventory: 0,
          inboundThisPeriod: 0,
          inboundGrowthPercent: 0,
          outboundThisPeriod: 0,
          outboundGrowthPercent: 0,
          totalInventoryValue: 0,
          inboundOutboundChart: [],
          categoryDistribution: [],
          categoryTableData: []
        };

        let totalInboundPrev = 0;
        let totalOutboundPrev = 0;
        const chartMap = new Map<string, { inbound: number, outbound: number }>();
        const distMap = new Map<string, { value: number, color: string }>();
        const tableMap = new Map<string, any>();

        statsResponses.forEach(res => {
          const stat = (res as any).value || res;
          
          aggregated.totalInventory += stat.totalInventory || 0;
          aggregated.inboundThisPeriod += stat.inboundThisPeriod || 0;
          aggregated.outboundThisPeriod += stat.outboundThisPeriod || 0;
          aggregated.totalInventoryValue += stat.totalInventoryValue || 0;

          // Compute previous periods for accurate aggregated growth percent
          const inPrev = stat.inboundGrowthPercent === 100 && stat.inboundThisPeriod > 0 
            ? 0 
            : stat.inboundThisPeriod / (1 + (stat.inboundGrowthPercent / 100));
          const outPrev = stat.outboundGrowthPercent === 100 && stat.outboundThisPeriod > 0 
            ? 0 
            : stat.outboundThisPeriod / (1 + (stat.outboundGrowthPercent / 100));
            
          totalInboundPrev += (inPrev || 0);
          totalOutboundPrev += (outPrev || 0);

          (stat.inboundOutboundChart || []).forEach((c: any) => {
            const existing = chartMap.get(c.period) || { inbound: 0, outbound: 0 };
            chartMap.set(c.period, { 
              inbound: existing.inbound + c.inbound, 
              outbound: existing.outbound + c.outbound 
            });
          });

          (stat.categoryDistribution || []).forEach((d: any) => {
            const existing = distMap.get(d.name) || { value: 0, color: d.color };
            distMap.set(d.name, { value: existing.value + d.value, color: d.color });
          });

          (stat.categoryTableData || []).forEach((t: any) => {
            const existing = tableMap.get(t.categoryName) || {
              categoryName: t.categoryName,
              totalItems: t.totalItems, // Assume same across warehouses
              inStock: 0,
              imported: 0,
              exported: 0,
              value: 0
            };
            tableMap.set(t.categoryName, {
              ...existing,
              inStock: existing.inStock + t.inStock,
              imported: existing.imported + t.imported,
              exported: existing.exported + t.exported,
              value: existing.value + t.value
            });
          });
        });

        // Recalculate growths
        if (totalInboundPrev === 0) aggregated.inboundGrowthPercent = aggregated.inboundThisPeriod > 0 ? 100 : 0;
        else aggregated.inboundGrowthPercent = Math.round(((aggregated.inboundThisPeriod - totalInboundPrev) / totalInboundPrev) * 100);

        if (totalOutboundPrev === 0) aggregated.outboundGrowthPercent = aggregated.outboundThisPeriod > 0 ? 100 : 0;
        else aggregated.outboundGrowthPercent = Math.round(((aggregated.outboundThisPeriod - totalOutboundPrev) / totalOutboundPrev) * 100);

        // Sort and assign arrays
        aggregated.inboundOutboundChart = Array.from(chartMap.entries()).map(([period, data]) => ({ period, ...data }));
        
        const totalValue = Array.from(distMap.values()).reduce((sum, d) => sum + d.value, 0);
        aggregated.categoryDistribution = Array.from(distMap.entries()).map(([name, data]) => ({
          name,
          value: totalValue > 0 ? (data.value / totalValue) * 100 : 0, // normalize to 100%
          color: data.color
        })).sort((a, b) => b.value - a.value);

        aggregated.categoryTableData = Array.from(tableMap.values()).sort((a, b) => b.value - a.value);

        setData(aggregated);
        setError(null);
      } catch (err: any) {
        if (isMounted) {
          setError(err);
          setData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [timeRange]);

  return { data, isLoading, error };
}
