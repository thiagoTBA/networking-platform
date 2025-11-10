import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get("month") || "0");
    const year = parseInt(searchParams.get("year") || "0");

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Reuniões realizadas
    const meetings = await prisma.meeting.findMany({
      where: { date: { gte: startDate, lte: endDate } },
      include: { attendances: true },
    });

    const totalMeetings = meetings.length;
    const avgAttendance =
      meetings.length > 0
        ? Math.round(
            meetings.reduce((sum, m) => sum + m.attendances.length, 0) /
              meetings.length
          )
        : 0;

    // Indicações (referrals)
    const referrals = await prisma.referral.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
    });

    const referralsStats = {
      total: referrals.length,
      enviadas: referrals.filter((r) => r.status === "ENVIADA").length,
      negociando: referrals.filter((r) => r.status === "EM_NEGOCIACAO").length,
      fechadas: referrals.filter((r) => r.status === "FECHADA").length,
    };

    // Pagamentos
    const payments = await prisma.payment.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
    });

    const paymentsStats = {
      total: payments.length,
      pagos: payments.filter((p) => p.status === "PAID").length,
      pendentes: payments.filter((p) => p.status === "PENDING").length,
      vencidos: payments.filter((p) => p.status === "OVERDUE").length,
    };

    return NextResponse.json({
      meetings: { totalMeetings, avgAttendance },
      referrals: referralsStats,
      payments: paymentsStats,
    });
  } catch (error) {
    console.error("❌ Erro ao gerar relatório:", error);
    return NextResponse.json(
      { error: "Erro ao gerar relatório" },
      { status: 500 }
    );
  }
}
