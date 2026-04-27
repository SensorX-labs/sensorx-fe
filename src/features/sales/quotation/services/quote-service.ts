import api from "@/shared/configs/axios-config";
import {QuoteCreateRequest} from "../models/quote-create-request";
import {QuoteListItem} from "../models/quote-list-response";
import {QuoteDetail} from "../models/quote-detail-response";
import {OffsetPagedResult, Result} from "@/shared/models/base-response";
import {BaseQueryOffsetPagedList} from "@/shared/models/base-query-page-list";

export interface QuoteFilter extends BaseQueryOffsetPagedList {
    customerId?: string;
}

export const QuoteService = {
    createQuote: (data : QuoteCreateRequest) => api.master.post<any,Result<string>>(`/quotes`, data),

    getListQuotes: (params : QuoteFilter) => api.master.get<any,Result<OffsetPagedResult<QuoteListItem>>>(`/quotes`, {params}),

    getQuoteById: (id : string) => api.master.get<any,Result<QuoteDetail>>(`/quotes/${id}`) ,

    submitForApproval: (id : string) => api.master.post<any,Result<string>>(`/quotes/${id}/submit-for-approval`),

    approve: (id : string) => api.master.post<any,Result<string>>(`/quotes/${id}/approve`),

    accept: (id: string, data: any = {}) => api.master.post<any, Result<string>>(`/quotes/${id}/accept`, data),
};

export default QuoteService;
