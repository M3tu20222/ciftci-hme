import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth } from "./middleware/adminAuth";
import { getToken } from "./middleware/getToken";

export async function middleware(request: NextRequest) {
  // Admin only routes
  if (request.nextUrl.pathname.startsWith("/kullanicilar")) {
    return adminAuth(request);
  }

  // Protected routes
  if (
    request.nextUrl.pathname.startsWith("/envanter") ||
    request.nextUrl.pathname.startsWith("/finans") ||
    request.nextUrl.pathname.startsWith("/plots")
  ) {
    const token = await getToken(request);
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}
