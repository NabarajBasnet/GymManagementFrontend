import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export const middleware = async (request) => {
  const path = request.nextUrl.pathname;

  const token = request.cookies.get('loginToken')?.value || '';
  const staffToken = request.cookies.get('staffLoginToken')?.value || '';
  const memberToken = request.cookies.get('memberLoginToken')?.value || '';
  let user = null;
  let staff = null;
  let member = null;

  try {
    if (token) user = jwtDecode(token);
    if (staffToken) staff = jwtDecode(staffToken);
    if (memberToken) member = jwtDecode(memberToken);

    // 🧿 MEMBER LOGIC
    if (!member && path.startsWith('/member')) {
      return NextResponse.redirect(new URL('/memberlogin', request.url));
    }

    if (
      member &&
      (
        path.startsWith('/dashboard') ||
        path.startsWith('/StaffLogin') ||
        path === '/login' ||
        path === '/signup' ||
        path.startsWith('/MyProfile')
      )
    ) {
      return NextResponse.redirect(new URL(`/member/${member.id}/qrcode`, request.url));
    }

    // 🧿 STAFF LOGIC
    if (!staff && path.startsWith('/MyProfile')) {
      return NextResponse.redirect(new URL('/StaffLogin', request.url));
    } else if (staff && path === '/StaffLogin') {
      return NextResponse.redirect(new URL("/MyProfile", request.url));
    }

    // 🧿 ADMIN/USER LOGIC
    // if (!user && path.startsWith('/dashboard')) {
    //   return NextResponse.redirect(new URL('/userlogin', request.url));
    // }

    // if (user && (path === '/login' || path === '/signup')) {
    //   return NextResponse.redirect(new URL('/dashboard', request.url));
    // }

    if (user?.role === 'Gym Admin' && (
      path.includes('/users') || path.includes('/staffmanagement/staffs')
    )) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

  } catch (error) {
    console.error('Middleware token error:', error);
  }

  return NextResponse.next();
};

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
