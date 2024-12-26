import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("authToken")?.value;

  const protectedPaths = ["/profile", "/chat", "/askgenie", "/"];
  const currentPath = request.nextUrl.pathname;

  const isProtectedPath = protectedPaths.some((path) =>
    currentPath.startsWith(path)
  );
  if (!token && isProtectedPath) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (!token && currentPath === "/") {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow access to other pathss
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/chat/:path*",
    "/askgenie/:path*",
    "/explore",
    "/reels",
    "/",
  ],
};
