"use client";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";

export default function ReportsPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    const res = await fetch(`/api/reports?month=${month}&year=${year}`);
    const data = await res.json();
    setReport(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, [month, year]);

  const COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444"];

  // 🧾 Gera PDF com layout corporativo
  const exportPDF = () => {
    if (!report) return;

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    // 🖋️ Cabeçalho
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, pageWidth, 25, "F");
    doc.setFontSize(18);
    doc.setTextColor(33, 37, 41);
    doc.text("📊 Relatório Mensal - Plataforma Networking", 10, 16);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString("pt-BR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${formattedDate}`, pageWidth - 70, 22);

    // 🧱 Linha divisória
    doc.setDrawColor(180, 180, 180);
    doc.line(10, 28, pageWidth - 10, 28);

    let y = 40;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // 📅 Reuniões
    doc.setFont("helvetica", "bold");
    doc.text("📅 Reuniões", 10, y);
    doc.setFont("helvetica", "normal");
    y += 7;
    doc.text(`Total: ${report.meetings.totalMeetings}`, 10, y);
    y += 6;
    doc.text(`Média de presenças: ${report.meetings.avgAttendance}`, 10, y);
    y += 10;

    // 🚀 Indicações
    doc.setFont("helvetica", "bold");
    doc.text("🚀 Indicações", 10, y);
    doc.setFont("helvetica", "normal");
    y += 7;
    doc.text(`Total: ${report.referrals.total}`, 10, y);
    y += 6;
    doc.text(`Enviadas: ${report.referrals.enviadas}`, 10, y);
    y += 6;
    doc.text(`Em negociação: ${report.referrals.negociando}`, 10, y);
    y += 6;
    doc.text(`Fechadas: ${report.referrals.fechadas}`, 10, y);
    y += 10;

    // 💰 Pagamentos
    doc.setFont("helvetica", "bold");
    doc.text("💰 Pagamentos", 10, y);
    doc.setFont("helvetica", "normal");
    y += 7;
    doc.text(`Total: ${report.payments.total}`, 10, y);
    y += 6;
    doc.text(`Pagos: ${report.payments.pagos}`, 10, y);
    y += 6;
    doc.text(`Pendentes: ${report.payments.pendentes}`, 10, y);
    y += 6;
    doc.text(`Vencidos: ${report.payments.vencidos}`, 10, y);
    y += 10;

    // 📆 Período
    doc.setFont("helvetica", "bold");
    doc.text("Período do relatório:", 10, y);
    doc.setFont("helvetica", "normal");
    y += 7;
    doc.text(`${month}/${year}`, 10, y);
    y += 20;

    // 🖋️ Rodapé
    doc.setDrawColor(200, 200, 200);
    doc.line(10, 275, pageWidth - 10, 275);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(
      "Gerado automaticamente pela Plataforma Networking © 2025",
      pageWidth / 2,
      282,
      { align: "center" }
    );

    doc.save(`relatorio_${month}_${year}.pdf`);
  };

  // 📊 Gera CSV
  const exportCSV = () => {
    if (!report) return;

    const headers = [
      "Categoria,Total,Detalhe 1,Detalhe 2,Detalhe 3",
      `Reuniões,${report.meetings.totalMeetings},Média Presenças,${report.meetings.avgAttendance},`,
      `Indicações,${report.referrals.total},Enviadas ${report.referrals.enviadas},Em Negociação ${report.referrals.negociando},Fechadas ${report.referrals.fechadas}`,
      `Pagamentos,${report.payments.total},Pagos ${report.payments.pagos},Pendentes ${report.payments.pendentes},Vencidos ${report.payments.vencidos}`,
    ];

    const csv = headers.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `relatorio_${month}_${year}.csv`);
  };

  if (loading || !report) return <p className="p-8">Carregando...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 Relatórios Mensais</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("pt-BR", { month: "long" })}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border p-2 rounded w-24"
        />

        <button
          onClick={fetchReport}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Atualizar
        </button>

        <button
          onClick={exportPDF}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          📄 Baixar PDF
        </button>

        <button
          onClick={exportCSV}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          📊 Baixar CSV
        </button>
      </div>

      {/* Reuniões */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="font-semibold text-lg mb-2">📅 Reuniões</h2>
        <p>Total: {report.meetings.totalMeetings}</p>
        <p>Média de presenças: {report.meetings.avgAttendance}</p>
      </div>

      {/* Indicações */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="font-semibold text-lg mb-2">🚀 Indicações</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={[
                  { name: "Enviadas", value: report.referrals.enviadas },
                  { name: "Em Negociação", value: report.referrals.negociando },
                  { name: "Fechadas", value: report.referrals.fechadas },
                ]}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {COLORS.map((color, i) => (
                  <Cell key={i} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pagamentos */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="font-semibold text-lg mb-2">💰 Pagamentos</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={[
                  { name: "Pagos", value: report.payments.pagos },
                  { name: "Pendentes", value: report.payments.pendentes },
                  { name: "Vencidos", value: report.payments.vencidos },
                ]}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {COLORS.map((color, i) => (
                  <Cell key={i} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
