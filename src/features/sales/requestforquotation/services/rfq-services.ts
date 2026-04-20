import { masterUrl } from "@/shared/constants/environment";
import { PaginationResponse } from "@/shared/models/pagination";
import { RfqListItem } from "../models/rfq-list-response";
import { RfqDetail } from "../models/rfq-detail-response";

export interface RfqFilter {
    PageIndex: number;
    PageSize: number;
    SearchTerm?: string;
    CustomerId?: string;
    StaffId?: string;
}

export class RFQServices {
    async getListRFQ(params: RfqFilter): Promise<PaginationResponse<RfqListItem>> {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString());
            }
        });

        const url = `${masterUrl}/api/rfq?${queryParams.toString()}`;
        
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

        throw new Error(result.error || "Đã xảy ra lỗi khi lấy dữ liệu");
    }

    async getDetailRFQ(id: string): Promise<RfqDetail> {
        const url = `${masterUrl}/api/rfq/${id}`;
        
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

        throw new Error(result.error || "Đã xảy ra lỗi khi lấy dữ liệu");
    }
}