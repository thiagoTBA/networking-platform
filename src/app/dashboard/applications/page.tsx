"use client";

import { useEffect, useState } from "react";

interface Application {
  id: number;
  name: string;
  email: string;
  status: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    setApplications([
      { id: 1, name: "João Silva", email: "joao@teste.com", status: "Aprovado" },
      { id: 2, name: "Maria Souza", email: "maria@teste.com", status: "Pendente" },
      { id: 3, name: "Carlos Lima", email: "carlos@teste.com", status: "Rejeitado" },
      { id: 4, name: "Ana Paula", email: "ana@teste.com", status: "Aprovado" },
    ]);
  }, []);

  return (
    <DashboardTable
      title="📄 Todas as Aplicações"
      data={applications}
      emptyMsg="Nenhuma aplicação encontrada."
    />
  );
}

function DashboardTable({
  title,
  data,
  emptyMsg,
}: {
  title: string;
  data: Application[];
  emptyMsg: string;
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
      {data.length === 0 ? (
        <p className="text-gray-500">{emptyMsg}</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">E-mail</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((app) => (
              <tr key={app.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{app.id}</td>
                <td className="p-3">{app.name}</td>
                <td className="p-3">{app.email}</td>
                <td
                  className={`p-3 font-semibold ${
                    app.status === "Aprovado"
                      ? "text-green-600"
                      : app.status === "Pendente"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {app.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
