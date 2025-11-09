"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Componente principal para a página de convite
export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  // Desembrulha a Promise do token da URL
  const { token } = use(params); 
  
  // Estados para dados pré-preenchidos e formulário
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  
  // Estados para senhas
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados de UI
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // ✅ Validação do convite (GET /api/invite/[token])
  useEffect(() => {
    async function validateInvite() {
      try {
        const res = await fetch(`/api/invite/${token}`);
        const data = await res.json();

        if (!res.ok || !data.valid) {
          setError(data.error || "Convite inválido ou expirado.");
        } else {
          // Pré-preenche Name e Company com dados da Application retornados pela API
          setEmail(data.email); 
          setName(data.name || ""); 
          setCompany(data.company || "");
          setValid(true);
        }
      } catch {
        setError("Erro ao validar o convite.");
      } finally {
        setLoading(false);
      }
    }

    if (token) validateInvite();
  }, [token]);

  // ✅ Envia os dados de registro (POST /api/invite/[token])
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validação local de senhas
    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }
    if (!name.trim()) {
        setError("O campo Nome Completo é obrigatório.");
        return;
    }

    try {
      const res = await fetch(`/api/invite/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Enviando Name, Company, e Password
        body: JSON.stringify({ name, company, password }), 
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao concluir registro.");
        return;
      }

      setSuccess(true);
      // Redireciona para a página de login após o sucesso
      setTimeout(() => router.push("/login"), 3000); 
    } catch {
      setError("Erro interno ao enviar o formulário.");
    }
  }

  // ------------------------------------
  // Renderização
  // ------------------------------------

  // 🕓 Estado de carregamento
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Validando convite...
      </div>
    );

  // ❌ Convite inválido ou erro fatal
  if (error && !valid)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-600 text-lg font-semibold p-6">
        <p>❌ {error}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          Voltar à página inicial
        </button>
      </div>
    );

  // ✅ Registro concluído
  if (success)
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 text-green-700 text-lg font-semibold">
        🎉 Cadastro concluído com sucesso! Redirecionando...
      </div>
    );

  // 🧾 Formulário Principal
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Concluir Cadastro
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Convite para o e-mail: <b>{email}</b>
        </p>

        {/* Exibindo erros */}
        {error && (
            <p className="text-center text-red-600 mb-4 text-sm">{error}</p>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              id="name"
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Empresa
            </label>
            <input
              id="company"
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md mt-1"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Opcional"
            />
          </div>

          {/* Campo Senha */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="w-full border border-gray-300 p-2 rounded-md mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Campo Confirmar Senha */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full border border-gray-300 p-2 rounded-md mt-1"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!name || !password || !confirmPassword || password !== confirmPassword}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed mt-6"
        >
          Confirmar Cadastro
        </button>
      </form>
    </div>
  );
}