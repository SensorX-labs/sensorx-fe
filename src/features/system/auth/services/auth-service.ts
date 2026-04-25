import api from "@/shared/configs/axios-config";
import { LoginRequest } from "../models/login-request";
import { LoginResponse } from "../models/login-response";
import { UserResponse } from "../models/user-response";

export class AuthService {
    async login(data: LoginRequest): Promise<LoginResponse> {
        return api.auth.post("/login", data);
    }

    // refreshToken được truyền vào từ Client Component
    async logout(refreshToken: string | undefined): Promise<void> {
        return api.auth.post("/logout", { 
            refreshToken,       // camelCase
            RefreshToken: refreshToken  // PascalCase (dùng nếu server dùng Newtonsoft mặc định)
        });
    }

    async register(data: any): Promise<any> {
        return api.auth.post("/register", data);
    }

    async refreshToken(refreshToken: string | undefined): Promise<any> {
        return api.auth.post("/refresh", { refreshToken });
    }

    async getUsers(): Promise<UserResponse[]> {
        return api.auth.get("/users");
    }
}
