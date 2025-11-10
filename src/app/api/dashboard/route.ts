import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ GET — Retorna métricas e estatísticas do sistema
export async function GET() {
  try {
    // Total de reuniões realizadas
    const totalMeetings = await prisma.meeting.count();

    // Total de registros de presença
    const totalAttendances = await prisma.attendance.count();

    // Média de presenças por reunião
    const avgAttendance =
      totalMeetings > 0
        ? (totalAttendances / totalMeetings).toFixed(1)
        : 0;

    // Top 5 membros mais ativos (maior número de presenças)
    const topMembers = await prisma.member.findMany({
      include: {
        attendances: true,
      },
    });

    const rankedMembers = topMembers
      .map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        attendances: m.attendances.length,
      }))
      .sort((a, b) => b.attendances - a.attendances)
      .slice(0, 5);

    // Distribuição mensal (presenças por mês)
    const attendances = await prisma.attendance.findMany({
      include: { meeting: true },
    });

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("pt-BR", { month: "short" }),
      count: 0,
    }));

    for (const a of attendances) {
      const monthIdx = new Date(a.createdAt).getMonth();
      monthlyData[monthIdx].count += 1;
    }

    return NextResponse.json({
      totalMeetings,
      totalAttendances,
      avgAttendance,
      rankedMembers,
      monthlyData,
    });
  } catch (error) {
    console.error("❌ Erro ao gerar métricas:", error);
    return NextResponse.json(
      { error: "Erro interno ao calcular métricas" },
      { status: 500 }
    );
  }
}
