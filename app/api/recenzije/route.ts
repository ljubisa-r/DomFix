import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const korisnik = await getCurrentUser();
  if (!korisnik || korisnik.uloga !== "KLIJENT") {
    return NextResponse.json(
      { greska: "Samo klijenti mogu ostaviti recenziju" },
      { status: 403 }
    );
  }

  const { zahtevId, ocena, komentar } = await req.json();

  if (!zahtevId || !ocena || ocena < 1 || ocena > 5) {
    return NextResponse.json(
      { greska: "Zahtev i ocena (1-5) su obavezni" },
      { status: 400 }
    );
  }

  const zahtev = await prisma.zahtev.findUnique({
    where: { id: zahtevId },
    include: { recenzija: true },
  });

  if (!zahtev || zahtev.klijentId !== korisnik.id) {
    return NextResponse.json(
      { greska: "Zahtev nije pronađen ili nemate pristup" },
      { status: 404 }
    );
  }

  if (zahtev.status !== "ZAVRSEN") {
    return NextResponse.json(
      { greska: "Možete ostaviti recenziju samo za završene zahteve" },
      { status: 400 }
    );
  }

  if (zahtev.recenzija) {
    return NextResponse.json(
      { greska: "Već ste ostavili recenziju za ovaj zahtev" },
      { status: 400 }
    );
  }

  const recenzija = await prisma.$transaction(async (tx) => {
    const novaRecenzija = await tx.recenzija.create({
      data: {
        klijentId: korisnik.id,
        majstorId: zahtev.majstorId,
        zahtevId,
        ocena,
        komentar,
      },
    });

    const prosek = await tx.recenzija.aggregate({
      where: { majstorId: zahtev.majstorId },
      _avg: { ocena: true },
      _count: true,
    });

    await tx.majstorProfil.update({
      where: { korisnikId: zahtev.majstorId },
      data: {
        prosecnaOcena: prosek._avg.ocena ?? 0,
        brojRecenzija: prosek._count,
      },
    });

    return novaRecenzija;
  });

  return NextResponse.json({ recenzija }, { status: 201 });
}
