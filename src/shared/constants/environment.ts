const PLACEHOLDER = "__NEXT_PUBLIC_API_URL__";
const AI_PLACEHOLDER = "__NEXT_PUBLIC_AI_URL__";
const IS_PRODUCTION = !PLACEHOLDER.startsWith("__NEXT_PUBLIC");

// Chỉ duy nhất Gateway URL
export const GATEWAY_URL = process.env.NEXT_PUBLIC_API_URL || (IS_PRODUCTION
  ? PLACEHOLDER
  : "http://localhost:5053");

// LLM Calling service – exposed tại llm.ducdz.xyz (production)
const AI_BASE_URL = process.env.NEXT_PUBLIC_AI_URL || (IS_PRODUCTION
  ? AI_PLACEHOLDER
  : "http://localhost:8000");

// Các prefix cho từng service qua Gateway
export const DATA_SERVICE_URL = `${GATEWAY_URL}/api/data`;
export const AUTH_SERVICE_URL = `${GATEWAY_URL}/auth`;
export const MASTER_SERVICE_URL = `${GATEWAY_URL}/api/master`;
export const WAREHOUSE_SERVICE_URL = `${GATEWAY_URL}/api/warehouse`;
export const AI_ANALYSIS_SERVICE_URL = `${AI_BASE_URL}/api/v1`;

