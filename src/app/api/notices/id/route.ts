import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true, email: true } } },
  });
  return NextResponse.json(notices);
}

export async function POST(req: Request) {
  try {
    const { title, content, authorId } = await req.json();

    if (!title || !content || !authorId) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const notice = await prisma.notice.create({
      data: { title, content, authorId },
    });

    return NextResponse.json(notice, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar aviso:", error);
    return NextResponse.json({ error: "Erro interno ao criar aviso" }, { status: 500 });
  }
}
