import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function GET() {
  const invitations = await prisma.invitation.findMany();
  return NextResponse.json(invitations);
}

export async function POST(req: Request) {
  const { email } = await req.json();
  const token = randomUUID();
  const invitation = await prisma.invitation.create({
    data: { email, token },
  });
  return NextResponse.json(invitation, { status: 201 });
}
