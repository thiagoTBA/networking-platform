import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Atualiza status ou mensagem de agradecimento
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { status, gratitudeMessage } = await req.json();
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (gratitudeMessage) updateData.gratitudeMessage = gratitudeMessage;
    if (status === "FECHADA") updateData.closedAt = new Date();

    const updatedReferral = await prisma.referral.update({
      where: { id },
      data: updateData,
      include: {
        fromMember: true,
        toMember: true,
      },
    });

    return NextResponse.json(updatedReferral);
  } catch (error) {
    console.error("❌ Erro ao atualizar referral:", error);
    return NextResponse.json({ error: "Erro interno ao atualizar indicação" }, { status: 500 });
  }
}

// ✅ Exclui uma indicação
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const existingReferral = await prisma.referral.findUnique({ where: { id } });

    if (!existingReferral) {
      return NextResponse.json({ error: "Indicação não encontrada" }, { status: 404 });
    }

    await prisma.referral.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Indicação removida com sucesso" });
  } catch (error) {
    console.error("❌ Erro ao excluir referral:", error);
    return NextResponse.json({ error: "Erro interno ao excluir indicação" }, { status: 500 });
  }
}
