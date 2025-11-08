"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params); // ✅ Desembrulha a Promise (Next 16+)
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  
  // 1. ADICIONADO: Estados para senha
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // ✅ Valida o convite
  useEffect(() => {
    async function validateInvite() {
      try {
        const res = await fetch(`/api/invite/${token}`);
        const data = await res.json();

        if (!res.ok || !data.valid) {
          setError(data.error || "Convite inválido ou expirado.");
        } else {
          setEmail(data.email); // Preenche o e-mail
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

  // ✅ Envia os dados de registro
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // 2. ADICIONADO: Validação local de senha
    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    try {
      const res = await fetch(`/api/invite/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 3. ADICIONADO: Enviando todos os dados do novo usuário
        body: JSON.stringify({ name, company, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao concluir registro.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("Erro interno ao enviar o formulário.");
    }
  }

  // 🕓 Estado de carregamento
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Validando convite...
      </div>
    );

  // ❌ Convite inválido ou erro
  if (error && !valid) // Só mostra tela de erro fatal se o convite for inválido
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

  // 🧾 Formulário
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

        {/* 4. ADICIONADO: Exibindo erros locais (ex: senhas não conferem) */}
        {error && (
            <p className="text-center text-red-600 mb-4 text-sm">{error}</p>
        )}

        <div className="space-y-4">
          <div>
            {/* 5. ALTERADO: Acessibilidade (htmlFor/id) */}
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
            {/* 6. ALTERADO: Acessibilidade (htmlFor/id) */}
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

          {/* 7. ADICIONADO: Campo Senha */}
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

          {/* 8. ADICIONADO: Campo Confirmar Senha */}
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
          disabled={!name || !password || !confirmPassword}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed mt-6"
        >
          Confirmar Cadastro
        </button>
      </form>
    </div>
  );
}