import { NextResponse } from "next/server";

// ✅ POST → faz login e cria cookie seguro
export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("auth_token", "fake_admin_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true em deploy
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 4, // expira em 4h
  });

  return response;
}

// ✅ DELETE → logout (remove cookie)
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("auth_token");
  return response;
}
