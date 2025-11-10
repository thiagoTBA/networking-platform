import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_seguro";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader
    ?.split("; ")
    .find((c) => c.startsWith("auth_token="))
    ?.split("=")[1];

  if (!token)
    return NextResponse.json({ error: "Token não encontrado" }, { status: 401 });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const member = await prisma.member.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        role: true,
      },
    });

    if (!member)
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

    return NextResponse.json(member);
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
