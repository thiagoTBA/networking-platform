"use client";
import { useEffect, useState } from "react";

export default function ReferralsPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [toMemberId, setToMemberId] = useState("");
  const [description, setDescription] = useState("");
  const [myReferrals, setMyReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🧠 Carrega membros e indicações do usuário
  useEffect(() => {
    fetch("/api/members").then((r) => r.json()).then(setMembers);
    fetch("/api/referrals").then((r) => r.json()).then(setMyReferrals);
  }, []);

  // 📨 Envia nova indicação
  const handleSubmit = async () => {
    if (!toMemberId || !description) {
      alert("Preencha todos os campos!");
      return;
    }
    setLoading(true);
    await fetch("/api/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromMemberId: 1, // ⚠️ depois: substituir pelo ID do token JWT
        toMemberId: parseInt(toMemberId),
        description,
      }),
    });
    setDescription("");
    setToMemberId("");
    const res = await fetch("/api/referrals");
    setMyReferrals(await res.json());
    setLoading(false);
  };

  // 🔄 Atualiza status da indicação
  const handleStatusUpdate = async (id: number, newStatus: string) => {
    await fetch(`/api/referrals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const res = await fetch("/api/referrals");
    setMyReferrals(await res.json());
  };

  // 🙏 Registra mensagem de agradecimento e fecha o negócio
  const handleThankYou = async (id: number) => {
    const msg = prompt("Escreva uma mensagem de agradecimento:");
    if (!msg) return;
    await fetch(`/api/referrals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gratitudeMessage: msg,
        status: "FECHADA",
      }),
    });
    const res = await fetch("/api/referrals");
    setMyReferrals(await res.json());
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">💼 Sistema de Indicações</h1>

      {/* Formulário de nova indicação */}
      <div className="bg-gray-50 p-4 rounded shadow mb-8">
        <h2 className="font-semibold mb-2">Nova Indicação</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={toMemberId}
            onChange={(e) => setToMemberId(e.target.value)}
            className="border p-2 rounded w-full sm:w-1/3"
          >
            <option value="">Selecione um membro</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>

          <input
            type="text"
            value={description}
            placeholder="Descrição do negócio"
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded flex-1"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>

      {/* Lista de indicações */}
      <h2 className="text-xl font-semibold mb-2">Minhas Indicações</h2>
      <ul>
        {myReferrals.map((r) => (
          <li
            key={r.id}
            className="border p-4 mb-3 rounded bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p><b>Para:</b> {r.toMember.name}</p>
                <p><b>Status:</b> {r.status}</p>
                <p className="text-gray-700 text-sm">{r.description}</p>
                {r.gratitudeMessage && (
                  <p className="mt-2 text-green-700 italic">
                    💬 Agradecimento: {r.gratitudeMessage}
                  </p>
                )}
              </div>
            </div>

            {r.status !== "FECHADA" && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleStatusUpdate(r.id, "EM_NEGOCIACAO")}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Em negociação
                </button>
                <button
                  onClick={() => handleThankYou(r.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Fechar negócio 🎉
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {myReferrals.length === 0 && (
        <p className="text-gray-500">Nenhuma indicação ainda.</p>
      )}
    </div>
  );
}
