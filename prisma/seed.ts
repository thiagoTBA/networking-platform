import { prisma } from "../src/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("1234", 10);

  const admin = await prisma.member.upsert({
    where: { email: "admin@painel.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@painel.com",
      password: hashedPassword,
      company: "Sistema",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin criado com sucesso:", admin.email);
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
