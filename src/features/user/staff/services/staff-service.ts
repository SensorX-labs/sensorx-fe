import api from "@/shared/configs/axios-config";
import { PaginationResponse } from "@/shared/models/pagination";
import { StaffListItem } from "../models/staff-list-response";

export interface StaffFilter {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
}

export class StaffService {
  async getStaffs(params: StaffFilter): Promise<PaginationResponse<StaffListItem>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    return api.data.get(`/staff/list?${queryParams.toString()}`);
  }
}
