import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const korisnik = await getCurrentUser();
  if (!korisnik) {
    return NextResponse.json({ greska: "Nije prijavljen" }, { status: 401 });
  }

  const { id } = await params;
  const { sadrzaj } = await req.json();

  if (!sadrzaj?.trim()) {
    return NextResponse.json(
      { greska: "Poruka ne može biti prazna" },
      { status: 400 }
    );
  }

  const zahtev = await prisma.zahtev.findUnique({ where: { id } });
  if (!zahtev) {
    return NextResponse.json(
      { greska: "Zahtev nije pronađen" },
      { status: 404 }
    );
  }

  const mozePisati =
    korisnik.uloga === "ADMIN" ||
    zahtev.klijentId === korisnik.id ||
    zahtev.majstorId === korisnik.id;

  if (!mozePisati) {
    return NextResponse.json({ greska: "Zabranjen pristup" }, { status: 403 });
  }

  const poruka = await prisma.poruka.create({
    data: {
      zahtevId: id,
      posiljaoId: korisnik.id,
      sadrzaj: sadrzaj.trim(),
    },
    include: {
      posiljalac: { select: { id: true, ime: true, uloga: true } },
    },
  });

  return NextResponse.json({ poruka }, { status: 201 });
}
