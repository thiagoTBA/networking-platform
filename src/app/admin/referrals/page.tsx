"use client";
import { useEffect, useState } from "react";

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReferrals = async () => {
    const res = await fetch("/api/referrals");
    const data = await res.json();
    setReferrals(data);
    setLoading(false);
  };

  useEffect(() => { fetchReferrals(); }, []);

  const handleStatusChange = async (id: number, status: string) => {
    await fetch(`/api/referrals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchReferrals();
  };

  if (loading) return <p className="p-8">Carregando...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🤝 Indicações de Negócios</h1>
      <ul>
        {referrals.map((r) => (
          <li
            key={r.id}
            className="border p-4 mb-3 rounded flex justify-between items-center"
          >
            <div>
              <p><b>De:</b> {r.fromMember.name}</p>
              <p><b>Para:</b> {r.toMember.name}</p>
              <p><b>Descrição:</b> {r.description}</p>
              <p><b>Status:</b> {r.status}</p>
            </div>
            <div>
              {r.status !== "approved" && (
                <button
                  onClick={() => handleStatusChange(r.id, "approved")}
                  className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                >
                  Aprovar
                </button>
              )}
              {r.status !== "rejected" && (
                <button
                  onClick={() => handleStatusChange(r.id, "rejected")}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Rejeitar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
