import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_seguro";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;

  const isProtected = pathname.startsWith("/admin");
  const isLogin = pathname === "/login";

  // 🔒 Bloqueia acesso a /admin se não tiver token
  if (isProtected && !token) {
    console.log("🚫 Sem login — redirecionando para /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔑 Se tem token, validamos
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // 🚪 Evita acesso ao /login se já estiver logado
      if (isLogin) {
        const redirectTo =
          decoded.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
        console.log("✅ Já logado — redirecionando para", redirectTo);
        return NextResponse.redirect(new URL(redirectTo, req.url));
      }

      // 🔐 Bloqueia /admin se o usuário não for ADMIN
      if (isProtected && decoded.role !== "ADMIN") {
        console.log("🚫 Usuário comum tentando acessar área admin");
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

  // ✅ Continua normalmente se rota pública
  return NextResponse.next();
}

// ⚙️ Define onde o middleware roda
export const config = {
  matcher: ["/admin/:path*", "/login", "/dashboard/:path*"],
};

export const runtime = "nodejs";
