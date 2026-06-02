import api from "@/shared/configs/axios-config";
import { LoginRequest } from "../models/login-request";
import { ChangePasswordRequest } from "../models/change-password-request";
import { ForgotPasswordRequest } from "../models/forgot-password-request";
import { LoginResponse } from "../models/login-response";
import { UserResponse } from "../models/user-response";
import { RegisterRequest } from "../models/register-request";

export interface UserPageListQuery {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    email?: string;
    fullName?: string;
    role?: string;
    isLocked?: boolean;
    warehouseId?: string;
    createdFrom?: string;
    createdTo?: string;
}

export interface UserPagedResponse {
    items: UserResponse[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface UserStatsResponse {
    totalCount: number;
    activeCount: number;
    lockedCount: number;
    warehouseStaffCount: number;
    saleStaffCount: number;
    managerCount: number;
}

export class AuthService {
    async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
        return api.auth.post("/forgot-password", data);
    }

    async changePassword(data: ChangePasswordRequest): Promise<void> {
        return api.auth.post("/change-password", data);
    }

    async login(data: LoginRequest): Promise<LoginResponse> {
        return api.auth.post("/login", data);
    }

    async register(data: RegisterRequest): Promise<void> {
        return api.auth.post("/register", data);
    }

    // refreshToken được truyền vào từ Client Component
    async logout(refreshToken: string | undefined): Promise<void> {
        return api.auth.post("/logout", {
            refreshToken,       // camelCase
            RefreshToken: refreshToken  // PascalCase (dùng nếu server dùng Newtonsoft mặc định)
        });
    }

    async refreshToken(refreshToken: string | undefined): Promise<LoginResponse> {
        return api.auth.post("/refresh", { refreshToken });
    }

    async getUsers(): Promise<UserResponse[]> {
        return api.auth.get("/users");
    }

    async getPagedUsers(query: UserPageListQuery): Promise<UserPagedResponse> {
        return api.auth.get("/users/list", { params: query });
    }

    async getUserStats(): Promise<UserStatsResponse> {
        return api.auth.get("/users/stats");
    }

    async createStaffAccount(data: { email: string; password: string, role: number, warehouseId?: string }): Promise<unknown> {
        return api.auth.post("/create", data);
    }

    async toggleUserLock(userId: string): Promise<unknown> {
        return api.auth.post(`/users/${userId}/toggle-lock`);
    }

    async updateAvatar(avatarUrl: string): Promise<unknown> {
        return api.auth.put("/update-avatar", avatarUrl);
    }
}
