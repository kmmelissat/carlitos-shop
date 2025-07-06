import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only check authentication for admin routes
  if (pathname.startsWith("/admin")) {
    const authToken = request.cookies.get("firebase-id-token");

    if (!authToken) {
      // No token, redirect to login
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Token exists, let the server component handle verification
    // This provides a fast redirect for users without tokens
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
