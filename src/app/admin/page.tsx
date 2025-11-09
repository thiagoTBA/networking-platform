"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Application {
  id: string;
  name: string;
  email: string;
  company: string | null;
  reason: string | null;
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // ✅ Logout
  async function handleLogout() {
    document.cookie = "auth_token=; Max-Age=0; path=/; SameSite=Lax;";
    router.push("/login");
  }

  // ✅ Busca as aplicações
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setMessage("");

      try {
        const res = await fetch("/api/applications");
        if (!res.ok) throw new Error("Erro ao carregar solicitações.");

        const data = await res.json();
        setApplications(data);
      } catch (error) {
        setMessage("❌ Erro ao carregar solicitações.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [refresh]);

  // ✅ Atualiza status (aprovar/rejeitar)
  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    setMessage("");

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar status.");

      const data = await res.json();

      // Se o backend retornar um link de convite
      if (status === "APPROVED" && data.inviteLink) {
        console.log("🎟️ CONVITE GERADO:", data.inviteLink);
        setMessage("✅ Aplicação aprovada! Link de convite exibido no console.");
      } else if (status === "REJECTED") {
        setMessage("🚫 Aplicação rejeitada.");
      }

      // Atualiza lista após 2s
      setTimeout(() => {
        setMessage("");
        setRefresh((prev) => !prev);
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Erro ao atualizar status da aplicação.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* 🔹 Cabeçalho */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Painel Administrativo
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
        >
          Sair
        </button>
      </header>

      {/* 🔹 Mensagens */}
      {message && (
        <div className="mb-4 p-3 rounded-md bg-blue-100 text-blue-800 text-sm shadow-sm">
          {message}
        </div>
      )}

      {/* 🔹 Lista de aplicações */}
      {loading ? (
        <p>Carregando solicitações...</p>
      ) : applications.length === 0 ? (
        <p>Nenhuma solicitação encontrada.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">{app.name}</p>
                  <p className="text-sm text-gray-500">{app.email}</p>
                  <p className="text-sm text-gray-400">
                    {app.company || "Sem empresa"}
                  </p>
                  <p
                    className={`text-xs mt-1 font-medium ${
                      app.status.toLowerCase() === "pending"
                        ? "text-yellow-600"
                        : app.status.toLowerCase() === "approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Status: {app.status}
                  </p>
                </div>

                {/* ✅ Corrigido: Agora checa status em minúsculo também */}
                {app.status.toLowerCase() === "pending" && (
                  <div className="space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleAction(app.id, "APPROVED")}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleAction(app.id, "REJECTED")}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Rejeitar
                    </button>
                  </div>
                )}
              </div>

              {/* Motivo */}
              {app.reason && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700">
                    Motivo para participar:
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    “{app.reason}”
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
