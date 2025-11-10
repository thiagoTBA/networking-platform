import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed da base de dados...");

  await prisma.payment.deleteMany();
  await prisma.member.deleteMany();

  console.log("🧹 Tabelas limpas.");

  await prisma.member.createMany({
    data: [
      { name: "Thiago Brito", email: "thiago@empresa.com", password: "123456", role: "ADMIN", company: "AG Sistemas" },
      { name: "Lucas Almeida", email: "lucas@empresa.com", password: "123456", company: "TechHub" },
      { name: "Mariana Costa", email: "mariana@empresa.com", password: "123456", company: "NextSoft" },
      { name: "Rafael Lima", email: "rafael@empresa.com", password: "123456", company: "DataWave" },
      { name: "Ana Souza", email: "ana@empresa.com", password: "123456", company: "BlueSky" },
    ],
  });

  const members = await prisma.member.findMany();

  const statuses = ["PAID", "PENDING", "OVERDUE"] as const;
  const months = ["07", "08", "09", "10", "11"];
  const year = 2025;

  const payments = members.flatMap((m) =>
    months.map((month) => ({
      memberId: m.id,
      month,
      year,
      amount: 250,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    }))
  );

  await prisma.payment.createMany({ data: payments });

  console.log(`💰 ${payments.length} pagamentos gerados com sucesso.`);
  console.log("✅ Seed finalizado!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
