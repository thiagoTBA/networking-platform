import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Inserindo membros de teste...");

  const membersData = [
    {
      name: "João Silva",
      email: "joao@email.com",
      company: "ACME LTDA",
      password: "123456",
      role: "USER",
    },
    {
      name: "Maria Oliveira",
      email: "maria@email.com",
      company: "InovaTech",
      password: "123456",
      role: "USER",
    },
    {
      name: "Carlos Souza",
      email: "carlos@email.com",
      company: "Next Solutions",
      password: "123456",
      role: "USER",
    },
  ];

  for (const data of membersData) {
    const exists = await prisma.member.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      console.log(`⏭️ Membro ${data.email} já existe.`);
      continue;
    }

    await prisma.member.create({ data });
    console.log(`✅ Membro ${data.name} criado com sucesso.`);
  }

  console.log("🏁 Finalizado.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
