import axios, { AxiosInstance, AxiosError } from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { DATA_SERVICE_URL, AUTH_SERVICE_URL, MASTER_SERVICE_URL } from "../constants/environment";

// Hàm tạo cấu hình chung cho Axios để tránh lặp lại code Interceptor
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Thêm token vào request nếu có
  instance.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Response interceptor: trả về data và xử lý lỗi toàn cục
  instance.interceptors.response.use(
    (response) => response.data, // trả về data trực tiếp
    (error: AxiosError<any>) => {
      // Nếu có response từ server
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Đã xảy ra lỗi không xác định";
        toast.error(message);

        if (status === 401) {
          // Ví dụ: redirect sang login
          Cookies.remove("token");
        }
      } else if (error.request) {
        // Khi không nhận được response
        toast.error("Không thể kết nối tới server");
      } else {
        // Lỗi khác
        toast.error(error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Khởi tạo các instance cho từng service
const api = {
  data: createApiInstance(DATA_SERVICE_URL),
  auth: createApiInstance(AUTH_SERVICE_URL),
  master: createApiInstance(MASTER_SERVICE_URL),
};

export default api;
