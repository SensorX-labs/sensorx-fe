'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export interface User {
    id: string;
    email: string;
    role: string;
    warehouseId?: string;
}

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = () => {
            try {
                // Giải mã token để lấy thông tin user thay vì dùng user cookie (có thể bị thay đổi không chính xác cho xác thực)
                const token = Cookies.get('token');
                if (token) {
                    const decoded: any = jwtDecode(token);
                    // Map lại các field từ JWT (thường là sub, email, roles)
                    const roleVal = decoded.roles || decoded.role || [];
                    const normalizedRoles = Array.isArray(roleVal) ? roleVal[0] : roleVal;
                    setUser({
                        id: decoded.id || decoded.sub,
                        email: decoded.email || decoded.unique_name,
                        role: normalizedRoles,
                        warehouseId: decoded.warehouse_id || undefined
                    });
                }
            } catch (error) {
                console.error("Error retrieving user info:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    return {
        user,
        isLoading,
        isAuthenticated: !!user
    };
};
