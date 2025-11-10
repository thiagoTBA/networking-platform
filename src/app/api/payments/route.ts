import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_seguro";

// ✅ GET → listar todos os pagamentos
export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.match(/auth_token=([^;]+)/)?.[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    jwt.verify(token, JWT_SECRET);

    const payments = await prisma.payment.findMany({
      include: {
        member: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("❌ Erro ao buscar pagamentos:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// ✅ PATCH → atualizar status
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID e status são obrigatórios" }, { status: 400 });
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("❌ Erro ao atualizar pagamento:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
