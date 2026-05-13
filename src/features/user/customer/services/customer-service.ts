import api from "@/shared/configs/axios-config";
import { Customer } from "../models/customer";
import { OffsetPagedResult } from "@/shared/models/offset-page.base";
import { OffsetPagedQuery } from "@/shared/models/offset-page.base";
import { UpdateCustomerInfo } from "../models/update-customer-info";
import { UpdateShippingInfo } from "../models/update-shipping-info";
import { CustomerDetail } from "../models/customer-detail";


export const CustomerService = {
    getPagedCustomers: (params: OffsetPagedQuery) =>
        api.data.get<any, OffsetPagedResult<Customer>>('/customer/list', { params }),

    createCustomer: (customer: Customer) =>
        api.data.post<any, Customer>('/customer', customer),

    updateCustomerInfo: (customer: UpdateCustomerInfo) =>
        api.data.put<any, UpdateCustomerInfo>(`/customer/update-info`, customer),

    updateShippingInfo: (customer: UpdateShippingInfo) =>
        api.data.put<any, UpdateShippingInfo>(`/customer/update-shipping-info`, customer),

    getCustomerById: (id: string) =>
        api.data.get<any, Customer>(`/customer/${id}`),

    getDetailCustomerByAccountId: (accountId: string) =>
        api.data.get<any, CustomerDetail>(`/customer/account/${accountId}`)
};

export default CustomerService;
