"use client";

import { useEffect, useMemo, useState } from "react";
// ✅ Removi next/dynamic. Import direto do Recharts + renderização só após montar no cliente
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

  // ✅ Evita SSR para Recharts (só renderiza após montar no cliente)
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const monthlyData = useMemo(() => {
    const map = new Map<string, { monthLabel: string; paid: number; pending: number; overdue: number }>();
    for (const p of payments) {
      const mm = String(p.month).padStart(2, "0");
      const key = `${p.year}-${mm}`;
      const label = `${mm}/${p.year}`;
      if (!map.has(key)) map.set(key, { monthLabel: label, paid: 0, pending: 0, overdue: 0 });
      const bucket = map.get(key)!;
      if (p.status === "PAID") bucket.paid += p.amount;
      else if (p.status === "PENDING") bucket.pending += p.amount;
      else bucket.overdue += p.amount;
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([_, v]) => v);
  }, [payments]);

  const pieData = useMemo(() => ([
    { name: `Pago (${countPaid})`, value: totalPaid, color: "#16a34a" },
    { name: `Pendente (${countPending})`, value: totalPending, color: "#facc15" },
    { name: `Vencido (${countOverdue})`, value: totalOverdue, color: "#dc2626" },
  ]), [totalPaid, totalPending, totalOverdue, countPaid, countPending, countOverdue]);

  if (loading) {
    return <div className="p-6 text-center">Carregando...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">💰 Controle Financeiro</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Total Pago" value={BRL.format(totalPaid)} subtitle={`${countPaid} pagamentos`} tone="success" />
        <KpiCard title="Pendente" value={BRL.format(totalPending)} subtitle={`${countPending} pagamentos`} tone="warning" />
        <KpiCard title="Vencido" value={BRL.format(totalOverdue)} subtitle={`${countOverdue} pagamentos`} tone="danger" />
      </div>

      {/* ✅ Renderiza gráficos só depois de montar (evita erro no SSR) */}
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

          <div className="bg-white rounded-2xl shadow p-4 h-[360px]">
            <h2 className="font-semibold mb-2">Receita por Mês</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthLabel" />
                <YAxis tickFormatter={(v: number | string) => BRL.format(Number(v)).replace("R$", "")} />
                <Tooltip formatter={(value) => BRL.format(Number(value))} />
                <Legend />
                <Bar dataKey="paid" name="Pago" fill="#16a34a" />
                <Bar dataKey="pending" name="Pendente" fill="#facc15" />
                <Bar dataKey="overdue" name="Vencido" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Pagamentos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3">Membro</th>
                <th className="p-3">Mês/Ano</th>
                <th className="p-3">Valor</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.member?.name ?? `#${p.memberId}`}</td>
                  <td className="p-3">{String(p.month).padStart(2, "0")}/{p.year}</td>
                  <td className="p-3">{BRL.format(p.amount)}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        p.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : p.status === "OVERDUE"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {p.status !== "PAID" && (
                      <button
                        onClick={() => updateStatus(p.id, "PAID")}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:opacity-90"
                      >
                        Marcar Pago
                      </button>
                    )}
                    {p.status !== "OVERDUE" && (
                      <button
                        onClick={() => updateStatus(p.id, "OVERDUE")}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:opacity-90"
                      >
                        Vencido
                      </button>
                    )}
                    {p.status !== "PENDING" && (
                      <button
                        onClick={() => updateStatus(p.id, "PENDING")}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:opacity-90"
                      >
                        Pendente
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
