import axios from "axios";
import { AI_ANALYSIS_SERVICE_URL } from "@/shared/constants/environment";

export interface QuoteAnalysisPayload {
    warning_level: string;
    approval_recommendation: string;
    customer_summary: string;
    deal_status: string;
    reasoning: string;
    price_strategy: string;
}

export interface QuoteAnalysisResponse {
    status: "success" | "pending";
    message?: string;
    analysis?: QuoteAnalysisPayload;
}

export class QuoteAnalysisService {
    private readonly aiApi = axios.create({
        baseURL: AI_ANALYSIS_SERVICE_URL,
    });

    public async analyzeQuote(quoteId: string): Promise<QuoteAnalysisResponse> {
        return this.aiApi.get<QuoteAnalysisResponse>(`/analysis/${quoteId}`)
            .then(response => {
                console.log("Quote analysis result:", response.data);
                return response.data;
            })
            .catch(error => {
                console.error("Error analyzing quote:", error);
                throw error;
            });
    }
}
