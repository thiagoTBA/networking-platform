import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_seguro";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // 🔎 Busca o membro
    const member = await prisma.member.findUnique({
      where: { email },
    });

    if (!member) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // 🔑 Confere senha (bcrypt ou texto simples)
    const validPassword = member.password.startsWith("$2b$")
      ? await bcrypt.compare(password, member.password)
      : password === member.password;

    if (!validPassword) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    // 🧩 Cria token JWT incluindo ROLE
    const token = jwt.sign(
      {
        id: member.id,
        email: member.email,
        name: member.name,
        role: member.role, // 👈 ESSENCIAL: adiciona role no token
      },
      JWT_SECRET,
      { expiresIn: "4h" }
    );

    // 🍪 Envia cookie
    const res = NextResponse.json({
      success: true,
      message: "Login realizado com sucesso!",
      user: { id: member.id, name: member.name, email: member.email, role: member.role },
    });

    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 4, // 4 horas
    });

    return res;
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json({ error: "Erro interno no login" }, { status: 500 });
  }
}
