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

  const zahtev = await prisma.zahtev.findUnique({
    where: { id },
    include: {
      klijent: { select: { id: true, ime: true, email: true, telefon: true } },
      majstor: { select: { id: true, ime: true, email: true, telefon: true } },
      kategorija: true,
      poruke: {
        include: {
          posiljalac: { select: { id: true, ime: true, uloga: true } },
        },
        orderBy: { kreiranAt: "asc" },
      },
      recenzija: {
        include: { klijent: { select: { ime: true } } },
      },
    },
  });

  if (!zahtev) {
    return NextResponse.json(
      { greska: "Zahtev nije pronađen" },
      { status: 404 }
    );
  }

  const mozePristupiti =
    korisnik.uloga === "ADMIN" ||
    zahtev.klijentId === korisnik.id ||
    zahtev.majstorId === korisnik.id;

  if (!mozePristupiti) {
    return NextResponse.json({ greska: "Zabranjen pristup" }, { status: 403 });
  }

  return NextResponse.json({ zahtev });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const korisnik = await getCurrentUser();
  if (!korisnik) {
    return NextResponse.json({ greska: "Nije prijavljen" }, { status: 401 });
  }

  const { id } = await params;
  const { status, terminDolaska } = await req.json();

  const zahtev = await prisma.zahtev.findUnique({ where: { id } });
  if (!zahtev) {
    return NextResponse.json(
      { greska: "Zahtev nije pronađen" },
      { status: 404 }
    );
  }

  if (korisnik.uloga === "MAJSTOR" && zahtev.majstorId !== korisnik.id) {
    return NextResponse.json({ greska: "Zabranjen pristup" }, { status: 403 });
  }
  if (korisnik.uloga === "KLIJENT" && zahtev.klijentId !== korisnik.id) {
    return NextResponse.json({ greska: "Zabranjen pristup" }, { status: 403 });
  }

  const azuriran = await prisma.zahtev.update({
    where: { id },
    data: {
      status,
      ...(terminDolaska ? { terminDolaska: new Date(terminDolaska) } : {}),
    },
  });

  return NextResponse.json({ zahtev: azuriran });
}
