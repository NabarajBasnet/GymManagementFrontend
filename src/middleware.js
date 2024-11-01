import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
    const url = req.nextUrl.clone();
    const token = req.cookies.get('loginToken');

    if (!token) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    try {
        jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
        console.log("Invalid Token:", error);
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
