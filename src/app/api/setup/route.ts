import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// POST → cria o primeiro admin
export async function POST(req: Request) {
  try {
    const { name, email, password, company } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, e-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // Verifica se já existe um admin
    const existingAdmin = await prisma.member.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Já existe um ADMIN cadastrado." },
        { status: 403 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.member.create({
      data: {
        name,
        email,
        company,
        password: hashed,
        role: "ADMIN",
      },
    });

    return NextResponse.json({ success: true, admin: newAdmin });
  } catch (err: any) {
    console.error("Erro no setup:", err);
    return NextResponse.json({ error: "Erro interno no setup" }, { status: 500 });
  }
}
