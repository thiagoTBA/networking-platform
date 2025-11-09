
"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    // Exemplo simples (dados mockados)
    // Pode ser integrado à API futuramente
    setStats({
      total: 15,
      approved: 7,
      pending: 5,
      rejected: 3,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        📊 Dashboard — Visão Geral
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total de Aplicações" value={stats.total} color="bg-blue-600" />
        <Card title="Aprovadas" value={stats.approved} color="bg-green-600" />
        <Card title="Pendentes" value={stats.pending} color="bg-yellow-500" />
        <Card title="Rejeitadas" value={stats.rejected} color="bg-red-600" />
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-md text-white ${color} hover:scale-[1.02] transition-transform`}
    >
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
