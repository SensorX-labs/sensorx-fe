import api from "@/shared/configs/axios-config";
import { Customer } from "../models/customer";
import { OffsetPagedResult, Result } from "@/shared/models/base-response";
import { BaseQueryOffsetPagedList } from "@/shared/models/base-query-page-list";

export const CustomerService = {
    getPagedCustomers: async (params : BaseQueryOffsetPagedList): Promise<Result<OffsetPagedResult<Customer>>> => {
        return api.data.get('/customer/list', {params});
    },

    createCustomer: async (customer : Customer) => {
        const response = await api.data.post('/customer', customer);
        return response.data;
    },

    updateCustomer: async (id : string, customer : Customer) => {
        const response = await api.data.put(`/customer/${id}`, customer);
        return response.data;
    },

    getCustomerById: async (id : string) => {
        const response = await api.data.get(`/customer/${id}`);
        return response.data;
    },

    deleteCustomer: async (id : string) => {
        const response = await api.data.delete(`/customer/${id}`);
        return response.data;
    } , 

    getDetailCustomerByAccountId: async (accountId : string) : Promise<Customer> => {
        const response = await api.data.get<any, Result<Customer>>(`/customer/account/${accountId}`);
        return response.value!;
    }
};

export default CustomerService;
