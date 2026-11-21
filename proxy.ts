import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET ||
    "siluman-ssb-mundinglaya-secret-key-2026-super-secure",
);

const AUTH_COOKIE_NAME = "siluman_session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let session: { userId: number; username: string; role: string } | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      session = payload as unknown as {
        userId: number;
        username: string;
        role: string;
      };
    } catch {
      session = null;
    }
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isCoachRoute = pathname.startsWith("/coach");
  const isAuthRoute = pathname.startsWith("/login");

  // redirect ke dashboard masing-masing
  if (isAuthRoute && session) {
    if (session.role === "ADMINISTRATOR") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/coach", request.url));
  }

  // proteksi rute admin
  if (isAdminRoute) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "ADMINISTRATOR") {
      return NextResponse.redirect(new URL("/coach", request.url));
    }
  }

  // proteksi rute coach
  if (isCoachRoute) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "PELATIH") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/coach/:path*", "/login"],
};
