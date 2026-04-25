import api from "@/shared/configs/axios-config";
import { PaginationResponse } from "@/shared/models/pagination";
import { RfqListItem } from "../models/rfq-list-response";
import { RfqDetail } from "../models/rfq-detail-response";
import { RfqCreateRequest } from "../models/rfq-create-request";

export interface RfqFilter {
    PageIndex: number;
    PageSize: number;
    SearchTerm?: string;
    CustomerId?: string;
    StaffId?: string;
}

export class RFQServices {
    async getListRFQ(params: RfqFilter): Promise<PaginationResponse<RfqListItem>> {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString());
            }
        });

        return api.master.get(`/rfq?${queryParams.toString()}`);
    }

    async getDetailRFQ(id: string): Promise<RfqDetail> {
        return api.master.get(`/rfq/${id}`);
    }

    async createRFQ(data: RfqCreateRequest): Promise<string> {
        return api.master.post(`/rfq`, data);
    }

    async assignStaff(rfqId: string, staffId: string): Promise<boolean> {
        return api.master.post(`/rfq/assign`, { rfqId, staffId });
    }
}