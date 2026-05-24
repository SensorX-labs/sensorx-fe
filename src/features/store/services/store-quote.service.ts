import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';
import api from '@/shared/configs/axios-config';
import { LoadMorePagedQuery, LoadMorePagedResult } from '@/shared/models/load-more.base';

export const StoreQuoteService = {
    /**
     * Lấy danh sách báo giá của khách hàng (Storefront)
     */
    getMyQuotes: (params: StoreQuoteParams) =>
        api.master.get<StoreQuoteParams, LoadMorePagedResult<StoreMyQuoteItem>>('/quotes/my-quotes', { params }),

    /**
     * Lấy chi tiết báo giá của khách hàng (Storefront)
     */
    getMyQuoteDetail: (id: string) => api.master.get<any, GetMyQuoteDetailResponse>(`/quotes/my-quote/${id}`),
    /**
     * Khách hàng phản hồi báo giá
     */
    customerResponse: (id: string, data: CustomerRespondToQuoteCommand) => api.master.post<CustomerRespondToQuoteCommand, string>(`/quotes/${id}/customer-response`, data)
};
export interface StoreMyQuoteItem {
    id: string;
    code: string;
    status: StatusCustomerCanSeeQuote;
    totalAmount: number;
    createdAt: string;
    expiryDate?: string;
}

export type StatusCustomerCanSeeQuote = 'Pending' | 'Accepted' | 'Declined' | 'Expired';
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
    responseType?: QuoteResponseStatus | null;
    paymentTerm?: PaymentTerm | null;
    shippingAddress?: string;
    recipientName?: string;
    recipientPhone?: string;
    feedback?: string;
}

export interface GetMyQuoteDetailResponse {
    id: string;
    code: string;
    rfqId: string;
    orderId: string;
    orderCode: string;
    status: StatusCustomerCanSeeQuote;
    quoteDate?: string | null;
    subtotal: number;
    totalTax: number;
    grandTotal: number;
    items: QuoteItemResponse[];
    sender: SenderInfoResponse;
    customer: CustomerInfoResponse;
}

export interface SenderInfoResponse {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatarUrl: string | null;
};

export interface CustomerInfoResponse {
    id: string;
    companyName: string;
    phone: string;
    email: string;
    address: string;
    taxCode: string;
}

export interface QuoteItemResponse {
    id: string;
    productId: string;
    productCode: string;
    manufacturer: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;

    lineAmount: number;
    taxAmount: number;
    totalLineAmount: number;
};
