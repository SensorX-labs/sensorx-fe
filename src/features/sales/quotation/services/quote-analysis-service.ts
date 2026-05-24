import axios from "axios";
import { AI_ANALYSIS_SERVICE_URL } from "@/shared/constants/environment";

export class QuoteAnalysisService {
    private readonly aiApi = axios.create({
        baseURL: AI_ANALYSIS_SERVICE_URL,
    });

    public async analyzeQuote(quoteId : string): Promise<any> {
        return this.aiApi.get(`/analysis/${quoteId}`)
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
