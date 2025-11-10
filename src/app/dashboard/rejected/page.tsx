"use client";

import { useEffect, useState } from "react";

export default function RejectedPage() {
  const [rejected, setRejected] = useState<any[]>([]);

  useEffect(() => {
    setRejected([
      { id: 1, name: "Carlos Lima", email: "carlos@teste.com" },
      { id: 2, name: "Fernanda Reis", email: "fernanda@teste.com" },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">❌ Rejeitadas</h1>
      {rejected.length === 0 ? (
        <p className="text-gray-500">Nenhuma aplicação rejeitada.</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-red-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">E-mail</th>
            </tr>
          </thead>
          <tbody>
            {rejected.map((app) => (
              <tr key={app.id} className="border-t hover:bg-red-50">
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
