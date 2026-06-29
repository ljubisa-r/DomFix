import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ zahtevId: string }> }
) {
  const korisnik = await getCurrentUser();
  if (!korisnik || korisnik.uloga !== "ADMIN") {
    return NextResponse.json({ greska: "Zabranjen pristup" }, { status: 403 });
  }

  const { zahtevId } = await params;

  const zahtev = await prisma.zahtev.findUnique({
    where: { id: zahtevId },
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
      recenzija: true,
    },
  });

  if (!zahtev) {
    return NextResponse.json(
      { greska: "Zahtev nije pronađen" },
      { status: 404 }
    );
  }

  return NextResponse.json({ zahtev });
}
