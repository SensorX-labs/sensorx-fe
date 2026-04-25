import { masterUrl } from "@/shared/constants/environment";
import { QuoteCreateRequest } from "../models/quote-create-request";
import { QuoteListItem } from "../models/quote-list-response";
import { QuoteDetail } from "../models/quote-detail-response";
import { PaginationResponse } from "@/shared/models/pagination";

export interface QuoteFilter {
  PageIndex: number;
  PageSize: number;
  SearchTerm?: string;
  CustomerId?: string;
}

export class QuoteService {
  async createQuote(data: QuoteCreateRequest): Promise<string> {
    const url = `${masterUrl}/api/quotes`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Lỗi hệ thống: ${response.status}`);
    }

    const result = await response.json();

    if (result && result.isSuccess) {
      return result.value;
    }

    throw new Error(result.error || "Đã xảy ra lỗi khi tạo báo giá");
  }

  async getListQuotes(params: QuoteFilter): Promise<PaginationResponse<QuoteListItem>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${masterUrl}/api/quotes?${queryParams.toString()}`;
    
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

    throw new Error(result.error || "Đã xảy ra lỗi khi lấy dữ liệu báo giá");
  }

  async getQuoteById(id: string): Promise<QuoteDetail> {
    const url = `${masterUrl}/api/quotes/${id}`;
    
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

    throw new Error(result.error || "Đã xảy ra lỗi khi lấy chi tiết báo giá");
  }
}
