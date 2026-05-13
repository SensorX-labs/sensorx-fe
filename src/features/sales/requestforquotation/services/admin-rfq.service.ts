import api from "@/shared/configs/axios-config";
import { OffsetPagedQuery, OffsetPagedResult } from "@/shared/models/offset-page.base";
import { RfqListItem } from "../models/rfq-list-response";
import { RfqDetail } from "../models/rfq-detail-response";

export interface RfqFilter extends OffsetPagedQuery {
    customerId?: string;
    staffId?: string;
}

export const AdminRFQService = {
    assignStaff: (rfqId: string, staffId: string) =>
        api.master.post<any, boolean>(`/rfq/assign`, { rfqId, staffId }),

    rejectRFQ: (rfqId: string) =>
        api.master.post<any, boolean>(`/rfq/reject`, { RfqId: rfqId }),

    // 2. Queries đặc thù của Admin UI
    getListRFQ: (params: RfqFilter) =>
        api.master.get<any, OffsetPagedResult<RfqListItem>>(`/rfq`, { params }),

    getDetailRFQ: (id: string) =>
        api.master.get<any, RfqDetail>(`/rfq/${id}`),
};
