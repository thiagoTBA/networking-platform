import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

// ✅ Corrigido: criação de convite vinculada a uma Application existente
export async function POST(req: Request) {
  try {
    const { email, applicationId } = await req.json();

    if (!email || !applicationId) {
      return NextResponse.json({ error: "Email e applicationId são obrigatórios." }, { status: 400 });
    }

    const token = randomUUID();

    const invitation = await prisma.invitation.create({
      data: {
        email,
        token,
        application: { connect: { id: applicationId } }, // 👈 Conexão obrigatória com Application
      },
    });

    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar convite:", error);
    return NextResponse.json({ error: "Erro interno ao criar convite." }, { status: 500 });
  }
}

// ✅ Exemplo de GET para listar convites existentes (opcional)
export async function GET() {
  try {
    const invitations = await prisma.invitation.findMany({
      include: { application: true },
    });
    return NextResponse.json(invitations, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar convites:", error);
    return NextResponse.json({ error: "Erro interno ao listar convites." }, { status: 500 });
  }
}
