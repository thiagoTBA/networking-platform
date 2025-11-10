import { prisma } from "../src/lib/prisma";

async function main() {
  const now = new Date();

  // Usa números pra evitar problemas de acentuação ("março", etc.)
  const month = now.getMonth() + 1; // 1 a 12
  const year = now.getFullYear();

  console.log(`🔄 Gerando pagamentos para ${month}/${year}...`);

  const members = await prisma.member.findMany();

  if (members.length === 0) {
    console.log("⚠️ Nenhum membro encontrado no banco.");
    return;
  }

  console.log(`👥 ${members.length} membros encontrados.`);

  for (const member of members) {
    // verifica se já existe um pagamento para o mesmo mês/ano
    const existing = await prisma.payment.findFirst({
      where: { memberId: member.id, month: month.toString(), year },
    });

    if (existing) {
      console.log(`⏭️ Pagamento já existe para ${member.name}.`);
      continue;
    }

    const payment = await prisma.payment.create({
      data: {
        memberId: member.id,
        month: month.toString(),
        year,
        amount: parseFloat(process.env.DEFAULT_PAYMENT_AMOUNT || "100"),
      },
    });

    console.log(`✅ Pagamento criado para ${member.name} (R$ ${payment.amount}).`);
  }

  console.log("🏁 Processo finalizado!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro no script:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
