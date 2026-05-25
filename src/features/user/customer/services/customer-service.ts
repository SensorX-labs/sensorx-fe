import api from '@/shared/configs/axios-config';
import { OffsetPagedQuery, OffsetPagedResult } from '@/shared/models/offset-page.base';

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

export interface CustomerPageListQuery extends OffsetPagedQuery {
  searchTerm?: string;
  code?: string;
  name?: string;
  taxCode?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdFrom?: string;
  createdTo?: string;
}

export const CustomerService = {
  getPagedCustomers: (params: CustomerPageListQuery) =>
    api.data.get<unknown, OffsetPagedResult<Customer>>('/customer/list', { params }),
};

export default CustomerService;
