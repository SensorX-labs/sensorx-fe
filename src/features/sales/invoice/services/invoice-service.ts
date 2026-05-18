import api from "@/shared/configs/axios-config";
import { OffsetPagedResult } from "@/shared/models/base-response";
import { BaseQueryOffsetPagedList } from "@/shared/models/base-query-page-list";
import { Invoice, InvoiceListItem } from "../models/invoice";

export type InvoiceFilter = BaseQueryOffsetPagedList;

export const InvoiceService = {
  getListInvoices: (params: InvoiceFilter) =>
    api.master.get<unknown, OffsetPagedResult<InvoiceListItem>>(`/invoices`, { params }),

  getInvoiceById: (id: string) =>
    api.master.get<unknown, Invoice>(`/invoices/${id}`),

  getInvoiceByOrderId: (orderId: string) =>
    api.master.get<unknown, Invoice>(`/invoices/order/${orderId}`),
};

export default InvoiceService;
