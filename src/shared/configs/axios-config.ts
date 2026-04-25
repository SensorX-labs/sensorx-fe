import axios, { AxiosInstance, AxiosError } from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { DATA_SERVICE_URL, AUTH_SERVICE_URL, MASTER_SERVICE_URL } from "../constants/environment";

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
        const token = Cookies.get("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    // Response interceptor: Xử lý data và Auto Refresh Token
    instance.interceptors.response.use(
        (response) => response.data,
        async (error: AxiosError<any>) => {
            const originalRequest: any = error.config;

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

                const refreshToken = Cookies.get("refreshToken");
                
                if (!refreshToken) {
                    isRefreshing = false;
                    Cookies.remove("token");
                    Cookies.remove("user");
                    // Chuyển hướng người dùng về trang login nếu cần
                    // window.location.href = '/login';
                    return Promise.reject(error);
                }

                try {
                    // Gọi API refresh token (sử dụng axios trực tiếp để tránh interceptor loop)
                    const response = await axios.post(`${AUTH_SERVICE_URL}/refresh`, {
                        refreshToken: refreshToken
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response.data;

                    // Cập nhật token mới vào cookie
                    Cookies.set("token", accessToken, { expires: 7 });
                    if (newRefreshToken) {
                        Cookies.set("refreshToken", newRefreshToken, { expires: 30 });
                    }

                    // Thực hiện lại các request trong hàng đợi
                    processQueue(null, accessToken);
                    
                    // Thực hiện lại chính request ban đầu
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return instance(originalRequest);
                } catch (refreshError) {
                    // Nếu refresh token cũng thất bại, đăng xuất người dùng
                    processQueue(refreshError, null);
                    Cookies.remove("token");
                    Cookies.remove("refreshToken");
                    Cookies.remove("user");
                    toast.error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            // Xử lý các lỗi khác
            if (error.response) {
                const message = error.response.data?.message || "Đã xảy ra lỗi không xác định";
                // Không hiển thị toast lỗi 401 ở đây vì ta đang xử lý refresh
                if (error.response.status !== 401) {
                    toast.error(message);
                }
            } else if (error.request) {
                toast.error("Không thể kết nối tới server");
            } else {
                toast.error(error.message);
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

const api = {
    data: createApiInstance(DATA_SERVICE_URL),
    auth: createApiInstance(AUTH_SERVICE_URL),
    master: createApiInstance(MASTER_SERVICE_URL),
};

export default api;
