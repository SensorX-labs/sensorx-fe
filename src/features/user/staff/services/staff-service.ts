import { dataUrl } from "@/shared/constants/environment";
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

    const url = `${dataUrl}/api/staff/list?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Lỗi hệ thống: ${response.status}`);
    }

    const result = await response.json();

    if (result && result.isSuccess) {
      return result.value;
    }

    throw new Error(result.error || "Đã xảy ra lỗi khi lấy danh sách nhân viên");
  }
}
