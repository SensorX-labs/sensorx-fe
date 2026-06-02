import api from '@/shared/configs/axios-config';

export interface AIHyperparamEvent {
    eventId: string;
    eventIndex: number;
    timestamp: string;
    staffName: string;
    rfqId: string;
    predicted: number;      // ŷ
    actual: number;         // y
    loss: number;           // L (Binary Cross-Entropy)
    deltaK: number;
    deltaIdleWeight: number;
    kBefore: number;
    kAfter: number;
    idleWeightBefore: number;
    idleWeightAfter: number;
}

export interface AIMonitoringStats {
    totalEvents: number;
    avgLoss: number;
    avgAccuracy: number;
    currentK: number;
    currentIdleWeight: number;
    kConvergenceTrend: 'increasing' | 'decreasing' | 'stable';
}

export const AIMonitoringService = {
    getHyperparamHistory: (limit = 100) =>
        api.master.get<unknown, AIHyperparamEvent[]>(`/ai/hyperparameters/history?limit=${limit}`),

    getMonitoringStats: () =>
        api.master.get<unknown, AIMonitoringStats>('/ai/hyperparameters/stats'),
};
