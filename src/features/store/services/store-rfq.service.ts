import api from "@/shared/configs/axios-config";
import { LoadMorePagedQuery, LoadMorePagedResult } from "@/shared/models/load-more.base";
import { RfqStatus } from "../constants/rfq-status";

export const StoreRFQService = {
    createRFQ: (data: RfqItem[]) =>
        api.master.post<{ items: RfqItem[] }, string>(`/rfq`, { items: data }),

    addProductRFQ: (rfqId: string, data: RfqItem[]) =>
        api.master.put<{ items: RfqItem[] }, string>(`/rfq/add-product/${rfqId}`, { items: data }),

    sendRFQ: (id: string) =>
        api.master.post(`/rfq/send`, { id }),

    getMyRFQ: (params: GetRFQParams) =>
        api.master.get<GetRFQParams, LoadMorePagedResult<StoreMyRFQItem>>(`/rfq/my-rfq`, { params }),

    getMyRFQDetail: (id: string) =>
        api.master.get<any, MyRfqDetail>(`/rfq/my-rfq/${id}`),
};

export interface RfqItem {
    productId: string;
    quantity: number;
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

export interface MyRfqDetail {
    id: string;
    code: string;
    status: string;
    createdAt: string;
    saleStaff?: MyRfqSaleStaff;
    customer?: MyRfqDetailCustomer;
    items: MyRfqDetailItem[];
}

export interface MyRfqSaleStaff {
    id: string;
    name: string;
    phone?: string;
    email: string;
    avatarUrl?: string;
}

export interface MyRfqDetailCustomer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
}

export interface MyRfqDetailItem {
    productId: string;
    productName: string;
    productCode: string;
    quantity: number;
    unit: string;
}
