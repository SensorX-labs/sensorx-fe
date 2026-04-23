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

    // Nếu là Local: Bạn có thể chọn gọi trực tiếp service hoặc qua Local Gateway
    // Hiện tại ưu tiên gọi trực tiếp để tiện phát triển khi chưa có Gateway
    return localUrl;
};

// 2. Export các URL cụ thể cho từng Service
export const DATA_SERVICE_URL = getServiceUrl("http://localhost:5051", "/data");
export const AUTH_SERVICE_URL = getServiceUrl("http://localhost:5052", "/auth");
export const MASTER_SERVICE_URL = getServiceUrl("http://localhost:5050", "/master");