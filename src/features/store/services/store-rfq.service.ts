import api from "@/shared/configs/axios-config";
import { LoadMorePagedQuery, LoadMorePagedResult } from "@/shared/models/load-more.base";
import { RfqStatus } from "../constants/rfq-status";

export const StoreRFQService = {
    createRFQ: (data: RfqCreateRequest) =>
        api.master.post(`/rfq`, data),

    SendRFQ: (rfqId: string) =>
        api.master.post(`/rfq/send`, { rfqId }),

    getMyRFQ: (params: GetRFQParams) =>
        api.master.get<GetRFQParams, LoadMorePagedResult<StoreMyRFQItem>>(`/rfq/my-rfq`, { params }),

    getMyRFQDetail: (id: string) =>
        api.master.get<any, RfqDetail>(`/rfq/my-rfq/${id}`),
};

export interface RfqCreateItem {
    productId: string;
    quantity: number;
}

export interface RfqCreateRequest {
    customerId: string;
    items: RfqCreateItem[];
}

export interface GetRFQParams extends LoadMorePagedQuery {
    status?: RfqStatus;
}

export interface StoreMyRFQItem {
    id: string;
    code: string;
    status: string;
    createdAt: string;
}

export interface RfqDetail {
    id: string;
    code: string;
    status: string;
    createdAt: string;
    customerId: string;
    recipientName?: string;
    recipientPhone?: string;
    email?: string;
    address?: string;
    companyName?: string;
    customer?: RfqDetailCustomer;
    items: RfqDetailItem[];
}

export interface RfqDetailCustomer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
}

export interface RfqDetailItem {
    productId: string;
    productName: string;
    productCode: string;
    quantity: number;
    unit: string;
}
