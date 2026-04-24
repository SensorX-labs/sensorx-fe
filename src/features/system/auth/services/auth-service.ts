import api from "@/shared/configs/axios-config";
import { LoginRequest } from "../models/login-request";
import { LoginResponse } from "../models/login-response";

export class AuthService {
    async login(data: LoginRequest): Promise<LoginResponse> {
        return api.auth.post("/login", data);
    }
}