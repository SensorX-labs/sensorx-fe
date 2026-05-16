import api from "@/shared/configs/axios-config";
import { OffsetPagedResult } from "@/shared/models/offset-page.base";
import { OffsetPagedQuery } from "@/shared/models/offset-page.base";
import { StaffListItem } from "../models/staff-list-response";
import { LoadMorePagedQuery, LoadMorePagedResult } from "@/shared/models/load-more.base";

export type StaffFilter = OffsetPagedQuery;

export const StaffService = {
  getPagedStaffs: (params: StaffFilter) =>
    api.data.get<any, OffsetPagedResult<StaffListItem>>(`/staff/list`, { params }),

  getStaffById: (id: string) =>
    api.data.get<any, StaffListItem>(`/staff/${id}`),

  getStaffByAccountId: (id: string) =>
    api.data.get<any, StaffListItem>(`/staff/account/${id}`),

  getLoadMoreStaff: (params: LoadMoreStaffQuery) =>
    api.master.get<any, LoadMorePagedResult<LoadMoreStaff>>(`/rfq/load-more-sale-staff`, { params }),
};

export default StaffService;
export interface LoadMoreStaffQuery extends LoadMorePagedQuery {
}

export interface LoadMoreStaff {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
}