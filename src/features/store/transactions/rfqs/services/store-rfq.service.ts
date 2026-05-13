import api from "@/shared/configs/axios-config";
import { LoadMorePagedResult } from "@/shared/models/load-more.base";

export const StoreRFQService = {
    createRFQ: (data: RfqCreateRequest) =>
        api.master.post<any, string>(`/rfq`, data),

    SendRFQ: (rfqId: string) =>
        api.master.post(`/rfq/send`, { rfqId }),

    getMyRFQ: () =>
        api.master.get<any, LoadMorePagedResult<StoreMyRFQItem>>(`/rfq/my-rfq`),
};

export interface RfqCreateItem {
    productId: string;
    quantity: number;
}

export interface RfqCreateRequest {
    customerId: string;
    items: RfqCreateItem[];
}

export interface GetRFQParams {

}

export interface StoreMyRFQItem {
    id: string;
    code: string;
    status: string;
    createdDate: string;
}
