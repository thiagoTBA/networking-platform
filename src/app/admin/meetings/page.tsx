"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchMeetings = async () => {
    const res = await fetch("/api/meetings");
    const data = await res.json();
    setMeetings(data);
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCreate = async () => {
    if (!title || !date) return alert("Título e data são obrigatórios.");
    setLoading(true);
    await fetch("/api/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, date, location }),
    });
    setTitle("");
    setDescription("");
    setDate("");
    setLocation("");
    await fetchMeetings();
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta reunião?")) return;
    await fetch(`/api/meetings/${id}`, { method: "DELETE" });
    await fetchMeetings();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📅 Gerenciamento de Reuniões</h1>

      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="font-semibold mb-2">Criar Nova Reunião</h2>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mb-2 rounded w-full"
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 mb-2 rounded w-full"
        />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 mb-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Local"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 mb-2 rounded w-full"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Salvando..." : "Criar Reunião"}
        </button>
      </div>

      <h2 className="font-semibold mb-3">Reuniões Cadastradas</h2>
      <ul>
        {meetings.map((m) => (
          <li
            key={m.id}
            className="border p-4 mb-3 bg-white rounded shadow-sm flex justify-between items-start"
          >
            <div>
              <p className="font-medium text-lg">{m.title}</p>
              <p className="text-sm text-gray-500">
                {new Date(m.date).toLocaleString("pt-BR")}
              </p>
              <p className="text-sm text-gray-600">
                {m.location || "Sem local definido"}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/admin/meetings/${m.id}`)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Ver Presenças
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}

        {meetings.length === 0 && (
          <p className="text-gray-500 mt-4">Nenhuma reunião cadastrada ainda.</p>
        )}
      </ul>
    </div>
  );
}
