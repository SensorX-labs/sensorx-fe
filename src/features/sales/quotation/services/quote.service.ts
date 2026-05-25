import api from "@/shared/configs/axios-config";
import { QuoteStatus } from "../constants/quote-status";
import { OffsetPagedResult } from "@/shared/models/offset-page.base";
import { OffsetPagedQuery } from "@/shared/models/offset-page.base";
import { GetDetailQuoteByIdResponse } from "../models/quote-detail-response";

export enum QuoteResponseStatus {
    Accepted = 'Accepted',
    Declined = 'Declined'
}

export interface QuoteFilter extends OffsetPagedQuery {
    customerId?: string;
    status?: QuoteStatus | string;
    responseType?: QuoteResponseStatus;
    isExpired?: boolean;
    searchTerm?: string;
    code?: string;
    companyName?: string;
    customerEmail?: string;
    customerPhone?: string;
    senderName?: string;
    totalFrom?: number;
    totalTo?: number;
    quoteDateFrom?: string;
    quoteDateTo?: string;
    createdFrom?: string;
    createdTo?: string;
}

export const QuoteService = {
    createQuote: (data: DraftQuoteCommand) => api.master.post<DraftQuoteCommand, string>(`/quotes`, data),

    getListQuotes: (params: QuoteFilter) => api.master.get<unknown, OffsetPagedResult<QuoteListItem>>(`/quotes`, { params }),

    getQuoteById: (id: string) => api.master.get<unknown, GetDetailQuoteByIdResponse>(`/quotes/${id}`),

    getQuoteStats: () => api.master.get<unknown, QuoteStatsResponse>(`/quotes/stats`),

    submitForApproval: (id: string) => api.master.post<unknown, string>(`/quotes/${id}/submit-for-approval`),

    withdraw: (id: string) => api.master.post<unknown, string>(`/quotes/${id}/withdraw`),

    publish: (id: string) => api.master.post<unknown, string>(`/quotes/${id}/publish`),

    approve: (id: string) => api.master.post<unknown, string>(`/quotes/${id}/approve`),

    reject: (id: string, payload: { reason: string }) => api.master.post<unknown, string>(`/quotes/${id}/reject`, payload),

    updateQuote: (id: string, data: DraftQuoteCommand) => api.master.put<DraftQuoteCommand, string>(`/quotes/${id}`, data),

    deleteQuote: (id: string) => api.master.delete<unknown, string>(`/quotes/${id}`),

};

export default QuoteService;

export interface DraftQuoteCommand {
    rfqId: string,
    note: string,
    items: DraftQuoteItem[]
};

export interface DraftQuoteItem {
    productId: string,
    unitPrice: number,
    taxRate: number
}

export interface QuoteListItem {
    id: string,
    code: string,
    status: QuoteStatus,
    quoteDate: string | null,
    customerId: string,
    companyName: string,
    grandTotal: number,
    itemCount: number,
    createdAt: string,
    responseType?: QuoteResponseStatus
}

export interface QuoteStatsResponse {
    totalCount: number;
    draftCount: number;
    pendingCount: number;
    approvedCount: number;
    returnedCount: number;
    sentCount: number;
    orderedCount: number;
    expiredCount: number;
    cancelledCount: number;
    customerAcceptedCount: number;
    customerDeclinedCount: number;
}
