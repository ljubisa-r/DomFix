import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const korisnik = await prisma.korisnik.findUnique({
    where: { id },
    select: {
      id: true,
      ime: true,
      email: true,
      telefon: true,
      uloga: true,
      majstorProfil: {
        include: {
          kategorije: { include: { kategorija: true } },
          reference: { orderBy: { kreiranAt: "desc" } },
        },
      },
    },
  });

  if (!korisnik || !korisnik.majstorProfil) {
    return NextResponse.json(
      { greska: "Majstor nije pronađen" },
      { status: 404 }
    );
  }

  const recenzije = await prisma.recenzija.findMany({
    where: { majstorId: id },
    include: {
      klijent: { select: { ime: true } },
    },
    orderBy: { kreiranAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ majstor: korisnik, recenzije });
}
