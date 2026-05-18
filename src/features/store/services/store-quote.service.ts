import { QuoteStatus } from '@/features/sales/quotation/constants/quote-status';
import api from '@/shared/configs/axios-config';
import { LoadMorePagedQuery, LoadMorePagedResult } from '@/shared/models/load-more.base';

export interface StoreMyQuoteItem {
    id: string;
    code: string;
    status: QuoteStatus;
    totalAmount: number;
    createdAt: string;
    expiryDate?: string;
}

export interface StoreQuoteParams extends LoadMorePagedQuery {
    status?: string;
}

export const StoreQuoteService = {
    /**
     * Lấy danh sách báo giá của khách hàng (Storefront)
     */
    getMyQuotes: (params: StoreQuoteParams) =>
        api.master.get<StoreQuoteParams, LoadMorePagedResult<StoreMyQuoteItem>>('/quotes/my-quotes', { params })
};
