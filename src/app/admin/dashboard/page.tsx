"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // 🆕 Adicionado para navegação interna

// 💡 Componente simples para os "cards" de estatísticas
function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4 hover:shadow-md transition">
      <div className="bg-blue-100 p-3 rounded-full">
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

interface DashboardStats {
  activeMembers: number;
  referralsThisMonth: number;
  thanksThisMonth: number;
}

interface User {
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          activeMembers: data?.activeMembers ?? 0,
          referralsThisMonth: data?.referralsThisMonth ?? 0,
          thanksThisMonth: data?.thanksThisMonth ?? 0,
        });
      })
      .catch((err) => {
        console.error("Erro ao buscar dados do dashboard:", err);
        setStats({
          activeMembers: 0,
          referralsThisMonth: 0,
          thanksThisMonth: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  if (loading)
    return <div className="p-8 text-gray-500">Carregando dados...</div>;

  if (!stats)
    return <div className="p-8 text-red-600">Erro ao carregar métricas.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* 🔹 Cabeçalho */}
      <header className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard de Performance</h1>
          <p className="text-gray-600">Resumo de desempenho do grupo este mês.</p>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-right">
                <p className="font-medium text-gray-700">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 uppercase">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
              >
                Sair
              </button>
            </>
          ) : (
            <p className="text-gray-500">Carregando usuário...</p>
          )}
        </div>
      </header>

      {/* 🔹 Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Membros Ativos" value={(stats?.activeMembers ?? 0).toString()} icon="👥" />
        <StatCard title="Indicações no Mês" value={(stats?.referralsThisMonth ?? 0).toString()} icon="🚀" />
        <StatCard title="Total de 'Obrigados' no Mês" value={(stats?.thanksThisMonth ?? 0).toString()} icon="❤️" />
      </div>

      {/* 🔹 Navegação simples */}
      <div className="flex justify-center gap-4 pt-4">
        <Link href="/admin/finance" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Ir para Financeiro 💰
        </Link>

        <Link href="/admin/meetings" className="px-5 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition">
          Ver Reuniões 📅
        </Link>
      </div>
    </div>
  );
}
