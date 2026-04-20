import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { backendUrl } from "../constants/environment";

export const api = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm token vào request nếu có
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: trả về data và xử lý lỗi toàn cục
api.interceptors.response.use(
  (response) => {
    const res = response.data;
    // Nếu response có cấu trúc chuẩn { isSuccess, value, error }
    if (res && typeof res === "object" && "isSuccess" in res) {
      if (res.isSuccess) {
        return res.value;
      }
      // Nếu không thành công, trả về Promise.reject để rơi vào catch
      return Promise.reject({
        message: res.error || "Đã xảy ra lỗi hệ thống",
        isBusinessError: true,
      });
    }
    return res;
  },
  (error: any) => {
    // Nếu là lỗi business từ interceptor trên
    if (error.isBusinessError) {
      toast.error(error.message);
      return Promise.reject(error);
    }

    // Nếu có response từ server (Lỗi HTTP như 400, 401, 500...)
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

export default api;
