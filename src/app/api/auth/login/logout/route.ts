import { NextResponse } from "next/server";

export async function POST() {
  // 🧹 Remove o cookie de autenticação
  const response = NextResponse.json({ success: true, message: "Logout realizado com sucesso" });
  response.cookies.delete("auth_token");

  return response;
}
