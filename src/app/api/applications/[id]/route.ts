import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

// 1. CORRIGIDO: O Next.js App Router passa os 'params' da URL como segundo argumento.
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 2. CORRIGIDO: Pegamos o 'id' (string) diretamente dos params.
    const { id } = params;
    const { status } = await req.json();

    // 3. CORRIGIDO: Validando os status em MAIÚSCULO (como o AdminPage envia).
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Status inválido. Use 'APPROVED' ou 'REJECTED'." },
        { status: 400 }
      );
    }

    // Atualiza a aplicação no banco
    const application = await prisma.application.update({
      // 4. CORRIGIDO: 'id' agora é uma string (CUID), o que é o correto.
      where: { id },
      data: { status },
    });

    let inviteLink = null;

    // Se for aprovada, cria um convite
    if (status === "APPROVED") {
      const token = randomUUID();
      // Define uma expiração (ex: 7 dias), como planejado no schema
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 dias

      await prisma.invitation.create({
        data: {
          email: application.email,
          token,
          expires,
          status: "PENDING",
          // 5. CORRIGIDO: Este é o vínculo crucial que faltava.
          applicationId: application.id,
        },
      });

      // Simula o envio de e-mail (como pedido no teste)
      inviteLink = `http://localhost:3000/invite/${token}`;
      console.log(
        `✅ Convite criado para ${application.email}: ${inviteLink}`
      );
    }

    // Retorna a aplicação atualizada e o link (se foi gerado)
    return NextResponse.json({ ...application, inviteLink }, { status: 200 });

  } catch (error) {
    // Adiciona um log de erro mais específico se a 'application' não for encontrada
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { error: `Aplicação com ID não encontrada.` },
        { status: 404 }
      );
    }

    console.error("❌ Erro ao atualizar aplicação:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar aplicação." },
      { status: 500 }
    );
  }
}