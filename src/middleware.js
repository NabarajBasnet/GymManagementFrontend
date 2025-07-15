import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export const middleware = async (request) => {
  const path = request.nextUrl.pathname;

  const token = request.cookies.get("loginToken")?.value || "";
  const staffToken = request.cookies.get("staffLoginToken")?.value || "";
  const memberToken = request.cookies.get("memberLoginToken")?.value || "";
  const tenantToken = request.cookies.get("tenantLoginToken")?.value || "";
  const rootToken = request.cookies.get("rootUserLoginToken")?.value || "";

  let user = null;
  let staff = null;
  let member = null;
  let tenant = null;
  let root = null;

  try {
    if (token) user = jwtDecode(token);
    if (staffToken) staff = jwtDecode(staffToken);
    if (memberToken) member = jwtDecode(memberToken);
    if (tenantToken) tenant = jwtDecode(tenantToken);
    if (rootToken) root = jwtDecode(rootToken);

    // 🧿 MEMBER LOGIC
    if (!member && path.startsWith("/member") && path !== "/memberlogin") {
      return NextResponse.redirect(new URL("/memberlogin", request.url));
    }

    // 🧿 STAFF LOGIC
    if (!staff && path === "/MyProfile") {
      return NextResponse.redirect(new URL("/StaffLogin", request.url));
    } else if (staff && path === "/StaffLogin") {
      return NextResponse.redirect(new URL("/MyProfile", request.url));
    }

    // 🧿 ADMIN/USER LOGIC
    if (!user && path.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/userlogin", request.url));
    }

    if (user && (path === "/userlogin" || path === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 🧿 TENANT LOGIC
    if (!tenant && path.startsWith("/clientarea") && path !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (tenant && path === "/login") {
      return NextResponse.redirect(
        new URL("/clientarea/dashboard", request.url)
      );
    }

    // 🧿 ROOT LOGIC
    if (!root && path.startsWith("/root") && path !== "/root/login") {
      return NextResponse.redirect(new URL("/root/login", request.url));
    }

    // 🧿 GYM ADMIN RESTRICTIONS
    if (
      user?.role === "Gym Admin" &&
      (path.includes("/users") || path.includes("/staffmanagement/staffs"))
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  } catch (error) {
    console.error("Middleware token error:", error);
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/MyProfile",
    "/StaffLogin",
    "/member/:path*",
    "/root/:path*",
    "/clientarea/:path*",
  ],
};
