"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const USER = "admin";
    const PASS = "1234";

    if (username === USER && password === PASS) {
      try {
        // 🔹 Cria o cookie diretamente no navegador
        document.cookie = "auth_token=true; path=/; SameSite=Lax;";

        // ✅ Redireciona pro painel admin
        router.push("/admin");
      } catch {
        setError("Erro ao criar sessão. Tente novamente.");
      }
    } else {
      setError("Usuário ou senha incorretos");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in border border-white/20">
        <h1 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
          Bem-vindo 👋
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-white font-medium block mb-1">Usuário</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-md border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-white font-medium block mb-1">Senha</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-md border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-white text-blue-700 font-semibold py-2 rounded-md hover:bg-gray-100 transition-all shadow-md"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-white/70 text-sm mt-6">
          Painel de Administração • v1.0
        </p>
      </div>
    </div>
  );
}
