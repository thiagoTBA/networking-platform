"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // importante pro cookie JWT funcionar
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "E-mail ou senha incorretos");
      }

      // Atualiza cache e aplica redirecionamento dinâmico
      router.refresh();

      // Redireciona conforme o papel do usuário
      if (data.user?.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }

    } catch (err: any) {
      console.error("Erro no login:", err);
      setError(err.message || "Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
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
            <label className="text-white font-medium block mb-1">E-mail</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-md border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
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
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-blue-700 font-semibold py-2 rounded-md hover:bg-gray-100 transition-all shadow-md disabled:opacity-70"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-white/70 text-sm mt-6">
          Painel de Administração • v1.0
        </p>
      </div>
    </div>
  );
}
