import api from "@/shared/configs/axios-config";

export interface DashboardStatsResponse {
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  topSellingProducts: Array<{
    productId: string;
    productCode: string;
    productName: string;
    quantitySold: number;
    totalAmount: number;
  }>;
  weeklySales: Array<{
    day: string;
    value: number;
  }>;
}

export interface RevenueReportResponse {
  monthlyRevenue: number;
  monthlyCost: number;
  monthlyProfit: number;
  growthRate: number;
  chartData: Array<{
    name: string;
    DoanhThu: number;
    ChiPhi: number;
    LoiNhuan: number;
  }>;
  tableData: Array<{
    month: string;
    revenue: number;
    cost: number;
    profit: number;
    growth: string;
  }>;
}

export interface MasterStatsResponse {
  totalCustomers: number;
  totalProducts: number;
  totalStaffs: number;
}

export const AnalyticsService = {
  getDashboardStats: (timeRange: string = "month") =>
    api.master.get<unknown, DashboardStatsResponse>(`/analytics/dashboard`, {
      params: { timeRange },
    }),

  getRevenueReport: (filterType: string = "6_months") =>
    api.master.get<unknown, RevenueReportResponse>(`/analytics/revenue`, {
      params: { filterType },
    }),

  getMasterStats: () =>
    api.data.get<unknown, MasterStatsResponse>(`/analytics/master-stats`),
};

export default AnalyticsService;
