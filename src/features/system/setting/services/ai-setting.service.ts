import api from '@/shared/configs/axios-config';

export interface AIHyperparameters {
    id: number;
    k: number;
    idleWeight: number;
    learningRate: number;
}

export interface UpdateAIHyperparametersRequest {
    k: number;
    idleWeight: number;
    learningRate: number;
}

export interface AIHyperparameterHistory {
    id: string;
    rfqId: string;
    staffId: string;
    isSuccess: boolean;
    predictedScore: number;
    kBefore: number;
    kAfter: number;
    deltaK: number;
    idleWeightBefore: number;
    idleWeightAfter: number;
    deltaIdleWeight: number;
    loss: number;
    timestamp: string;
}

export const AISettingService = {
    getHyperparameters: () =>
        api.master.get<unknown, AIHyperparameters>('/ai/hyperparameters'),

    updateHyperparameters: (data: UpdateAIHyperparametersRequest) =>
        api.master.post<unknown, AIHyperparameters>('/ai/hyperparameters', data),

    resetHyperparameters: () =>
        api.master.post<unknown, AIHyperparameters>('/ai/hyperparameters/reset'),

    getHyperparameterHistory: () =>
        api.master.get<unknown, AIHyperparameterHistory[]>('/ai/hyperparameters/history'),
};
