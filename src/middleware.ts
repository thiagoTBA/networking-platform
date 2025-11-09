import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_seguro";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // 🔒 Verifica se a rota é protegida (/admin)
  const isProtected = pathname.startsWith("/admin");
  const isLogin = pathname.startsWith("/login");

  // 🚪 Se está tentando acessar rota privada sem token → redireciona
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Se o token existe, valida o JWT
  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      // Token inválido → apaga cookie e redireciona
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  // 🔁 Se já logado e tentando ir pro login → redireciona pro admin
  if (token && isLogin) {
    const adminUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
