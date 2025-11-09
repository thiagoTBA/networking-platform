"use client";

import { useEffect, useState } from "react";

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/notices")
      .then((res) => res.json())
      .then(setNotices);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📢 Comunicados</h1>
      <ul>
        {notices.map((n) => (
          <li key={n.id} className="border p-3 mb-2 rounded">
            <h2 className="font-semibold">{n.title}</h2>
            <p>{n.content}</p>
            <small className="text-gray-500">
              Publicado em {new Date(n.createdAt).toLocaleDateString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
