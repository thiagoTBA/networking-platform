"use client";

import { useEffect, useState } from "react";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNotices = async () => {
    const res = await fetch("/api/notices");
    const data = await res.json();
    setNotices(data);
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleCreate = async () => {
    setLoading(true);
    await fetch("/api/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, authorId: 1 }), // ⚠️ usa o ID do admin logado
    });
    setTitle("");
    setContent("");
    await fetchNotices();
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/notices/${id}`, { method: "DELETE" });
    await fetchNotices();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📢 Avisos e Comunicados</h1>

      <div className="mb-6">
        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mr-2 rounded w-64"
        />
        <input
          placeholder="Conteúdo"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 mr-2 rounded w-96"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Salvando..." : "Publicar"}
        </button>
      </div>

      <ul>
        {notices.map((n) => (
          <li key={n.id} className="border p-3 mb-2 rounded flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{n.title}</h2>
              <p>{n.content}</p>
              <small className="text-gray-500">por {n.author?.name}</small>
            </div>
            <button
              onClick={() => handleDelete(n.id)}
              className="text-red-600 hover:underline"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
