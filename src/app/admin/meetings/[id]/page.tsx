"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function MeetingDetailsPage() {
  const { id } = useParams();
  const [meeting, setMeeting] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [attendances, setAttendances] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [mRes, memRes] = await Promise.all([
      fetch("/api/meetings"),
      fetch("/api/members"),
    ]);

    const meetings = await mRes.json();
    const meetingData = meetings.find((m: any) => m.id === Number(id));
    setMeeting(meetingData);

    const memberData = await memRes.json();
    setMembers(memberData);

    setAttendances(meetingData.attendances.map((a: any) => a.memberId));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const toggleAttendance = async (memberId: number) => {
    await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meetingId: Number(id), memberId }),
    });
    fetchData();
  };

  if (loading) return <p className="p-8">Carregando...</p>;
  if (!meeting) return <p className="p-8">Reunião não encontrada</p>;

  // 🎯 Cálculo da taxa de presença
  const total = members.length;
  const presentes = attendances.length;
  const porcentagem = total > 0 ? ((presentes / total) * 100).toFixed(1) : 0;

  const chartData = [
    { name: "Presentes", value: presentes },
    { name: "Ausentes", value: total - presentes },
  ];

  const COLORS = ["#10B981", "#EF4444"];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <h1 className="text-2xl font-bold mb-2">{meeting.title}</h1>
      <p className="text-gray-600 mb-2">{meeting.description || "Sem descrição"}</p>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(meeting.date).toLocaleString("pt-BR")} —{" "}
        {meeting.location || "Local indefinido"}
      </p>

      {/* Gráfico de presença */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-lg mb-2">
          🎯 Taxa de Presença: {presentes} de {total} ({porcentagem}%)
        </h2>
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v} membro(s)`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lista de presenças */}
      <h2 className="font-semibold mb-3">📋 Lista de Presenças</h2>
      <ul>
        {members.map((m) => (
          <li
            key={m.id}
            className="border p-3 mb-2 bg-white rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <span className="font-medium">{m.name}</span>
              <p className="text-sm text-gray-500">{m.email}</p>
              {m.company && (
                <p className="text-xs text-gray-400">{m.company}</p>
              )}
            </div>

            <button
              onClick={() => toggleAttendance(m.id)}
              className={`px-3 py-1 rounded text-sm transition ${
                attendances.includes(m.id)
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {attendances.includes(m.id) ? "Presente" : "Marcar Presença"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
