"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link"; // 🆕 Navegação entre páginas
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Status = "PENDING" | "PAID" | "OVERDUE";

type Payment = {
  id: number;
  member: { name: string } | null;
  memberId: number;
  month: string;
  year: number;
  amount: number;
  status: Status;
};

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function FinancePage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch("/api/payments")
      .then((res) => res.json())
      .then((data) => setPayments(data))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: number, status: Status) {
    await fetch("/api/payments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  const { totalPaid, totalPending, totalOverdue, countPaid, countPending, countOverdue } = useMemo(() => {
    let totalPaid = 0, totalPending = 0, totalOverdue = 0;
    let countPaid = 0, countPending = 0, countOverdue = 0;
    for (const p of payments) {
      if (p.status === "PAID") { totalPaid += p.amount; countPaid++; }
      else if (p.status === "PENDING") { totalPending += p.amount; countPending++; }
      else { totalOverdue += p.amount; countOverdue++; }
    }
    return { totalPaid, totalPending, totalOverdue, countPaid, countPending, countOverdue };
  }, [payments]);

  const pieData = useMemo(() => ([
    { name: `Pago (${countPaid})`, value: totalPaid, color: "#16a34a" },
    { name: `Pendente (${countPending})`, value: totalPending, color: "#facc15" },
    { name: `Vencido (${countOverdue})`, value: totalOverdue, color: "#dc2626" },
  ]), [totalPaid, totalPending, totalOverdue, countPaid, countPending, countOverdue]);

  if (loading) return <div className="p-6 text-center">Carregando...</div>;

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
      {/* 🔹 Cabeçalho com botão de voltar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">💰 Controle Financeiro</h1>
        <Link href="/admin/dashboard" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
          ← Voltar ao Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Total Pago" value={BRL.format(totalPaid)} subtitle={`${countPaid} pagamentos`} tone="success" />
        <KpiCard title="Pendente" value={BRL.format(totalPending)} subtitle={`${countPending} pagamentos`} tone="warning" />
        <KpiCard title="Vencido" value={BRL.format(totalOverdue)} subtitle={`${countOverdue} pagamentos`} tone="danger" />
      </div>

      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-4 h-[360px]">
            <h2 className="font-semibold mb-2">Distribuição por Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie dataKey="value" data={pieData} outerRadius={100} label>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => BRL.format(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ title, value, subtitle, tone = "neutral" }: { title: string; value: string; subtitle?: string; tone?: "success" | "warning" | "danger" | "neutral"; }) {
  const toneClasses = {
    success: "bg-green-50 text-green-800 border-green-100",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-100",
    danger: "bg-red-50 text-red-800 border-red-100",
    neutral: "bg-gray-50 text-gray-800 border-gray-100",
  } as const;

  return (
    <div className={`rounded-2xl border ${toneClasses[tone]} p-4 shadow-sm`}>
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {subtitle && <div className="text-xs opacity-70 mt-1">{subtitle}</div>}
    </div>
  );
}
