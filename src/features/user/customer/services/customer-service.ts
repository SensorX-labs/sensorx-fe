import api from "@/shared/configs/axios-config";
import { Customer } from "../models/customer";
import { OffsetPagedResult } from "@/shared/models/base-response";
import { BaseQueryOffsetPagedList } from "@/shared/models/base-query-page-list";



export const CustomerService = {
    getPagedCustomers: (params: BaseQueryOffsetPagedList): Promise<OffsetPagedResult<Customer>> => {
        return api.data.get<any, OffsetPagedResult<Customer>>('/customer/list', { params });
    },

    createCustomer: async (customer: Customer): Promise<Customer> => {
        return api.data.post<any, Customer>('/customer', customer);
    },

    updateCustomer: async (customer: Customer): Promise<Customer> => {
        return api.data.put<any, Customer>(`/customer`, customer);
    },

    getCustomerById: async (id: string): Promise<Customer> => {
        return api.data.get<any, Customer>(`/customer/${id}`);
    },

    deleteCustomer: async (id: string): Promise<boolean> => {
        return api.data.delete<any, boolean>(`/customer/${id}`);
    },

    getDetailCustomerByAccountId: async (accountId: string): Promise<Customer> => {
        return api.data.get<any, Customer>(`/customer/account/${accountId}`);
    }
};

export default CustomerService;
