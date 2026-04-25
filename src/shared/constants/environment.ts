const PLACEHOLDER = "__NEXT_PUBLIC_API_URL__";
export const masterUrl = "http://localhost:5001";
export const dataUrl = "http://localhost:5000";
export const aiUrl = "http://localhost:8000";
export const gatewayUrl = "http://localhost:5053";

// Kiểm tra xem placeholder đã được thay thế chưa
const getBackendUrl = () : string => {
    return gatewayUrl ;
};

export const backendUrl = getBackendUrl();
