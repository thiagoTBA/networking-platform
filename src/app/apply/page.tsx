"use client";

import { useState } from "react";

export default function ApplyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  // 1. ADICIONADO: Estado para o novo campo "reason"
  const [reason, setReason] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 2. ADICIONADO: "reason" no corpo da requisição
        body: JSON.stringify({ name, email, company, reason }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("Solicitação enviada com sucesso!");
        setName("");
        setEmail("");
        setCompany("");
        // 3. ADICIONADO: Limpar o estado do "reason"
        setReason("");
      } else {
        const data = await res.json();
        setStatus("error");
        setMessage(data.error || "Erro ao enviar a solicitação.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Solicitar Acesso à Plataforma
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {/* 4. ALTERADO: Adicionado htmlFor="name" */}
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome
            </label>
            <input
              type="text"
              // 5. ALTERADO: Adicionado id="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          <div>
            {/* 6. ALTERADO: Adicionado htmlFor="email" */}
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              E-mail
            </label>
            <input
              type="email"
              // 7. ALTERADO: Adicionado id="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          <div>
            {/* 8. ALTERADO: Adicionado htmlFor="company" */}
            <label 
              htmlFor="company" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Empresa
            </label>
            <input
              type="text"
              // 9. ALTERADO: Adicionado id="company"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Opcional"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          {/* 10. ADICIONADO: Novo campo <textarea> para "reason" */}
          <div>
            <label 
              htmlFor="reason" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Por que você quer participar?
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={4}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {status === "loading" ? "Enviando..." : "Enviar Solicitação"}
          </button>
        </form>

        {status !== "idle" && (
          <p
            className={`text-center mt-4 font-medium ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}