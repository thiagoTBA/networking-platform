import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🟢 POST — alterna presença individual
export async function POST(req: Request) {
  try {
    const { meetingId, memberId } = await req.json();

    const existing = await prisma.attendance.findFirst({
      where: { meetingId, memberId },
    });

    if (existing) {
      // remove presença (toggle)
      await prisma.attendance.delete({ where: { id: existing.id } });
      return NextResponse.json({ message: "Presença removida" });
    }

    // cria presença
    const attendance = await prisma.attendance.create({
      data: { meetingId, memberId, attended: true },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("❌ Erro ao marcar presença:", error);
    return NextResponse.json({ error: "Erro ao marcar presença" }, { status: 500 });
  }
}
