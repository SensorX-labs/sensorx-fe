import api from "@/shared/configs/axios-config";
import { OffsetPagedResult } from "@/shared/models/base-response";
import { RfqListItem } from "../models/rfq-list-response";
import { RfqDetail } from "../models/rfq-detail-response";
import { BaseQueryOffsetPagedList } from "@/shared/models/base-query-page-list";
import { RFQCoreService } from "@/shared/services/rfq-core.service";

export interface RfqFilter extends BaseQueryOffsetPagedList {
    customerId?: string;
    staffId?: string;
}

export const AdminRFQService = {
    // 1. Kế thừa Commands từ Core
    ...RFQCoreService,

    // 2. Queries đặc thù của Admin UI
    getListRFQ: (params: RfqFilter) =>
        api.master.get<any, OffsetPagedResult<RfqListItem>>(`/rfq`, { params }),

    getDetailRFQ: (id: string) =>
        api.master.get<any, RfqDetail>(`/rfq/${id}`),
};
