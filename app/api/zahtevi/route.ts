import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const korisnik = await getCurrentUser();
  if (!korisnik) {
    return NextResponse.json({ greska: "Nije prijavljen" }, { status: 401 });
  }

  const zahtevi = await prisma.zahtev.findMany({
    where:
      korisnik.uloga === "KLIJENT"
        ? { klijentId: korisnik.id }
        : korisnik.uloga === "MAJSTOR"
          ? { majstorId: korisnik.id }
          : {},
    include: {
      klijent: { select: { id: true, ime: true, email: true } },
      majstor: { select: { id: true, ime: true, email: true } },
      kategorija: true,
      recenzija: true,
    },
    orderBy: { kreiranAt: "desc" },
  });

  return NextResponse.json({ zahtevi });
}

export async function POST(req: NextRequest) {
  const korisnik = await getCurrentUser();
  if (!korisnik || korisnik.uloga !== "KLIJENT") {
    return NextResponse.json(
      { greska: "Samo klijenti mogu slati zahteve" },
      { status: 403 }
    );
  }

  const { majstorId, kategorijaId, opis } = await req.json();
  if (!majstorId || !kategorijaId || !opis) {
    return NextResponse.json(
      { greska: "Sva polja su obavezna" },
      { status: 400 }
    );
  }

  const zahtev = await prisma.zahtev.create({
    data: {
      klijentId: korisnik.id,
      majstorId,
      kategorijaId,
      opis,
    },
    include: {
      klijent: { select: { id: true, ime: true } },
      majstor: { select: { id: true, ime: true } },
      kategorija: true,
    },
  });

  return NextResponse.json({ zahtev }, { status: 201 });
}
