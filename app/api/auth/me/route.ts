import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const korisnik = await getCurrentUser();
  if (!korisnik) {
    return NextResponse.json({ greska: "Nije prijavljen" }, { status: 401 });
  }

  const detalji = await prisma.korisnik.findUnique({
    where: { id: korisnik.id },
    select: {
      id: true,
      email: true,
      ime: true,
      telefon: true,
      uloga: true,
      kreiranAt: true,
      majstorProfil: {
        include: {
          kategorije: { include: { kategorija: true } },
        },
      },
    },
  });

  return NextResponse.json({ korisnik: detalji });
}
