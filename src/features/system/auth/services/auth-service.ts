import api from "@/shared/configs/axios-config";
import { LoginRequest } from "../models/login-request";
import { LoginResponse } from "../models/login-response";

export class AuthService {
    async login(data: LoginRequest): Promise<LoginResponse> {
        return api.auth.post("/login", data);
    }

    async logout(): Promise<void> {
        return api.auth.post("/logout");
    }

    async register(data: any): Promise<any> {
        return api.auth.post("/register", data);
    }

    async refreshToken(): Promise<any> {
        return api.auth.post("/refresh");
    }
}