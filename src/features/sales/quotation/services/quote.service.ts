import api from "@/shared/configs/axios-config";
import { QuoteListItem } from "../models/quote-list-response";
import { QuoteDetail } from "../models/quote-detail-response";
import { OffsetPagedResult } from "@/shared/models/offset-page.base";
import { OffsetPagedQuery } from "@/shared/models/offset-page.base";

export interface QuoteFilter extends OffsetPagedQuery {
    customerId?: string;
}

export const QuoteService = {
    createQuote: (data: CreateDraftQuoteCommand) => api.master.post<any, string>(`/quotes`, data),

    getListQuotes: (params: QuoteFilter) => api.master.get<any, OffsetPagedResult<QuoteListItem>>(`/quotes`, { params }),

    getQuoteById: (id: string) => api.master.get<any, QuoteDetail>(`/quotes/${id}`),

    submitForApproval: (id: string) => api.master.post<any, string>(`/quotes/${id}/submit-for-approval`),

    approve: (id: string) => api.master.post<any, string>(`/quotes/${id}/approve`),

    updateQuote: (data: any) => api.master.put<any, string>(`/quotes`, data),

    accept: (id: string, data: any = {}) => api.master.post<any, string>(`/quotes/${id}/accept`, data),
};

export default QuoteService;

export interface CreateDraftQuoteCommand {
    RFQId: string,
    QuoteDate: string,
    Note: string,
    Items: CreateDraftQuoteItem[]
};

export interface CreateDraftQuoteItem {
    ProductId: string,
    UnitPrice: number,
    TaxRate: number
}