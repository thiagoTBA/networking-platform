import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ GET — lista todas as reuniões
export async function GET() {
  try {
    const meetings = await prisma.meeting.findMany({
      include: {
        attendances: {
          include: {
            member: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(meetings);
  } catch (error) {
    console.error("❌ Erro ao listar reuniões:", error);
    return NextResponse.json({ error: "Erro ao listar reuniões" }, { status: 500 });
  }
}

// ✅ POST — cria nova reunião
export async function POST(req: Request) {
  try {
    const { title, description, date, location } = await req.json();

    if (!title || !date) {
      return NextResponse.json({ error: "Título e data são obrigatórios" }, { status: 400 });
    }

    const newMeeting = await prisma.meeting.create({
      data: { title, description, date: new Date(date), location },
    });

    return NextResponse.json(newMeeting, { status: 201 });
  } catch (error) {
    console.error("❌ Erro ao criar reunião:", error);
    return NextResponse.json({ error: "Erro ao criar reunião" }, { status: 500 });
  }
}
