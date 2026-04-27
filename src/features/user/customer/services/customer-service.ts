import api from "@/shared/configs/axios-config";
import { Customer } from "../models/customer";
import { OffsetPagedResult, Result } from "@/shared/models/base-response";
import { BaseQueryOffsetPagedList } from "@/shared/models/base-query-page-list";

// Kiểu dữ liệu "Universal" mà Interceptor của bạn trả về: 
// Kết hợp giữa Wrapper Result và các thuộc tính của chính Object đó
type UniversalResult<T> = Result<T> & T;

export const CustomerService = {
    getPagedCustomers: (params: BaseQueryOffsetPagedList): Promise<UniversalResult<OffsetPagedResult<Customer>>> => {
        return api.data.get<any, UniversalResult<OffsetPagedResult<Customer>>>('/customer/list', { params });
    },

    createCustomer: async (customer: Customer): Promise<UniversalResult<Customer>> => {
        return api.data.post<any, UniversalResult<Customer>>('/customer', customer);
    },

    updateCustomer: async (id: string, customer: Customer): Promise<UniversalResult<Customer>> => {
        return api.data.put<any, UniversalResult<Customer>>(`/customer/${id}`, customer);
    },

    getCustomerById: async (id: string): Promise<UniversalResult<Customer>> => {
        return api.data.get<any, UniversalResult<Customer>>(`/customer/${id}`);
    },

    deleteCustomer: async (id: string): Promise<Result<boolean>> => {
        return api.data.delete<any, Result<boolean>>(`/customer/${id}`);
    },

    getDetailCustomerByAccountId: async (accountId: string): Promise<UniversalResult<Customer>> => {
        return api.data.get<any, UniversalResult<Customer>>(`/customer/account/${accountId}`);
    }
};

export default CustomerService;
