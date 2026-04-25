import api from "@/shared/configs/axios-config";
import { Customer } from "../models/customer";
import { PaginationResponse, PaginationRequest } from "@/shared/models/pagination";

export class CustomerService {

    async getPagedCustomers(params : PaginationRequest): Promise<PaginationResponse<Customer>> {
        return api.data.get('/customer/list', {params});
    }

    async createCustomer(customer : Customer) {
        const response = await api.data.post('/customer', customer);
        return response.data;
    }

    async updateCustomer(id : string, customer : Customer) {
        const response = await api.data.put(`/customer/${id}`, customer);
        return response.data;
    }

    async getCustomerById(id : string) {
        const response = await api.data.get(`/customer/${id}`);
        return response.data;
    }

    async deleteCustomer(id : string) {
        const response = await api.data.delete(`/customer/${id}`);
        return response.data;
    }
}
