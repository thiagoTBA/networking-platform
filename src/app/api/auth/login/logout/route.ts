import { NextResponse } from "next/server";

export async function POST() {
  // 🔐 Cria uma resposta com redirecionamento para /login
  const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));

  // 🧹 Apaga o cookie 'auth_token'
  response.cookies.delete("auth_token");

  return response;
}
