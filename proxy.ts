import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("auth_token")?.value;

  console.log("🧩 Proxy executando em:", path, "| Token:", token);

  // 🔒 Protege /admin
  if (path.startsWith("/admin") && !token) {
    console.log("🚫 Sem login — redirecionando para /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🚪 Evita acesso ao /login se já logado
  if (path.startsWith("/login") && token) {
    console.log("✅ Já logado — redirecionando para /admin");
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

// ⚙️ Define onde o proxy vai rodar
export const config = {
  matcher: ["/admin/:path*", "/login"],
};
