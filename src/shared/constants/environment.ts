const PLACEHOLDER = "__NEXT_PUBLIC_API_URL__";
const IS_PRODUCTION = !PLACEHOLDER.startsWith("__NEXT_PUBLIC");

// Chỉ duy nhất Gateway URL
export const GATEWAY_URL = process.env.NEXT_PUBLIC_API_URL || (IS_PRODUCTION
  ? PLACEHOLDER
  : "http://localhost:5053");

// Các prefix cho từng service qua Gateway
export const DATA_SERVICE_URL = `${GATEWAY_URL}/api/data`;
export const AUTH_SERVICE_URL = `${GATEWAY_URL}/auth`;
export const MASTER_SERVICE_URL = `${GATEWAY_URL}/api/master`;
export const WAREHOUSE_SERVICE_URL = `${GATEWAY_URL}/api/warehouse`;
export const AI_ANALYSIS_SERVICE_URL = process.env.NEXT_PUBLIC_AI_URL
  ? `${process.env.NEXT_PUBLIC_AI_URL}/api/v1`
  : (IS_PRODUCTION
    ? `${PLACEHOLDER}/api/ai-analysis`
    : "http://localhost:8000/api/v1");
