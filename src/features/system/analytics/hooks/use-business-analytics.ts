import { useState, useEffect } from 'react';
import api from '@/shared/configs/axios-config';

export interface BusinessReportStatsResponse {
  totalRevenue: number;
  grossProfit: number;
  totalOrders: number;
  averageOrderValue: number;
  
  totalQuotes: number;
  convertedQuotes: number;
  conversionRate: number;

  newCustomers: number;
  returningCustomers: number;
  
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    revenue: number;
  }>;

  topProducts: Array<{
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;

  revenueTrendChart: Array<{
    period: string;
    revenue: number;
    profit: number;
  }>;
}

export function useBusinessAnalytics(timeRange: string = 'month') {
  const [data, setData] = useState<BusinessReportStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await api.master.get<BusinessReportStatsResponse>('/analytics/business-report', { params: { timeRange } });
        const rawData = (response as any).value || response;

        if (isMounted) {
          setData(rawData as BusinessReportStatsResponse);
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
