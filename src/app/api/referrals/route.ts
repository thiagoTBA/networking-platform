import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ GET — lista todas as indicações
export async function GET() {
  const referrals = await prisma.referral.findMany({
    include: {
      fromMember: { select: { id: true, name: true, email: true } },
      toMember: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(referrals);
}

// ✅ POST — cria uma nova indicação
export async function POST(req: Request) {
  try {
    const { fromMemberId, toMemberId, description } = await req.json();

    if (!fromMemberId || !toMemberId) {
      return NextResponse.json({ error: "IDs obrigatórios não informados" }, { status: 400 });
    }

    const referral = await prisma.referral.create({
      data: {
        fromMemberId,
        toMemberId,
        description,
      },
    });

    return NextResponse.json(referral, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar referral:", error);
    return NextResponse.json({ error: "Erro interno ao criar referral" }, { status: 500 });
  }
}
