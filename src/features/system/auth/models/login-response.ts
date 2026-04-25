import { UserLoginResponse } from "./user-login-response";

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user : UserLoginResponse
}