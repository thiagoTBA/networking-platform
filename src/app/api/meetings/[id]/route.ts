import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🗑️ DELETE — exclui uma reunião e suas presenças
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    await prisma.attendance.deleteMany({ where: { meetingId: id } });
    await prisma.meeting.delete({ where: { id } });

    return NextResponse.json({ message: "Reunião excluída com sucesso" });
  } catch (error) {
    console.error("❌ Erro ao excluir reunião:", error);
    return NextResponse.json({ error: "Erro ao excluir reunião" }, { status: 500 });
  }
}
