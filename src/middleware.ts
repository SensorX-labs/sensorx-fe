import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

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
const publicPaths = ['/', '/not-found', '/shop'];
const authPaths = ['/login', '/register'];

const isPathMatch = (pathname: string, paths: string[], exactMatch: boolean = false) => {
    return paths.some(path => {
        if (exactMatch || path === '/') return pathname === path;
        return pathname === path || pathname.startsWith(`${path}/`);
    });
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isAdminArea = isPathMatch(pathname, adminPaths);
    const isAuthPath = isPathMatch(pathname, authPaths, true);
    const isPublicPath = isPathMatch(pathname, publicPaths);

    const token = request.cookies.get('token')?.value;

    if (!token) {
        if (isPublicPath || isAuthPath) return NextResponse.next();
        return NextResponse.redirect(new URL('/login', request.url));
    }

    let isStaff = false;

    try {
        const decodedToken = jwtDecode<any>(token);
        const userRole = decodedToken.role;
        const rolesArray = Array.isArray(userRole) ? userRole : [userRole];

        isStaff = rolesArray.some(role => {
            const strRole = String(role);
            return strRole !== "Customer" && strRole !== "0" && strRole !== "undefined" && strRole !== "null";
        });
    } catch (error) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        response.cookies.delete('refreshToken');
        response.cookies.delete('user');
        return response;
    }

    if (isAuthPath) {
        return NextResponse.redirect(new URL(isStaff ? '/dashboard' : '/', request.url));
    }

    if (isAdminArea) {
        if (!isStaff) return NextResponse.redirect(new URL('/not-found', request.url));
    } else {
        if (isStaff && pathname === '/') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    /*
    * Match all request paths except for the ones starting with:
    * - api (API routes)
    * - _next/static (static files)
    * - _next/image (image optimization files)
    * - favicon.ico (favicon file)
    * - assets (public assets)
    */
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)']
};