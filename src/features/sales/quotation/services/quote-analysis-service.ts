import axios from "axios";

export class QuoteAnalysisService {
    private readonly ai_endpoint = "http://localhost:8000/api/v1/";
    private readonly aiApi = axios.create({
        baseURL: this.ai_endpoint,
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