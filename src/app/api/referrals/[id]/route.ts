import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const { status, description } = await req.json();

    const updated = await prisma.referral.update({
      where: { id },
      data: { status, description },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar referral:", error);
    return NextResponse.json({ error: "Erro interno ao atualizar referral" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await prisma.referral.delete({ where: { id } });
    return NextResponse.json({ message: "Indicação excluída" });
  } catch (error) {
    console.error("Erro ao deletar referral:", error);
    return NextResponse.json({ error: "Erro interno ao excluir referral" }, { status: 500 });
  }
}
