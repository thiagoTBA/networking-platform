"use client";
import { useEffect, useState } from "react";

export default function ReferralsPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [toMemberId, setToMemberId] = useState("");
  const [description, setDescription] = useState("");
  const [myReferrals, setMyReferrals] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then(setMembers);

    fetch("/api/referrals")
      .then((res) => res.json())
      .then(setMyReferrals);
  }, []);

  const handleSubmit = async () => {
    await fetch("/api/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromMemberId: 1, // ⚠️ depois a gente troca pra pegar do token JWT
        toMemberId: parseInt(toMemberId),
        description,
      }),
    });
    setDescription("");
    setToMemberId("");
    const res = await fetch("/api/referrals");
    setMyReferrals(await res.json());
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Enviar Indicação</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {/* Select com tema claro/escuro */}
        <select
          value={toMemberId}
          onChange={(e) => setToMemberId(e.target.value)}
          className="border p-2 rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 transition-colors"
        >
          <option value="">Selecione um membro</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.email})
            </option>
          ))}
        </select>

        {/* Campo de descrição */}
        <input
          type="text"
          value={description}
          placeholder="Descrição"
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-96 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 transition-colors"
        />

        {/* Botão */}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Enviar
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Minhas Indicações</h2>
      <ul>
        {myReferrals.map((r) => (
          <li
            key={r.id}
            className="border p-3 mb-2 rounded bg-gray-50 dark:bg-gray-900 transition-colors"
          >
            Para: <b>{r.toMember.name}</b> — {r.status}
            <p className="text-sm text-gray-600 dark:text-gray-300">{r.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
