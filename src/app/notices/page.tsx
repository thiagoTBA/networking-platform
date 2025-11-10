"use client";
import { useEffect, useState } from "react";

// 🧩 1️⃣ Cria a interface com os campos que vêm do Prisma
interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author?: {
    name?: string;
  };
}

export default function NoticesPage() {
  // 🧩 2️⃣ Tipagem explícita do estado
  const [notices, setNotices] = useState<Notice[]>([]);

  // 🧩 3️⃣ Busca + ordenação segura com tipagem
  useEffect(() => {
    fetch("/api/notices")
      .then((res) => res.json())
      .then((data: Notice[]) =>
        setNotices(
          data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
        )
      );
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📢 Comunicados Recentes</h1>

      <ul>
        {notices.map((n) => (
          <li
            key={n.id}
            className="bg-white border rounded p-4 mb-3 shadow hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg mb-1">{n.title}</h2>
            <p className="text-gray-700 mb-1">{n.content}</p>
            <small className="text-gray-500">
              Publicado em{" "}
              {new Date(n.createdAt).toLocaleDateString("pt-BR")}
            </small>
          </li>
        ))}
      </ul>

      {notices.length === 0 && (
        <p className="text-gray-500">Nenhum comunicado disponível.</p>
      )}
    </div>
  );
}
