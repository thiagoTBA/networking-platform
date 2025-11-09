import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    console.log("🧾 Dados recebidos no login:", body);

    // 🔒 Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // 1. Busca o membro pelo e-mail
    const member = await prisma.member.findUnique({
      where: { email },
    });

    if (!member) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // 2. Verifica senha
    const validPassword = await bcrypt.compare(password, member.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    // 3. Gera um token simples (JWT virá depois)
    const token = Buffer.from(`${member.id}:${Date.now()}`).toString("base64");

    return NextResponse.json({
      success: true,
      message: "Login realizado com sucesso!",
      user: {
        id: member.id,
        name: member.name,
        email: member.email,
      },
      token,
    });
  } catch (error) {
  console.error("❌ Erro no login detalhado:", error);
  return NextResponse.json(
    { error: "Erro interno no login", details: String(error) },
    { status: 500 }
  );
}
}
