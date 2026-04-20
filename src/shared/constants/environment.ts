const PLACEHOLDER = "__NEXT_PUBLIC_API_URL__";
export const masterUrl = "http://localhost:5001";
export const dataUrl = "http://localhost:5000";
export const aiUrl = "http://localhost:8000";

// Kiểm tra xem placeholder đã được thay thế chưa
const getBackendUrl = (): string => {
    if (PLACEHOLDER.startsWith("__NEXT_PUBLIC")) {
        return masterUrl;
    }
    return PLACEHOLDER;
};

export const backendUrl = getBackendUrl();
