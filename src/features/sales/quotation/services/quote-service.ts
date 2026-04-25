import api from "@/shared/configs/axios-config";
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
    return api.master.post(`/quotes`, data);
  }

  async getListQuotes(params: QuoteFilter): Promise<PaginationResponse<QuoteListItem>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return api.master.get(`/quotes?${queryParams.toString()}`);
  }

  async getQuoteById(id: string): Promise<QuoteDetail> {
    return api.master.get(`/quotes/${id}`);
  }
}
