import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// NÃO precisamos de importações extras de erro do Prisma

// GET → lista todas as aplicações
export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(applications);
  } catch (error) {
    console.error("Erro ao buscar applications:", error);
    return NextResponse.json({ error: "Erro ao buscar aplicações" }, { status: 500 });
  }
}

// POST → cria nova aplicação
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, reason } = body;

    // "reason" também é obrigatório junto com name e email
    if (!name || !email || !reason) {
      return NextResponse.json(
        { error: "Nome, email e o motivo são obrigatórios" },
        { status: 400 }
      );
    }

    const newApplication = await prisma.application.create({
      data: {
        name,
        email,
        company,
        reason,
      },
    });

    return NextResponse.json(newApplication, { status: 201 });

  } catch (error) {
    // 4. ALTERADO: Tratamento de erro type-safe para 'unknown'
    // Verificamos se 'error' é um objeto e se tem a propriedade 'code'
    if (typeof error === 'object' && error !== null && 'code' in error) {
      // Código 'P2002' do Prisma é "Unique constraint failed"
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "Este e-mail já foi utilizado para uma solicitação." },
          { status: 409 } // 409 Conflict
        );
      }
    }

    // Erro genérico
    console.error("Erro ao criar application:", error);
    return NextResponse.json({ error: "Erro ao criar aplicação" }, { status: 500 });
  }
}