import api from '@/shared/configs/axios-config';

export interface StaffCategoryPerformance {
    categoryId: string;
    categoryName: string;
    successCount: number;
    failureCount: number;
    totalMarginAccumulated: number;
    averageMargin: number;
    winRate: number;
    alphaParam: number;
    betaParam: number;
}

export interface StaffAIPerformance {
    staffId: string;
    staffName: string;
    currentWorkload: number;
    lastAssignedAt: string | null;
    idleHours: number;
    penaltyWorkload: number;
    boostIdle: number;
    categoryPerformances: StaffCategoryPerformance[];
}

export const StaffPerformanceService = {
    getStaffAIPerformance: (staffId: string) =>
        api.master.get<unknown, StaffAIPerformance>(`/staff/${staffId}/ai-performance`),
};
