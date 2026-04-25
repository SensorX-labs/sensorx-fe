import api from "@/shared/configs/axios-config";
import { OffsetPagedResult, Result } from "@/shared/models/base-response";
import { BaseQueryOffsetPagedList } from "@/shared/models/base-query-page-list";
import { RfqListItem } from "../models/rfq-list-response";
import { RfqDetail } from "../models/rfq-detail-response";
import { RfqCreateRequest } from "../models/rfq-create-request";

export interface RfqFilter extends BaseQueryOffsetPagedList {
    customerId?: string;
    staffId?: string;
}

export const RFQServices = {
    getListRFQ: (params: RfqFilter) =>
        api.master.get<any, Result<OffsetPagedResult<RfqListItem>>>(`/rfq`, { params }),

    getDetailRFQ: (id: string) =>
        api.master.get<any, Result<RfqDetail>>(`/rfq/${id}`),

    createRFQ: (data: RfqCreateRequest) =>
        api.master.post<any, Result<string>>(`/rfq`, data),

    assignStaff: (rfqId: string, staffId: string) =>
        api.master.post<any, Result<boolean>>(`/rfq/assign`, { rfqId, staffId }),

    rejectRFQ: (rfqId: string) =>
        api.master.post<any, Result<boolean>>(`/rfq/reject`, { RfqId: rfqId }),
};

export default RFQServices;