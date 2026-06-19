import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { getAllAdminPaths, getAllowedRoutes } from './shared/configs/admin-menu.config';

const publicPaths = ['/', '/not-found', '/shop', '/catalog', '/brands', '/contact'];
const authPaths = ['/login', '/register', '/forgot-password'];

// Lấy danh sách tất cả các path thuộc vùng Admin để định danh vùng bảo vệ
const adminPaths = getAllAdminPaths();

const isPathMatch = (pathname: string, paths: string[], exactMatch: boolean = false) => {
    return paths.some(path => {
        if (exactMatch || path === '/') return pathname === path;
        return pathname === path || pathname.startsWith(`${path}/`);
    });
};

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isAdminArea = isPathMatch(pathname, adminPaths);
    const isAuthPath = isPathMatch(pathname, authPaths, true);
    const isPublicPath = isPathMatch(pathname, publicPaths);

    const token = request.cookies.get('token')?.value;

    // 1. Trường hợp chưa đăng nhập
    if (!token) {
        if (isPublicPath || isAuthPath) return NextResponse.next();
        return NextResponse.redirect(new URL('/login', request.url));
    }

    let isAdminPage = false;
    let userRole = "";

    try {
        const decodedToken = jwtDecode<any>(token);
        const role = decodedToken.role;
        const rolesArray = Array.isArray(role) ? role : [role];

        isAdminPage = rolesArray.some(r => {
            const strRole = String(r);
            return strRole !== "Customer" && strRole !== "0" && strRole !== "undefined" && strRole !== "null";
        });

        userRole = rolesArray[0];
    } catch (error) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        response.cookies.delete('refreshToken');
        response.cookies.delete('user');
        return response;
    }

    // Lấy Whitelist các Route được phép cho Role này
    const allowedRoutes = isAdminPage ? getAllowedRoutes(userRole) : [];

    // 2. Xử lý logic chuyển hướng sau khi đã có Token và Role
    if (isAdminPage) {
        // NHÂN VIÊN: Chỉ được phép truy cập các route trong Whitelist
        // Chặn cả các trang công khai (như /shop, /) nếu không có trong allowedRoutes
        const isAllowed = isPathMatch(pathname, allowedRoutes);

        if (isAuthPath) {
            return NextResponse.redirect(new URL(allowedRoutes[0], request.url));
        }

        if (!isAllowed) {
            return NextResponse.redirect(new URL(allowedRoutes[0], request.url));
        }
    } else {
        // KHÁCH HÀNG: Tuyệt đối không được vào vùng Admin
        if (isAuthPath) return NextResponse.redirect(new URL('/', request.url));

        if (isAdminArea) {
            return NextResponse.redirect(new URL('/not-found', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
    ],
};
