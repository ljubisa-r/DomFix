import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const korisnik = await getCurrentUser();
  if (!korisnik) {
    return NextResponse.json({ greska: "Nije prijavljen" }, { status: 401 });
  }

  const { id } = await params;
  const projekat = await prisma.projekat.findUnique({
    where: { id },
    include: { kategorija: true },
  });

  if (!projekat || projekat.klijentId !== korisnik.id) {
    return NextResponse.json({ greska: "Projekat nije pronađen" }, { status: 404 });
  }

  return NextResponse.json({ projekat });
}
