'use client';

import {useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

export interface User {
    id: string;
    email: string;
    roles: string[];
}

export const useUser = () => {
    const [user, setUser] = useState < User | null > (null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = () => {
            try { // 1. Thử lấy từ cookie 'user' đã lưu khi login
                const userCookie = Cookies.get('user');
                if (userCookie) {
                    setUser(JSON.parse(userCookie));
                } else { // 2. Nếu không có (ví dụ F5 hoặc cookie user bị mất), thử giải mã từ accessToken
                    const token = Cookies.get('token');
                    if (token) {
                        const decoded: any = jwtDecode(token);
                        // Map lại các field từ JWT (thường là sub, email, roles)
                        setUser({
                            id: decoded.id || decoded.sub,
                            email: decoded.email || decoded.unique_name,
                            roles: decoded.roles || decoded.role || []
                        });
                    }
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
        isAuthenticated: !!user,
        isAdmin: Array.isArray(user ?. roles) ? user.roles.some(r => r.toLowerCase() === 'admin') : user ?. roles === 'Admin'
    };
};
