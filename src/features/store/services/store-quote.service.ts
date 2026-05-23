import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';
import api from '@/shared/configs/axios-config';
import { LoadMorePagedQuery, LoadMorePagedResult } from '@/shared/models/load-more.base';

export interface StoreMyQuoteItem {
    id: string;
    code: string;
    status: StatusCustomerCanSeeQuote;
    totalAmount: number;
    createdAt: string;
    expiryDate?: string;
}

export type StatusCustomerCanSeeQuote = 'All' | 'Pending' | 'Accepted' | 'Declined' | 'Expired';
export interface StoreQuoteParams extends LoadMorePagedQuery {
    status?: StatusCustomerCanSeeQuote;
}

export enum QuoteResponseStatus {
    Accepted = 'Accepted',
    Declined = 'Declined'
}

export enum PaymentTerm {
    Deposit = 'Deposit',
    FullPayment = 'FullPayment'
}

export interface CustomerRespondToQuoteCommand {
    responseType: QuoteResponseStatus | number;
    paymentTerm: PaymentTerm | number;
    shippingAddress: string;
    recipientName: string;
    recipientPhone: string;
    feedback?: string;
}

export const StoreQuoteService = {
    /**
     * Lấy danh sách báo giá của khách hàng (Storefront)
     */
    getMyQuotes: (params: StoreQuoteParams) =>
        api.master.get<StoreQuoteParams, LoadMorePagedResult<StoreMyQuoteItem>>('/quotes/my-quotes', { params }),
    /**
     * Khách hàng phản hồi báo giá
     */
    customerResponse: (id: string, data: CustomerRespondToQuoteCommand) => api.master.post<CustomerRespondToQuoteCommand, string>(`/quotes/${id}/customer-response`, data)
};
