const PLACEHOLDER = "__NEXT_PUBLIC_API_URL__";
const IS_PRODUCTION = !PLACEHOLDER.startsWith("__NEXT_PUBLIC");

// Chỉ duy nhất Gateway URL
export const GATEWAY_URL = IS_PRODUCTION ? PLACEHOLDER : "http://192.168.31.46:5053";

// Các prefix cho từng service qua Gateway
export const DATA_SERVICE_URL = `${GATEWAY_URL}/api/data`;
export const AUTH_SERVICE_URL = `${GATEWAY_URL}/auth`;
export const MASTER_SERVICE_URL = `${GATEWAY_URL}/api/master`;
