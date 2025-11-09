import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// ✅ GET — Valida o convite
export async function GET(
  req: Request,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;

    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Convite inválido", valid: false }, { status: 404 });
    }

    if (invitation.used) {
      return NextResponse.json({ error: "Convite já utilizado", valid: false }, { status: 400 });
    }

    if (new Date(invitation.expires) < new Date()) {
      return NextResponse.json({ error: "Convite expirado", valid: false }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      email: invitation.email,
    });
  } catch (error) {
    console.error("❌ Erro ao validar o convite:", error);
    return NextResponse.json({ error: "Erro interno ao validar o convite", valid: false }, { status: 500 });
  }
}

// ✅ POST — Concluir cadastro via convite
export async function POST(
  req: Request,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;
    const body = await req.json();
    const { name, company, password } = body;

    // 1. Busca o convite
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { application: true },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Convite inválido" }, { status: 404 });
    }

    if (invitation.used) {
      return NextResponse.json({ error: "Convite já utilizado" }, { status: 400 });
    }

    if (new Date(invitation.expires) < new Date()) {
      return NextResponse.json({ error: "Convite expirado" }, { status: 400 });
    }

    // 2. Cria o novo membro
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.member.create({
      data: {
        name,
        email: invitation.email,
        company: company || invitation.application?.company || null,
        password: hashedPassword,
      },
    });

    // 3. Marca o convite como usado
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { used: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Erro ao registrar o usuário:", error);
    return NextResponse.json({ error: "Erro interno ao enviar o formulário" }, { status: 500 });
  }
}
