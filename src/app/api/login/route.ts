import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_seguro";

// ✅ POST → faz login e cria cookie JWT válido
export async function POST() {
  // Gera um JWT verdadeiro
  const token = jwt.sign(
    { user: "admin", role: "ADMIN" }, // payload
    JWT_SECRET,
    { expiresIn: "4h" } // expira em 4h
  );

  const response = NextResponse.json({ success: true });

  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 4,
  });

  return response;
}

// ✅ DELETE → logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("auth_token");
  return response;
}
