import api from "@/shared/configs/axios-config";
import { PaginationRequest, PaginationResponse } from "@/shared/models/pagination";
import { StaffListItem } from "../models/staff-list-response";

export interface StaffFilter {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
}

export class StaffService {
  async getPagedStaffs (params : PaginationRequest) {
    return api.data.get<PaginationResponse<StaffListItem>>(
      `/staff/list`,
      { params }
    );
  }

  async getStaffById(id: string) {
    return api.data.get<StaffListItem>(`/staff/${id}`);
  }

  async getStaffByAccountId(id: string) {
    return api.data.get<StaffListItem>(`/staff/account/${id}`);
  }
}
