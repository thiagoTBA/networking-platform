"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminReferralsDashboard() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("TODAS");

  // 🎯 Busca os dados das indicações
  const fetchReferrals = async () => {
    setLoading(true);
    const res = await fetch("/api/referrals");
    const data = await res.json();
    setReferrals(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  // 🔍 Filtros
  const filteredReferrals =
    filter === "TODAS"
      ? referrals
      : referrals.filter((r) => r.status === filter);

  // 📊 Contadores de status
  const total = referrals.length;
  const enviadas = referrals.filter((r) => r.status === "ENVIADA").length;
  const negociando = referrals.filter((r) => r.status === "EM_NEGOCIACAO").length;
  const fechadas = referrals.filter((r) => r.status === "FECHADA").length;

  // 🎨 Gráfico de pizza (Recharts)
  const chartData = [
    { name: "Enviadas", value: enviadas },
    { name: "Em Negociação", value: negociando },
    { name: "Fechadas", value: fechadas },
  ];

  const COLORS = ["#3B82F6", "#F59E0B", "#10B981"];

  // 🔄 Atualiza status
  const handleStatusUpdate = async (id: number, newStatus: string) => {
    await fetch(`/api/referrals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchReferrals();
  };

  // ❌ Exclui indicação
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta indicação?")) return;
    await fetch(`/api/referrals/${id}`, { method: "DELETE" });
    fetchReferrals();
  };

  if (loading) return <p className="p-8">Carregando dados...</p>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📈 Painel de Indicações</h1>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 text-blue-700 p-4 rounded-lg shadow">
          <h2 className="text-sm font-semibold">Enviadas</h2>
          <p className="text-2xl font-bold">{enviadas}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg shadow">
          <h2 className="text-sm font-semibold">Em Negociação</h2>
          <p className="text-2xl font-bold">{negociando}</p>
        </div>
        <div className="bg-green-100 text-green-700 p-4 rounded-lg shadow">
          <h2 className="text-sm font-semibold">Fechadas</h2>
          <p className="text-2xl font-bold">{fechadas}</p>
        </div>
        <div className="bg-gray-100 text-gray-700 p-4 rounded-lg shadow">
          <h2 className="text-sm font-semibold">Total</h2>
          <p className="text-2xl font-bold">{total}</p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-2">Distribuição de Status</h2>
        <div className="w-full h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4">
        {["TODAS", "ENVIADA", "EM_NEGOCIACAO", "FECHADA"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded ${
              filter === s
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {s === "TODAS" ? "Todas" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Lista das indicações */}
      <div>
        <h2 className="text-lg font-semibold mb-3">📋 Indicações ({filteredReferrals.length})</h2>
        <ul>
          {filteredReferrals.map((r) => (
            <li
              key={r.id}
              className="border p-4 mb-3 rounded bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p>
                    <b>De:</b> {r.fromMember.name} → <b>Para:</b>{" "}
                    {r.toMember.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {r.description || "Sem descrição"}
                  </p>

                  <p className="mt-2">
                    <b>Status:</b>{" "}
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        r.status === "ENVIADA"
                          ? "bg-blue-100 text-blue-700"
                          : r.status === "EM_NEGOCIACAO"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </p>

                  {r.gratitudeMessage && (
                    <p className="mt-2 italic text-green-700">
                      💬 Agradecimento: {r.gratitudeMessage}
                    </p>
                  )}

                  <small className="text-gray-500">
                    Criado em:{" "}
                    {new Date(r.createdAt).toLocaleDateString("pt-BR")}
                    {r.closedAt &&
                      ` | Fechado em: ${new Date(r.closedAt).toLocaleDateString(
                        "pt-BR"
                      )}`}
                  </small>
                </div>

                <div className="flex flex-col gap-2">
                  {r.status !== "FECHADA" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(r.id, "EM_NEGOCIACAO")}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Em Negociação
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(r.id, "FECHADA")}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Fechar Negócio
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {filteredReferrals.length === 0 && (
          <p className="text-gray-500 mt-6 text-center">
            Nenhuma indicação encontrada neste filtro.
          </p>
        )}
      </div>
    </div>
  );
}
