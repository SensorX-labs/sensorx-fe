import api from "@/shared/configs/axios-config";
import { OffsetPagedResult, Result } from "@/shared/models/base-response";
import { BaseQueryOffsetPagedList } from "@/shared/models/base-query-page-list";
import { StaffListItem } from "../models/staff-list-response";

export type StaffFilter = BaseQueryOffsetPagedList;

export const StaffService = {
  getPagedStaffs: (params: StaffFilter) =>
    api.data.get<any, Result<OffsetPagedResult<StaffListItem>>>(`/staff/list`, { params }),

  getStaffById: (id: string) =>
    api.data.get<any, Result<StaffListItem>>(`/staff/${id}`),

  getStaffByAccountId: (id: string) =>
    api.data.get<any, Result<StaffListItem>>(`/staff/account/${id}`),
};

export default StaffService;
