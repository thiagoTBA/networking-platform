"use client";
import { useEffect, useState } from "react";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    const res = await fetch("/api/applications");
    const data = await res.json();
    setApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatus = async (id: number, status: string) => {
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchApplications();
  };

  if (loading) return <p className="p-8">Carregando...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🧾 Intenções de Participação</h1>
      <ul>
        {applications.map((a) => (
          <li
            key={a.id}
            className="border p-4 mb-3 rounded bg-gray-50 dark:bg-gray-900 flex justify-between items-start"
          >
            <div>
              <p><b>Nome:</b> {a.name}</p>
              <p><b>Email:</b> {a.email}</p>
              <p><b>Empresa:</b> {a.company || "—"}</p>
              <p><b>Motivo:</b> {a.reason}</p>
              <p><b>Status:</b> 
                <span
                  className={`ml-1 px-2 py-1 text-sm rounded ${
                    a.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : a.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {a.status}
                </span>
              </p>
            </div>
            {a.status === "PENDING" && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleStatus(a.id, "APPROVED")}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Aprovar
                </button>
                <button
                  onClick={() => handleStatus(a.id, "REJECTED")}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Recusar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
