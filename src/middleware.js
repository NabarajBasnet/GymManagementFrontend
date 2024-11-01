// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';

// export function middleware(req) {
//     const url = req.nextUrl.clone();
//     const token = req.cookies.get('loginToken');

//     console.log("Retrieved Token:", token);

//     if (!token) {
//         console.log("No token found. Redirecting to /login.");
//         url.pathname = '/login';
//         return NextResponse.redirect(url);
//     }

//     try {
//         jwt.verify(token, process.env.TOKEN_SECRET);
//         console.log("Token verified successfully.");
//     } catch (error) {
//         console.log("Invalid Token:", error);
//         url.pathname = '/login';
//         return NextResponse.redirect(url);
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ['/dashboard/:path*'],
// };
