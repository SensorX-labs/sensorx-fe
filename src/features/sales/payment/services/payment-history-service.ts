import api from "@/shared/configs/axios-config";
import { OffsetPagedQuery, OffsetPagedResult } from "@/shared/models/offset-page.base";

export interface PaymentHistoryFilter extends OffsetPagedQuery {
  searchTerm?: string;
  gateway?: string;
  paymentId?: string;
  orderId?: string;
  status?: string;
}

export interface PaymentHistoryItem {
  id: number;
  gateway: string;
  transactionDate: string;
  subAccount?: string;
  code?: string;
  accountNumber: string;
  content: string;
  transferType: string;
  description?: string;
  transferAmount: number;
  referenceCode: string;
  accumulated: number;
  status: string;
  paymentId: string;
  orderId: string;
}

export const PaymentHistoryService = {
  getListHistory: (params: PaymentHistoryFilter) =>
    api.master.get<unknown, OffsetPagedResult<PaymentHistoryItem>>(`/sepay/history`, { params }),

  getHistoryById: (id: number) =>
    api.master.get<unknown, PaymentHistoryItem>(`/sepay/history/${id}`),
};

export default PaymentHistoryService;
