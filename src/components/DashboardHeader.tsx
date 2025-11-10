"use client";

import { useEffect, useState } from "react";

export default function DashboardHeader() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <header className="flex items-center justify-between bg-white shadow-sm px-6 py-4 rounded-xl mb-6 border border-gray-100">
      <h1 className="text-xl font-semibold text-gray-800">
        {user?.role === "ADMIN" ? "Painel Administrativo" : "Dashboard do Membro"}
      </h1>

      <div className="flex items-center gap-4">
        {loading ? (
          <p className="text-gray-500 text-sm">Carregando...</p>
        ) : (
          <>
            <div className="text-right">
              <p className="font-medium text-gray-700">{user?.name || "Usuário"}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm"
            >
              Sair
            </button>
          </>
        )}
      </div>
    </header>
  );
}
