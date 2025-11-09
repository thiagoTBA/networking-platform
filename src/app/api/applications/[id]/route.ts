// src/app/api/applications/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInviteEmail } from "@/lib/emailService"; // ⬅️ Importação do serviço de e-mail

// PATCH /api/applications/[id]
export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    // ✅ 1. Extrai o ID
    const { id: idString } = await context.params;
    const { status } = await req.json();

    if (!idString) {
      return NextResponse.json({ error: "ID não informado." }, { status: 400 });
    }

    if (!status || !["APPROVED", "REJECTED"].includes(status.toUpperCase())) {
      return NextResponse.json({ error: "Status inválido." }, { status: 400 });
    }

    // ✅ 2. Converte a string da URL para um número inteiro (Int)
    const id = parseInt(idString, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID da aplicação inválido (não é um número)." }, { status: 400 });
    }

    // ✅ 3. Atualiza o status no banco (ID é Int)
    const application = await prisma.application.update({
      where: { id },
      data: { status: status.toUpperCase() },
    });

    // ✅ 4. Se aprovado, cria o convite e envia o e-mail
    let inviteLink = null;
    if (status.toUpperCase() === "APPROVED") {
      const token = Math.random().toString(36).substring(2, 12);
      
      const invitation = await prisma.invitation.create({
        data: {
          email: application.email,
          token,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // expira em 24h
          applicationId: application.id,
        },
      });

      inviteLink = `/invite/${invitation.token}`;
      console.log("✅ Convite criado:", inviteLink);

      // 🛑 NOVO: Tenta enviar o e-mail de convite
      try {
        await sendInviteEmail({
          toEmail: application.email,
          inviteLink: inviteLink,
          userName: application.name,
        });
      } catch (emailError) {
        // Loga o erro, mas permite que a requisição 200 continue, 
        // pois a aplicação já foi aprovada no banco de dados.
        console.warn(`⚠️ Aviso: Falha ao enviar e-mail para ${application.email}.`, emailError);
      }
    }

    // ✅ 5. Retorna resultado
    return NextResponse.json({
      success: true,
      status: application.status,
      inviteLink,
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar aplicação:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar aplicação." },
      { status: 500 }
    );
  }
}