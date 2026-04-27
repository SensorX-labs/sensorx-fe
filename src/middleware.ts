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
const authRequiredPaths = ['/shop', '/profile', '/cart', '/checkout', '/orders'];

// Route công khai - không cần đăng nhập
const publicPaths = ['/', '/login', '/register', '/not-found'];

// Route chỉ dành cho Customer (Cấm Admin/Staff)
const customerOnlyPaths = ['/shop', '/profile', '/cart', '/checkout', '/orders'];

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    const token = request.cookies.get('token') ?. value;
    const userCookie = request.cookies.get('user') ?. value;
    const isLoggedIn = !!(token && userCookie && userCookie !== 'undefined');

    let user: any = null;
    let rolesArray: string[] = [];

    if (isLoggedIn) {
        try {
            user = JSON.parse(userCookie!);
            rolesArray = Array.isArray(user.roles) ? user.roles : [user.roles];
        } catch (e) {
            console.error("Middleware JSON parse error", e);
        }
    }

    // 1. Kiểm tra route admin (Cấm Customer)
    const isAdminPath = adminPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

    if (isAdminPath) { 
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const isAuthorized = rolesArray.some((role: string) => String(role) !== "Customer" && String(role) !== "0");

        if (!isAuthorized) {
            return NextResponse.redirect(new URL('/not-found', request.url));
        }
    }

    // 2. Kiểm tra route chỉ dành cho Customer (Cấm Staff/Admin)
    const isCustomerOnlyPath = customerOnlyPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

    if (isCustomerOnlyPath && isLoggedIn) {
        const isCustomer = rolesArray.includes('Customer') || rolesArray.includes('0');
        
        if (!isCustomer) {
            // Nếu là Staff/Admin mà vào trang Customer -> Đẩy vào Dashboard
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // 3. Kiểm tra route yêu cầu đăng nhập chung
    const isAuthRequired = authRequiredPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

    if (isAuthRequired && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 4. Nếu đã đăng nhập mà truy cập trang login -> về trang chủ hoặc dashboard
    if (pathname === '/login' && isLoggedIn) {
        const isCustomer = rolesArray.includes('Customer') || rolesArray.includes('0');
        return NextResponse.redirect(new URL(isCustomer ? '/' : '/dashboard', request.url));
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
