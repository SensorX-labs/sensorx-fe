import api from "@/shared/configs/axios-config";
import { RfqCreateRequest } from "../../features/sales/requestforquotation/models/rfq-create-request";

export const RFQCoreService = {
    createRFQ: (data: RfqCreateRequest) =>
        api.master.post<any, string>(`/rfq`, data),

    assignStaff: (rfqId: string, staffId: string) =>
        api.master.post<any, boolean>(`/rfq/assign`, { rfqId, staffId }),

    rejectRFQ: (rfqId: string) =>
        api.master.post<any, boolean>(`/rfq/reject`, { RfqId: rfqId }),
};
