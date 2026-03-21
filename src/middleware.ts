import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login"];
const ADMIN_ROUTES = ["/dashboard", "/calendar", "/analytics"];

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const pathname = nextUrl.pathname;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if (!session) {
    if (isPublicRoute) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/schedule", req.url));
  }

  if (isAdminRoute && session.user.role === "RECEPTIONIST") {
    return NextResponse.redirect(new URL("/schedule", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
