import { masterUrl } from "@/shared/constants/environment";
import { QuoteCreateRequest } from "../models/quote-create-request";

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
}
