import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // npm install jsonwebtoken

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_seguro"; // ⚠️ define isso no .env

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "E-mail e senha são obrigatórios" }, { status: 400 });
    }

    const member = await prisma.member.findUnique({ where: { email } });
    if (!member) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

    const valid = await bcrypt.compare(password, member.password);
    if (!valid) return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });

    // 🪄 Gera o token JWT
    const token = jwt.sign(
      {
        id: member.id,
        email: member.email,
        name: member.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 Salva o token em um cookie HttpOnly
    const response = NextResponse.json({
      success: true,
      message: "Login realizado com sucesso!",
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    return response;
  } catch (error) {
    console.error("❌ Erro no login:", error);
    return NextResponse.json({ error: "Erro interno no login" }, { status: 500 });
  }
}
