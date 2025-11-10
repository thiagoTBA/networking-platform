"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "📋 Solicitações" },
    { href: "/admin/finance", label: "💰 Financeiro" },
    { href: "/admin/meetings", label: "📅 Reuniões" },
    { href: "/admin/notices", label: "📢 Avisos" },
    { href: "/admin/referrals", label: "🔗 Indicações" },
    { href: "/admin/reports", label: "📊 Relatórios" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-indigo-700 to-purple-700 text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center text-white">
          Painel Admin
        </h2>

        <nav className="flex flex-col space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                pathname === link.href
                  ? "bg-white text-indigo-700 font-semibold shadow-md"
                  : "text-gray-100 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-8 text-sm text-center text-gray-200">
          © {new Date().getFullYear()} AG Sistemas
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 md:ml-64">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );


}
//teste