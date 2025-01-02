import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export const middleware = async (request) => {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get('loginToken')?.value || '';
    const staffLoginToken = request.cookies.get('staffLoginToken')?.value || '';
    let loggedInUser = null;

    try {
        // Decode token if it exists
        if (token) {
            loggedInUser = jwtDecode(token);
        }

        // Redirect to login if not authenticated for dashboard routes
        if (!token && path.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Prevent authenticated users from accessing login or signup
        if (token && (path === '/login' || path === '/signup')) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // Protect role-based routes for Gym Admin
        if (loggedInUser?.role === 'Gym Admin' && (path.includes('/users') || path.includes('/staffmanagement'))) {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        // Staff login redirection
        if (!staffLoginToken && path.startsWith('/MyProfile')) {
            return NextResponse.redirect(new URL('/StaffLogin', request.url));
        } else if (staffLoginToken && path === '/StaffLogin') {
            return NextResponse.redirect(new URL("/MyProfile", request.url));
        }

    } catch (error) {
        console.error('Error verifying token:', error);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/signup', '/dashboard/:path*', '/MyProfile', '/StaffLogin'],
};
