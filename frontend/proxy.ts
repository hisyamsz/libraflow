import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JWTExtended } from "./types/Auth";
import { getToken } from "next-auth/jwt";
import environment from "./config/environment";
import { ROLE } from "./constants/auth.contants";

export async function proxy(request: NextRequest) {
  const token: JWTExtended | null = await getToken({
    req: request,
    secret: environment.AUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const isExpired = token?.exp
    ? (token.exp as number) < currentTimestamp
    : false;

  const handleAuthRedirect = () => {
    const url = new URL("/login", request.url);
    const callbackUrl = request.nextUrl.pathname + request.nextUrl.search;
    url.searchParams.set("callbackUrl", callbackUrl);

    const response = NextResponse.redirect(url);
    response.cookies.set("next-auth.session-token", "", {
      path: "/",
      maxAge: 0,
    });
    response.cookies.set("__Secure-next-auth.session-token", "", {
      path: "/",
      maxAge: 0,
    });
    return response;
  };

  if (
    pathname === "/login" &&
    token &&
    !isExpired
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token || isExpired) {
      return handleAuthRedirect();
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!token || isExpired) {
      return handleAuthRedirect();
    }

    if (token.user?.role !== ROLE.ADMIN) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
