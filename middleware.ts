import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleWare(req) {
    const pathname = req.nextUrl.pathname;
    const isAuth = await getToken({ req });
    const isLoginPage = pathname.startsWith("/login");
    const sensitiveRoute = ["/dashboard"];
    const isAccessingSensitiveRoute = sensitiveRoute.some((route) =>
      pathname.startsWith(route),
    );
    if (isLoginPage) {
      if (isAuth) return NextResponse.redirect(new URL("/dashboard", req.url));
      return NextResponse.next();
    }
    if (!isAuth && isAccessingSensitiveRoute)
      return NextResponse.redirect(new URL("/dashboard", req.url));
    if (pathname === "/")
      return NextResponse.redirect(new URL("dashboard", req.url));
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/", "/login", "/dashboard/:path"],
};
