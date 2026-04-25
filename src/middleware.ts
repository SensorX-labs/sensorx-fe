import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Danh sách các route nội bộ của admin
const internalPaths = [
    '/dashboard',
    '/catalog',
    '/customers',
    '/inventory',
    '/reports',
    '/sales',
    '/settings',
    '/supplychain',
    '/users',
    '/warehouse'
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Kiểm tra xem user có đang truy cập vùng admin không
    const isInternalPath = internalPaths.some(path => 
        pathname === path || pathname.startsWith(`${path}/`)
    );

    if (isInternalPath) {
        const allCookies = request.cookies.getAll();
        const userCookie = request.cookies.get('user')?.value;
        const token = request.cookies.get('token')?.value;

        console.log(`Middleware Path: ${pathname}`);
        console.log("Middleware Cookies Found:", allCookies.map(c => c.name));
        console.log(`Token exists: ${!!token}, UserCookie exists: ${!!userCookie}, UserCookie Value: ${userCookie}`);

        // 1. Nếu thiếu token hoặc thông tin user -> Yêu cầu đăng nhập lại
        if (!token || !userCookie || userCookie === 'undefined') {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const user = JSON.parse(userCookie);
            const userRoles = user.roles || [];
            
            const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];
            const normalizedRoles = rolesArray.map((r: string) => r.toLowerCase());
            
            // Kiểm tra quyền: Chỉ cho phép các role có chữ 'admin' hoặc 'staff'
            const isAuthorized = normalizedRoles.some((role: string) => 
                role.includes('admin') || role.includes('staff')
            );

            if (!isAuthorized) {
                return NextResponse.redirect(new URL('/not-found', request.url));
            }
        } catch (error) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/catalog/:path*',
        '/customers/:path*',
        '/inventory/:path*',
        '/reports/:path*',
        '/sales/:path*',
        '/settings/:path*',
        '/supplychain/:path*',
        '/users/:path*',
        '/warehouse/:path*',
    ],
};
