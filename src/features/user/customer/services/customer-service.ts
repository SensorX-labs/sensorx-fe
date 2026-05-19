import api from "@/shared/configs/axios-config";
import { OffsetPagedResult } from "@/shared/models/offset-page.base";
import { OffsetPagedQuery } from "@/shared/models/offset-page.base";

export const CustomerService = {
    getPagedCustomers: (params: OffsetPagedQuery) =>
        api.data.get<any, OffsetPagedResult<Customer>>('/customer/list', { params }),
};

export default CustomerService;

export interface Customer {
    id?: string;
    name: string;
    code?: string;
    taxCode?: string;
    email: string;
    phone?: string;
    address?: string;
    wardId?: string | null;
    provinceId?: string | null;
    shippingAddress?: string;
    receiverName?: string;
    receiverPhone?: string;
    createdAt?: string;
}