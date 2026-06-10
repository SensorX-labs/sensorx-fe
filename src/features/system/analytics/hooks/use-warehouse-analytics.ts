import { useState, useEffect } from 'react';
import api from '@/shared/configs/axios-config';

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
        // Phase 3 will implement this endpoint. For Phase 1, we mock it.
        // const response = await api.warehouse.get<WarehouseReportStatsResponse>('/analytics/warehouse-report', { params: { timeRange } });
        // const rawData = (response as any).value || response;
        
        // MOCK DATA FOR PHASE 1:
        let multiplier = 1;
        let chartData = [];
        
        if (timeRange === 'today') {
          multiplier = 0.05;
          chartData = [
            { period: '08:00', inbound: 120, outbound: 80 },
            { period: '10:00', inbound: 150, outbound: 110 },
            { period: '12:00', inbound: 90, outbound: 130 },
            { period: '14:00', inbound: 180, outbound: 160 },
            { period: '16:00', inbound: 210, outbound: 190 },
          ];
        } else if (timeRange === 'week') {
          multiplier = 0.25;
          chartData = [
            { period: 'T2', inbound: 450, outbound: 410 },
            { period: 'T3', inbound: 520, outbound: 480 },
            { period: 'T4', inbound: 380, outbound: 450 },
            { period: 'T5', inbound: 610, outbound: 550 },
            { period: 'T6', inbound: 750, outbound: 680 },
            { period: 'T7', inbound: 680, outbound: 620 },
            { period: 'CN', inbound: 250, outbound: 280 },
          ];
        } else if (timeRange === 'month') {
          multiplier = 1;
          chartData = [
            { period: 'Tuần 1', inbound: 1200, outbound: 1000 },
            { period: 'Tuần 2', inbound: 1500, outbound: 1300 },
            { period: 'Tuần 3', inbound: 1100, outbound: 1400 },
            { period: 'Tuần 4', inbound: 1600, outbound: 1500 },
          ];
        } else {
          // year
          multiplier = 12;
          chartData = [
            { period: 'Tháng 1', inbound: 2800, outbound: 2400 },
            { period: 'Tháng 2', inbound: 3100, outbound: 2900 },
            { period: 'Tháng 3', inbound: 2500, outbound: 3200 },
            { period: 'Tháng 4', inbound: 3241, outbound: 4120 },
            { period: 'Tháng 5', inbound: 2900, outbound: 3100 },
            { period: 'Tháng 6', inbound: 3500, outbound: 3300 },
            { period: 'Tháng 7', inbound: 3800, outbound: 3600 },
            { period: 'Tháng 8', inbound: 4200, outbound: 4000 },
            { period: 'Tháng 9', inbound: 3900, outbound: 4100 },
            { period: 'Tháng 10', inbound: 4500, outbound: 4300 },
            { period: 'Tháng 11', inbound: 4800, outbound: 4600 },
            { period: 'Tháng 12', inbound: 5200, outbound: 5000 },
          ];
        }

        const mockData: WarehouseReportStatsResponse = {
          totalInventory: 18420, // Tồn kho hiện tại thường không bị x theo timeRange
          inboundThisPeriod: Math.round(3241 * multiplier),
          inboundGrowthPercent: 12.4,
          outboundThisPeriod: Math.round(4120 * multiplier),
          outboundGrowthPercent: -4.8,
          totalInventoryValue: 4820000000,

          inboundOutboundChart: chartData,

          categoryDistribution: [
            { name: 'Camera', value: 45, color: '#3b82f6' },
            { name: 'Đầu ghi', value: 25, color: '#10b981' },
            { name: 'Lưu trữ', value: 15, color: '#f59e0b' },
            { name: 'Phụ kiện', value: 10, color: '#6366f1' },
            { name: 'Mạng', value: 5, color: '#8b5cf6' },
          ],

          categoryTableData: [
            { categoryName: 'Camera IP', totalItems: 120, inStock: 8500, imported: Math.round(1200 * multiplier), exported: Math.round(1500 * multiplier), value: 2500000000 },
            { categoryName: 'Đầu ghi hình', totalItems: 45, inStock: 3200, imported: Math.round(500 * multiplier), exported: Math.round(800 * multiplier), value: 1200000000 },
            { categoryName: 'Ổ cứng lưu trữ', totalItems: 25, inStock: 4500, imported: Math.round(800 * multiplier), exported: Math.round(1200 * multiplier), value: 850000000 },
            { categoryName: 'Phụ kiện cáp', totalItems: 210, inStock: 15000, imported: Math.round(5000 * multiplier), exported: Math.round(4500 * multiplier), value: 150000000 },
            { categoryName: 'Thiết bị mạng', totalItems: 60, inStock: 2100, imported: Math.round(300 * multiplier), exported: Math.round(450 * multiplier), value: 120000000 },
          ]
        };

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (isMounted) {
          setData(mockData);
          setError(null);
        }
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
