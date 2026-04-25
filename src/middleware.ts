import {NextResponse} from 'next/server';
import type {NextRequest}
from 'next/server';

// Route chỉ dành cho Admin/Staff
const adminPaths = [
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

// Route yêu cầu đăng nhập (bất kỳ role nào)
const authRequiredPaths = ['/shop', '/profile', '/markdown',];

// Route công khai - không cần đăng nhập
const publicPaths = ['/', '/login', '/register', '/not-found',];

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    const token = request.cookies.get('token') ?. value;
    const userCookie = request.cookies.get('user') ?. value;
    const isLoggedIn = !!(token && userCookie && userCookie !== 'undefined');

    // 1. Kiểm tra route admin
    const isAdminPath = adminPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

    if (isAdminPath) { // Chưa đăng nhập -> về trang login
        if (! isLoggedIn) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const user = JSON.parse(userCookie!);
            const rolesArray = Array.isArray(user.roles) ? user.roles : [user.roles];
            
            // Backend trả về chuỗi tên: "WarehouseStaff", "SaleStaff", "Manager", "Admin"
            // Chỉ có "Customer" là không được vào dashboard
            const isAuthorized = rolesArray.some((role: string) => {
                const r = String(role);
                return r !== "Customer";
            });

            if (! isAuthorized) {
                return NextResponse.redirect(new URL('/not-found', request.url));
            }
        } catch {
            return NextResponse.redirect(new URL('/login', request.url));
        }}

    // 2. Kiểm tra route yêu cầu đăng nhập (store)
    const isAuthRequired = authRequiredPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

    if (isAuthRequired && ! isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. Nếu đã đăng nhập mà truy cập trang login -> về trang chủ
    if (pathname === '/login' && isLoggedIn) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Admin routes
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
        // Store routes
        '/shop/:path*',
        '/profile/:path*',
        '/markdown/:path*',
        // Auth pages
        '/login',
    ]
};
