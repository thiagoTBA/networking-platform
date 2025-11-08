"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Application {
  // 1. CORRIGIDO: O ID do Prisma (CUID) é uma string, não um número.
  id: string;
  name: string;
  email: string;
  company: string | null;
  // 2. ADICIONADO: O campo 'reason' que vem da API
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

  // ✅ Logout: remove cookie e redireciona
  async function handleLogout() {
    document.cookie = "auth_token=; Max-Age=0; path=/; SameSite=Lax;";
    router.push("/login");
  }

  // ✅ Busca as aplicações no servidor
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

  // ✅ Atualiza status da aplicação (aprovar/rejeitar)
  // 3. CORRIGIDO: O 'id' recebido é uma string.
  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    setMessage("");

    try {
      // O endpoint aqui está correto, mas vamos precisar ver o
      // arquivo [id]/route.ts que lida com o PATCH.
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      // O 'console.log' simula o envio do e-mail/link
      if (status === "APPROVED" && data.inviteLink) {
        console.log("CONVITE GERADO (Simulando envio):", data.inviteLink);
        setMessage("✅ Aplicação aprovada! Link de convite gerado no console.");
      } else {
        setMessage("❌ Aplicação rejeitada.");
      }

      // 🔹 Mensagem desaparece após 3 segundos
      setTimeout(() => setMessage(""), 3000);

      // Atualiza a lista
      setRefresh((prev) => !prev);
    } catch {
      setMessage("⚠️ Erro ao atualizar status da aplicação.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* 🔹 Topo do painel */}
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

      {/* 🔹 Mensagem de feedback */}
      {message && (
        <div className="mb-4 p-3 rounded-md bg-blue-100 text-blue-800 text-sm shadow-sm">
          {message}
        </div>
      )}

      {/* 🔹 Conteúdo principal */}
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
                      app.status === "PENDING"
                        ? "text-yellow-600"
                        : app.status === "APPROVED"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Status: {app.status}
                  </p>
                </div>
                {/* 4. ADICIONADO: Botões de ação (apenas se pendente) */}
                {app.status === "PENDING" && (
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

              {/* 5. ADICIONADO: Exibição do "motivo" */}
              {app.reason && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700">
                    Motivo para participar:
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    "{app.reason}"
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