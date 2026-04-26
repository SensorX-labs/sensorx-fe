import axios, { AxiosInstance, AxiosError } from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { DATA_SERVICE_URL, AUTH_SERVICE_URL, MASTER_SERVICE_URL, GATEWAY_URL } from "../constants/environment";

// Đọc cookie trực tiếp từ document.cookie (chỉ chạy ở client-side)
const getClientCookie = (name: string): string | undefined => {
    if (typeof document === 'undefined') return undefined;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : undefined;
};

// Trạng thái để quản lý việc refresh token
let isRefreshing = false;
let failedQueue: any[] = [];

// Hàm xử lý hàng đợi các request bị tạm dừng do chờ token mới
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const createApiInstance = (baseURL: string): AxiosInstance => {
    const instance = axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Request interceptor: Thêm token vào header
    instance.interceptors.request.use((config) => {
        const token = getClientCookie("token");
        if (token && token !== 'undefined') {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // Response interceptor: Xử lý data
    instance.interceptors.response.use(
        (response) => {
            const result = response.data;

            // Nếu là structure Result { isSuccess, value, message }
            if (result && typeof result === 'object' && ('isSuccess' in result || 'success' in result)) {
                const isSuccess = result.isSuccess ?? result.success;
                const value = result.value ?? result.data;

                // Nếu thành công và value là object, ta trả về "Universal Result":
                // 1. Spread value để các component kiểu cũ truy cập trực tiếp (response.items)
                // 2. Giữ nguyên .value để các component kiểu mới truy cập (result.value.items)
                // 3. Đính kèm flag success
                if (isSuccess && value && typeof value === 'object') {
                    // Nếu value là array, giữ nguyên cấu trúc để caller truy cập .value
                    if (Array.isArray(value)) {
                        return {
                            value: value,
                            isSuccess: true,
                            success: true,
                            message: result.message
                        };
                    }
                    return {
                        ...(value as object),
                        value: value,
                        isSuccess: true,
                        success: true,
                        message: result.message
                    };
                }
            }

            return result;
        },
        async (error: AxiosError<any>) => {
            const originalRequest: any = error.config;
            const errorData = error.response?.data;

            // Nếu lỗi 401 (Unauthorized) và không phải là request gọi API refresh
            if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/refresh')) {

                if (isRefreshing) {
                    // Nếu đang refresh, đưa request hiện tại vào hàng đợi
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return instance(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                const refreshToken = getClientCookie("refreshToken");

                if (!refreshToken) {
                    isRefreshing = false;
                    Cookies.remove("token", { path: '/' });
                    Cookies.remove("user", { path: '/' });
                    return Promise.reject(error);
                }

                try {
                    // Gọi API refresh token
                    const response = await axios.post(`${AUTH_SERVICE_URL}/refresh`, {
                        refreshToken: refreshToken
                    });

                    // Bóc tách dữ liệu linh hoạt (theo cả structure Result cũ và mới)
                    const refreshResult = response.data;
                    const newData = refreshResult.data || refreshResult.value || refreshResult;

                    const newAccessToken = newData.accessToken || newData.token;
                    const newRefreshToken = newData.refreshToken;

                    if (!newAccessToken) throw new Error("No access token returned");

                    // Cập nhật token mới vào cookie
                    Cookies.set("token", newAccessToken, { expires: 7, path: '/' });
                    if (newRefreshToken) {
                        Cookies.set("refreshToken", newRefreshToken, { expires: 30, path: '/' });
                    }

                    // Thực hiện lại các request trong hàng đợi
                    processQueue(null, newAccessToken);

                    // Thực hiện lại chính request ban đầu
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return instance(originalRequest);
                } catch (refreshError: any) {
                    // Nếu refresh token cũng thất bại, đăng xuất người dùng
                    processQueue(refreshError, null);
                    Cookies.remove("token", { path: '/' });
                    Cookies.remove("refreshToken", { path: '/' });
                    Cookies.remove("user", { path: '/' });
                    
                    const logoutMessage = refreshError.response?.data?.message || refreshError.message || "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.";
                    toast.error(logoutMessage);
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            // Xử lý các lỗi khác
            let errorMessage = "Đã xảy ra lỗi không xác định";
            
            if (error.response) {
                // Trích xuất message linh hoạt từ Result structure (message, Message, hoặc errors)
                if (errorData && typeof errorData === 'object') {
                    errorMessage = errorData.message || errorData.Message || errorMessage;
                    
                    // Nếu có chi tiết lỗi Validation
                    if (errorData.errors) {
                        if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
                            errorMessage = errorData.errors[0];
                        } else if (typeof errorData.errors === 'object') {
                            const firstError = Object.values(errorData.errors)[0];
                            if (Array.isArray(firstError) && firstError.length > 0) {
                                errorMessage = firstError[0] as string;
                            }
                        }
                    }
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                }

                // Không hiển thị toast lỗi 401 ở đây vì ta đang xử lý refresh ở trên
                if (error.response.status !== 401) {
                    toast.error(errorMessage);
                }
            } else if (error.request) {
                errorMessage = "Không thể kết nối tới server";
                toast.error(errorMessage);
            } else {
                errorMessage = error.message;
                toast.error(errorMessage);
            }

            // Enrich error object để tương thích với cả component kiểu cũ và kiểu mới
            // Component mới: err.isSuccess === false, err.message
            // Component cũ: err.response.data
            const enrichedError = Object.assign(error, {
                isSuccess: false,
                success: false,
                message: errorMessage
            });

            return Promise.reject(enrichedError);
        }
    );

    return instance;
};

const api = {
    data: createApiInstance(DATA_SERVICE_URL),
    auth: createApiInstance(AUTH_SERVICE_URL),
    master: createApiInstance(MASTER_SERVICE_URL),
    gateway: createApiInstance(GATEWAY_URL),
};

export default api;
