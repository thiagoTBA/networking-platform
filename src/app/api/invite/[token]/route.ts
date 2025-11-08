import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// Lembre-se de rodar: npm install bcrypt @types/bcrypt
import bcrypt from "bcrypt";

// Define o tipo do 'context' que o Next.js passa para a rota
interface RouteContext {
  params: {
    token: string;
  };
}

// ✅ GET — Valida o convite
export async function GET(req: Request, { params }: RouteContext) {
  try {
    const { token } = params;

    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    // 1. Checa se o convite existe
    if (!invitation) {
      return NextResponse.json(
        { error: "Convite inválido", valid: false },
        { status: 404 }
      );
    }

    // 2. Checa se já foi usado (status 'COMPLETED')
    if (invitation.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Convite já utilizado", valid: false },
        { status: 400 }
      );
    }

    // 3. Checa se está expirado
    if (new Date(invitation.expires) < new Date()) {
      return NextResponse.json(
        { error: "Convite expirado", valid: false },
        { status: 400 }
      );
    }

    // Se chegou aqui, é válido
    return NextResponse.json({
      valid: true,
      email: invitation.email,
    });
  } catch (error) {
    console.error("❌ Erro ao validar o convite:", error);
    return NextResponse.json(
      { error: "Erro interno ao validar o convite", valid: false },
      { status: 500 }
    );
  }
}

// ✅ POST — Registra o