"use client";
import { useEffect, useState } from "react";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchNotices = async () => {
    const res = await fetch("/api/notices");
    const data = await res.json();
    setNotices(data);
  };

  useEffect(() => { fetchNotices(); }, []);

  const getAuthorId = () => {
    try {
      const token = document.cookie.split("; ").find(r => r.startsWith("auth_token="))?.split("=")[1];
      const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
      return payload?.id || 1; // fallback
    } catch {
      return 1;
    }
  };

  const handleCreate = async () => {
    if (!title || !content) return alert("Preencha título e conteúdo.");
    setLoading(true);
    const authorId = getAuthorId();

    await fetch("/api/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, authorId }),
    });

    setTitle("");
    setContent("");
    await fetchNotices();
    setLoading(false);
    setMessage("✅ Aviso publicado com sucesso!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente remover este aviso?")) return;
    await fetch(`/api/notices/${id}`, { method: "DELETE" });
    await fetchNotices();
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📢 Avisos e Comunicados</h1>

      <div className="mb-6 bg-gray-50 p-4 rounded shadow-sm">
        <input
          placeholder="Título do aviso"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mb-2 rounded w-full"
        />
        <textarea
          placeholder="Conteúdo do aviso"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded w-full mb-2 h-28"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Salvando..." : "Publicar Aviso"}
        </button>
        {message && <p className="text-green-600 mt-2">{message}</p>}
      </div>

      <ul>
        {notices.map((n) => (
          <li
            key={n.id}
            className="border p-3 mb-3 rounded flex justify-between items-start bg-white shadow-sm hover:shadow-md transition"
          >
            <div>
              <h2 className="font-semibold text-lg">{n.title}</h2>
              <p className="text-gray-700">{n.content}</p>
              <small className="text-gray-500">por {n.author?.name || "Admin"} — {new Date(n.createdAt).toLocaleString()}</small>
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
