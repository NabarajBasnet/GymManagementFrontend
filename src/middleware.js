import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export const middleware = async (request) => {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get('loginToken')?.value || '';
    const staffLoginToken = request.cookies.get('staffLoginToken')?.value || '';
    const memberLoginToken = request.cookies.get('memberLoginToken')?.value || '';

    let loggedInUser = null;
    
    let loggedInMember = null;

    try {
        // Early block: If no member token and trying to access member pages
        if (!memberLoginToken && path.startsWith('/member')) {
            return NextResponse.redirect(new URL('/memberlogin', request.url));
        }

        // Now decode after confirming token exists
        if (token) {
            loggedInUser = jwtDecode(token);
        }

        if (memberLoginToken) {
            loggedInMember = jwtDecode(memberLoginToken);
        }

        // If member is logged in, prevent accessing dashboard/admin/staff routes
        if (loggedInMember?.type === 'member' && (
            path.startsWith('/dashboard') ||
            path.startsWith('/StaffLogin') ||
            path.startsWith('/login') ||
            path.startsWith('/signup') ||
            path.startsWith('/member/login') ||
            path.startsWith('/MyProfile')
        )) {
            return NextResponse.redirect(new URL(`/member/${loggedInMember.id}/qrcode`, request.url));
        }

        // Redirect to login if admin not logged in
        if (!token && path.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        if (token && (path === '/login' || path === '/signup')) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        if (loggedInUser?.role === 'Gym Admin' && (path.includes('/users') || path.includes('/staffmanagement/staffs'))) {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

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
    matcher: [
        '/login',
        '/signup',
        '/dashboard/:path*',
        '/MyProfile',
        '/StaffLogin',
        '/member/:path*'
    ],
};
