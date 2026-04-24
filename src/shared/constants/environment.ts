const PLACEHOLDER = "__NEXT_PUBLIC_API_URL__";
const IS_PRODUCTION = !PLACEHOLDER.startsWith("__NEXT_PUBLIC");

// 1. URL của Gateway (Dùng cho môi trường Production hoặc Local Docker Gateway)
const GATEWAY_URL = IS_PRODUCTION ? PLACEHOLDER : "http://localhost:5053";

/**
 * Hàm hỗ trợ lấy URL cho từng service
 * @param localUrl Địa chỉ chạy trực tiếp service ở máy local (ví dụ: port 5051)
 * @param gatewayPath Path định danh của service trên Gateway (ví dụ: /data)
 */
const getServiceUrl = (localUrl: string, gatewayPath: string): string => {
    // Nếu là Production: Luôn đi qua Gateway + Path của service
    if (IS_PRODUCTION) {
        return `${GATEWAY_URL}${gatewayPath}`;
    }

    // Nếu là Local: Luôn đi qua Local Gateway
    // return localUrl;
    return `${GATEWAY_URL}${gatewayPath}`;
};

// 2. Export các URL cụ thể cho từng Service
export const DATA_SERVICE_URL = getServiceUrl("http://localhost:5051/api", "/api/data");
export const AUTH_SERVICE_URL = getServiceUrl("http://localhost:5052/api", "/api/auth");
export const MASTER_SERVICE_URL = getServiceUrl("http://localhost:5050/api", "/api/master");