import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const korisnik = await getCurrentUser();
  if (!korisnik) {
    return NextResponse.json({ greska: "Nije prijavljen" }, { status: 401 });
  }

  const projekti = await prisma.projekat.findMany({
    where: { klijentId: korisnik.id },
    include: {
      kategorija: true,
      zahtevi: { select: { id: true, status: true } },
    },
    orderBy: { kreiranAt: "desc" },
  });

  return NextResponse.json({ projekti });
}

export async function POST(req: NextRequest) {
  const korisnik = await getCurrentUser();
  if (!korisnik || korisnik.uloga !== "KLIJENT") {
    return NextResponse.json(
      { greska: "Samo klijenti mogu kreirati projekte" },
      { status: 403 }
    );
  }

  const { kategorijaId, opis, lokacija, zeljeniRok } = await req.json();
  if (!kategorijaId || !opis) {
    return NextResponse.json(
      { greska: "Kategorija i opis su obavezni" },
      { status: 400 }
    );
  }

  const projekat = await prisma.projekat.create({
    data: {
      klijentId: korisnik.id,
      kategorijaId,
      opis,
      lokacija: lokacija || null,
      zeljeniRok: zeljeniRok || null,
    },
    include: { kategorija: true },
  });

  return NextResponse.json({ projekat }, { status: 201 });
}
