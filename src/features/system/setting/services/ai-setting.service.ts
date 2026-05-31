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

export const AISettingService = {
  getHyperparameters: () =>
    api.master.get<unknown, AIHyperparameters>('/ai/hyperparameters'),

  updateHyperparameters: (data: UpdateAIHyperparametersRequest) =>
    api.master.post<unknown, AIHyperparameters>('/ai/hyperparameters', data),

  resetHyperparameters: () =>
    api.master.post<unknown, AIHyperparameters>('/ai/hyperparameters/reset'),
};
