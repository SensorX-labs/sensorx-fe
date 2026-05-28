import api from "@/shared/configs/axios-config";
import { OffsetPagedResult, OffsetPagedQuery } from "@/shared/models/offset-page.base";
import { Invoice, InvoiceListItem } from "../models/invoice";

export interface InvoiceFilter extends OffsetPagedQuery {
  status?: string;
  code?: string;
  orderCode?: string;
  companyName?: string;
  taxCode?: string;
  email?: string;
  address?: string;
  totalFrom?: number;
  totalTo?: number;
  amountPaidFrom?: number;
  amountPaidTo?: number;
  issueFrom?: string;
  issueTo?: string;
  createdFrom?: string;
  createdTo?: string;
}

export interface InvoiceStatsResponse {
  totalCount: number;
  unpaidCount: number;
  partiallyPaidCount: number;
  paidCount: number;
  issuedCount: number;
  cancelledCount: number;
}

export const InvoiceService = {
  getListInvoices: (params: InvoiceFilter) =>
    api.master.get<unknown, OffsetPagedResult<InvoiceListItem>>(`/invoices`, { params }),

  getInvoiceById: (id: string) =>
    api.master.get<unknown, Invoice>(`/invoices/${id}`),

  getInvoiceStats: () =>
    api.master.get<unknown, InvoiceStatsResponse>(`/invoices/stats`),

  getInvoiceByOrderId: (orderId: string) =>
    api.master.get<unknown, Invoice>(`/invoices/order/${orderId}`),
};

export default InvoiceService;
