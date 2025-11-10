"use client";

import { useEffect, useState } from "react";

export default function ApprovedPage() {
  const [approved, setApproved] = useState<any[]>([]);

  useEffect(() => {
    setApproved([
      { id: 1, name: "João Silva", email: "joao@teste.com" },
      { id: 2, name: "Ana Paula", email: "ana@teste.com" },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">✅ Aprovadas</h1>
      {approved.length === 0 ? (
        <p className="text-gray-500">Nenhuma aplicação aprovada ainda.</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-green-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">E-mail</th>
            </tr>
          </thead>
          <tbody>
            {approved.map((app) => (
              <tr key={app.id} className="border-t hover:bg-green-50">
                <td className="p-3">{app.id}</td>
                <td className="p-3">{app.name}</td>
                <td className="p-3">{app.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
