import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ GET — lista todas as indicações, com suporte a filtros opcionais
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const fromMemberId = searchParams.get("fromMemberId");
  const toMemberId = searchParams.get("toMemberId");

  try {
    const filters: any = {};

    if (status) filters.status = status;
    if (fromMemberId) filters.fromMemberId = parseInt(fromMemberId);
    if (toMemberId) filters.toMemberId = parseInt(toMemberId);

    const referrals = await prisma.referral.findMany({
      where: filters,
      include: {
        fromMember: { select: { id: true, name: true, email: true } },
        toMember: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(referrals);
  } catch (error) {
    console.error("❌ Erro ao buscar referrals:", error);
    return NextResponse.json({ error: "Erro ao listar indicações" }, { status: 500 });
  }
}
