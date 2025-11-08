"use client";

// Componente simples para os "cards" de estatísticas
function StatCard({ title, value, icon }: { title: string, value: string, icon: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4">
      <div className="bg-blue-100 p-3 rounded-full">
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // --- DADOS MOCKADOS (Como permitido no teste) ---
  const stats = {
    activeMembers: 78,
    referralsThisMonth: 12,
    thanksThisMonth: 45,
  };
  // ------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard de Performance
        </h1>
        <p className="text-gray-600">
          Resumo de desempenho do grupo este mês.
        </p>
      </header>

      {/* Grid com os 3 indicadores pedidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Membros Ativos"
          value={stats.activeMembers.toString()}
          icon="👥"
        />
        <StatCard
          title="Indicações no Mês"
          value={stats.referralsThisMonth.toString()}
          icon="🚀"
        />
        
        {/* AQUI ESTAVA O ERRO. 
          Corrigido de ""Obrigados"" para "'Obrigados'" 
        */}
        <StatCard
          title="Total de 'Obrigados' no Mês"
          value={stats.thanksThisMonth.toString()}
          icon="❤️"
        />
      </div>
    </div>
  );
}