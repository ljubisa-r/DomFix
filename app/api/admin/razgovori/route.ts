import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const korisnik = await getCurrentUser();
  if (!korisnik || korisnik.uloga !== "ADMIN") {
    return NextResponse.json({ greska: "Zabranjen pristup" }, { status: 403 });
  }

  const zahtevi = await prisma.zahtev.findMany({
    include: {
      klijent: { select: { id: true, ime: true, email: true } },
      majstor: { select: { id: true, ime: true, email: true } },
      kategorija: true,
      _count: { select: { poruke: true } },
    },
    orderBy: { azuriranAt: "desc" },
  });

  return NextResponse.json({ zahtevi });
}
