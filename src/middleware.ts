import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_seguro";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;

  const isProtected = pathname.startsWith("/admin");
  const isLogin = pathname === "/login";

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // 🔒 Já logado → evita reentrar no /login
      if (isLogin) {
        return NextResponse.redirect(
          new URL(decoded.role === "ADMIN" ? "/admin/dashboard" : "/dashboard", req.url)
        );
      }

      // 🔐 Bloqueia acesso admin se role for USER
      if (isProtected && decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Token inválido:", error);
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("auth_token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/dashboard/:path*"],
};

export const runtime = "nodejs";
