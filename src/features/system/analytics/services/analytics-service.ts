import api from "@/shared/configs/axios-config";

// Restore: Các interface thống kê dashboard và master để fix build
export interface DashboardStatsResponse {
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  previousTotalOrders: number;
  previousAverageOrderValue: number;
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

export interface MasterStatsResponse {
  totalCustomers: number;
  totalProducts: number;
  totalStaffs: number;
  newCustomers: number;
  previousNewCustomers: number;
}

// Interface dùng cho revenue report
interface BackendRevenueReport {
  monthlyRevenue: number;
  monthlyCost: number;
  monthlyProfit: number;
  growthRate: number;
  chartData: Array<{
    name: string;
    doanhThu: number;
    chiPhi: number;
    loiNhuan: number;
  }>;
  tableData: Array<{
    month: string;
    revenue: number;
    cost: number;
    profit: number;
    growth: string;
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

const mapBackendToFrontend = (backendData: BackendRevenueReport): RevenueReportResponse => {
  return {
    monthlyRevenue: backendData.monthlyRevenue,
    monthlyCost: backendData.monthlyCost,
    monthlyProfit: backendData.monthlyProfit,
    growthRate: backendData.growthRate,
    chartData: backendData.chartData.map(item => ({
      name: item.name,
      DoanhThu: item.doanhThu,
      ChiPhi: item.chiPhi,
      LoiNhuan: item.loiNhuan
    })),
    tableData: backendData.tableData
  };
};

export const AnalyticsService = {
  getDashboardStats: (timeRange: string = "month") =>
    api.master.get<unknown, DashboardStatsResponse>(`/analytics/dashboard`, {
      params: { timeRange },
    }),

  getRevenueReport: async (filterType: string = "6_months"): Promise<RevenueReportResponse> => {
    try {
      const response = await api.master.get<RevenueReportResponse>(`/analytics/revenue`, {
        params: { filterType },
      });
      const rawData = (response as any).value || response;
      return mapBackendToFrontend(rawData as BackendRevenueReport);
    } catch (error) {
      console.error('Error fetching revenue report:', error);
      throw error;
    }
  },

  getMasterStats: (timeRange: string = "month") =>
    api.data.get<unknown, MasterStatsResponse>(`/analytics/master-stats`, {
      params: { timeRange },
    }),
};

export default AnalyticsService;
