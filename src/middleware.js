import { NextResponse } from "next/server";

export const middleware = async (request) => {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get('loginToken')?.value || '';

    try {
        if (!token && path.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/login', request.url));
        } else if (token && (path === '/login' || path === '/signup')) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } catch (error) {
        console.error('Error verifying token:', error);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/signup', '/dashboard/:path*'],
};
