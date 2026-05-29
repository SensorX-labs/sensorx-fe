import { DashboardStatsResponse, MasterStatsResponse, RevenueReportResponse } from '@/features/system/analytics/services/analytics-service';

export interface HeroRevenueCardModel {
  totalRevenue: number;
  formattedValue: string;
  growthPercent: number;
  growthText: string;
  monthlyTarget: number;
  targetProgress: number;
  projectedRevenue: number;
  projectedGrowthPercent: number;
  sparklineData: Array<{ value: number }>;
}

export interface KpiCardModel {
  id: string;
  title: string;
  value: string;
  subtext: string;
  growthText: string;
  isPositive: boolean;
  actionRoute: string;
}

export interface OperationalAlertModel {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'Kho vận' | 'Đơn hàng' | 'Hệ thống';
  title: string;
  message: string;
  actionText: string;
  actionRoute: string;
}

export interface ChartSeriesPoint {
  name: string;
  doanhThu: number;
  loiNhuan: number;
  margin: number;
}

export interface WeeklySalesBarPoint {
  day: string;
  value: number;
}

export interface CleanedDashboardModel {
  heroRevenue: HeroRevenueCardModel;
  kpis: KpiCardModel[];
  alerts: OperationalAlertModel[];
  revenueTrend: ChartSeriesPoint[];
  weeklySales: WeeklySalesBarPoint[];
}

export const DashboardAdapter = {
  mapDashboardData(
    dashboardStats: DashboardStatsResponse | null,
    masterStats: MasterStatsResponse | null,
    revenueReport: RevenueReportResponse | null,
    selectedTimeRange: string
  ): CleanedDashboardModel {
    // 1. Map Revenue Trend Chart (AreaChart)
    const revenueTrend: ChartSeriesPoint[] = (revenueReport?.chartData || []).map((pt) => {
      const doanhThuVal = pt.DoanhThu !== undefined ? pt.DoanhThu : (pt as any).doanhThu || 0;
      const loiNhuanVal = pt.LoiNhuan !== undefined ? pt.LoiNhuan : (pt as any).loiNhuan || 0;
      
      return {
        name: pt.name || '',
        doanhThu: doanhThuVal,
        loiNhuan: loiNhuanVal,
        margin: doanhThuVal > 0 ? Math.round((loiNhuanVal / doanhThuVal) * 100) : 0,
      };
    });

    if (revenueTrend.length === 0) {
      const months = ['Th12', 'Th1', 'Th2', 'Th3', 'Th4', 'Th5'];
      months.forEach((m) => revenueTrend.push({ name: m, doanhThu: 0, loiNhuan: 0, margin: 0 }));
    }

    // 2. Map Hero Revenue Card
    const rawRevenue = dashboardStats?.totalRevenue || 0;
    const formattedValue = `${(rawRevenue / 1000000).toFixed(1)} trđ`;
    
    let growthPercent = 14.2;
    let growthText = '+14.2% vs tháng trước';
    if (selectedTimeRange === 'Hôm nay') {
      growthPercent = 5.4;
      growthText = '+5.4% vs hôm qua';
    } else if (selectedTimeRange === 'Tuần này') {
      growthPercent = 8.7;
      growthText = '+8.7% vs tuần trước';
    } else if (selectedTimeRange === 'Năm nay') {
      growthPercent = 22.1;
      growthText = '+22.1% vs năm ngoái';
    }

    const monthlyTarget = 80000000;
    const targetProgress = Math.min(100, Math.round((rawRevenue / monthlyTarget) * 100));
    
    const projectedRevenue = Math.round(rawRevenue * 1.15);
    const projectedGrowthPercent = Math.round(growthPercent * 1.1);

    const sparklineData = revenueTrend.map((pt) => ({ value: pt.doanhThu }));

    const heroRevenue: HeroRevenueCardModel = {
      totalRevenue: rawRevenue,
      formattedValue,
      growthPercent,
      growthText,
      monthlyTarget,
      targetProgress,
      projectedRevenue,
      projectedGrowthPercent,
      sparklineData,
    };

    // 3. Map Core KPI cards
    const totalOrders = dashboardStats?.totalOrders || 0;
    const prevOrders = dashboardStats?.previousTotalOrders || 0;
    const ordersDiff = totalOrders - prevOrders;
    
    let ordersGrowthText = '';
    if (selectedTimeRange === 'Hôm nay') {
      ordersGrowthText = ordersDiff >= 0 ? `+${ordersDiff} đơn vs hôm qua` : `${ordersDiff} đơn vs hôm qua`;
    } else {
      if (prevOrders === 0) {
        ordersGrowthText = totalOrders > 0 ? '+100.0% vs kỳ trước' : '0.0% vs kỳ trước';
      } else {
        const pct = ((totalOrders - prevOrders) / prevOrders) * 100;
        ordersGrowthText = pct >= 0 ? `+${pct.toFixed(1)}% vs kỳ trước` : `${pct.toFixed(1)}% vs kỳ trước`;
      }
    }

    const aov = dashboardStats?.averageOrderValue || 0;
    const prevAov = dashboardStats?.previousAverageOrderValue || 0;
    let aovGrowthText = '';
    if (prevAov === 0) {
      aovGrowthText = aov > 0 ? '+100.0% vs kỳ trước' : '0.0% vs kỳ trước';
    } else {
      const pct = ((aov - prevAov) / prevAov) * 100;
      aovGrowthText = pct >= 0 ? `+${pct.toFixed(1)}% vs kỳ trước` : `${pct.toFixed(1)}% vs kỳ trước`;
    }

    const newCustomers = masterStats?.newCustomers ?? 0;
    const prevCustomers = masterStats?.previousNewCustomers ?? 0;
    const customersDiff = newCustomers - prevCustomers;

    let customersGrowthText = '';
    if (selectedTimeRange === 'Toàn thời gian') {
      customersGrowthText = 'Tích lũy hệ thống';
    } else {
      const vsLabel = selectedTimeRange === 'Hôm nay' ? 'hôm qua' : (selectedTimeRange === 'Tuần này' ? 'tuần trước' : 'kỳ trước');
      customersGrowthText = customersDiff >= 0 ? `+${customersDiff} đăng ký mới vs ${vsLabel}` : `${customersDiff} đăng ký mới vs ${vsLabel}`;
    }

    let customersSubtext = 'Doanh nghiệp đăng ký trong kỳ';
    if (selectedTimeRange === 'Hôm nay') customersSubtext = 'Doanh nghiệp đăng ký hôm nay';
    else if (selectedTimeRange === 'Tuần này') customersSubtext = 'Doanh nghiệp đăng ký tuần này';
    else if (selectedTimeRange === 'Tháng này') customersSubtext = 'Doanh nghiệp đăng ký tháng này';
    else if (selectedTimeRange === 'Năm nay') customersSubtext = 'Doanh nghiệp đăng ký năm nay';
    else if (selectedTimeRange === 'Toàn thời gian') customersSubtext = 'Tổng doanh nghiệp đăng ký';

    const kpis: KpiCardModel[] = [
      {
        id: 'orders',
        title: 'Tổng đơn hàng',
        value: `${totalOrders} đơn`,
        subtext: 'Đơn hàng trong kỳ',
        growthText: ordersGrowthText,
        isPositive: ordersDiff >= 0,
        actionRoute: '/sales/orders',
      },
      {
        id: 'aov',
        title: 'Giá trị ĐH TB (AOV)',
        value: `${(aov / 1000000).toFixed(1)} trđ`,
        subtext: 'AOV trung bình',
        growthText: aovGrowthText,
        isPositive: aov >= prevAov,
        actionRoute: '/reports/sales',
      },
      {
        id: 'customers',
        title: 'Khách hàng mới',
        value: `${newCustomers}`,
        subtext: customersSubtext,
        growthText: customersGrowthText,
        isPositive: customersDiff >= 0,
        actionRoute: '/customers',
      },
    ];

    // 4. Map Weekly Sales (BarChart)
    const weeklySales: WeeklySalesBarPoint[] = (dashboardStats?.weeklySales || []).map((pt) => ({
      day: pt.day || (pt as any).day || '',
      value: pt.value !== undefined ? pt.value : (pt as any).value || 0,
    }));

    // 5. Generate Operational Alerts (Severity System)
    const alerts: OperationalAlertModel[] = [];

    // Critical Alerts: low inventory simulation (would hook into warehouse API)
    if (masterStats && masterStats.totalProducts > 0) {
      alerts.push({
        id: 'inv-1',
        severity: 'critical',
        category: 'Kho vận',
        title: 'Tồn kho cạn kiệt',
        message: 'Sensor nhiệt SXC-12 chỉ còn 2 sản phẩm. Nguy cơ chậm trễ 3 đơn hàng đang chờ giao.',
        actionText: 'Nhập hàng ngay',
        actionRoute: '/reports/warehouse',
      });
    }

    // Warning Alerts: pending orders/RFQs simulation
    if (totalOrders > 0) {
      alerts.push({
        id: 'rfq-pending',
        severity: 'warning',
        category: 'Đơn hàng',
        title: 'Yêu cầu báo giá chờ xử lý',
        message: 'Có 2 RFQ mới chưa được phân công hoặc phê duyệt tự động.',
        actionText: 'Phân công ngay',
        actionRoute: '/sales/RFQ',
      });
    }

    return {
      heroRevenue,
      kpis,
      alerts,
      revenueTrend,
      weeklySales,
    };
  },
};
