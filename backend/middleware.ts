import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Protection des routes admin
    if (pathname.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/connexion?callbackUrl=/admin/dashboard", req.url));
      }
      const role = token.role as string;
      if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/?error=forbidden", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Laisser passer les routes non-admin sans token
        if (!req.nextUrl.pathname.startsWith("/admin")) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
