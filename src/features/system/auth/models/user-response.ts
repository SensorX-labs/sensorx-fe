export interface UserResponse {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string | null;
    role: string;
    isLocked: boolean;
    createdAt: string;
    warehouseId?: string | null;
}
