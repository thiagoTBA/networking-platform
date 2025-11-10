// tests/prisma/memberModel.test.ts
import { prisma } from "@/lib/prisma";

describe("Prisma Member Model", () => {
  it("cria e busca um membro com sucesso", async () => {
    const member = await prisma.member.create({
      data: { name: "Teste", email: `teste${Date.now()}@mail.com`, password: "123" },
    });
    const found = await prisma.member.findUnique({ where: { id: member.id } });
    expect(found?.email).toBe(member.email);
  });
});
