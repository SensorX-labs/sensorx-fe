const PLACEHOLDER = "__NEXT_PUBLIC_API_URL__";
const DEFAULT_URL = "http://localhost:5053";

// Kiểm tra xem placeholder đã được thay thế chưa
const getBackendUrl = (): string => {
    // Nếu placeholder chưa được thay thế, dùng fallback
    if (PLACEHOLDER.startsWith("__NEXT_PUBLIC")) {
        // Chạy trong môi trường dev hoặc chưa inject
        return DEFAULT_URL;
    }
    return PLACEHOLDER;
};

export const backendUrl = getBackendUrl();
