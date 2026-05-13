import api from "@/shared/configs/axios-config";
import { RFQCoreService } from "@/shared/services/rfq-core.service";
import { RfqDetail } from "@/features/sales/requestforquotation/models/rfq-detail-response";

export const StoreRFQService = {
    // 1. Kế thừa Commands từ Core (Composition)
    ...RFQCoreService,

    // 2. Queries đặc thù của Storefront UI
    getMyRFQ: () =>
        api.master.get<any, any>(`/rfq/my-rfq`),

    getListRFQ: (params: any) =>
        api.master.get<any, any>(`/rfq`, { params }),

    getDetailRFQ: (id: string) =>
        api.master.get<any, RfqDetail>(`/rfq/${id}`),
};
