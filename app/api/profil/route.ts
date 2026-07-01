import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  const korisnik = await getCurrentUser();
  if (!korisnik) {
    return NextResponse.json({ greska: "Nije prijavljen" }, { status: 401 });
  }

  if (korisnik.uloga !== "MAJSTOR") {
    return NextResponse.json({ greska: "Niste majstor" }, { status: 403 });
  }

  const { bio, lokacija, kategorijeIds, cenaAngazmana, jedinicaCene } =
    await req.json();

  if (!lokacija?.trim()) {
    return NextResponse.json({ greska: "Lokacija je obavezna" }, { status: 400 });
  }

  const profil = await prisma.majstorProfil.findUnique({
    where: { korisnikId: korisnik.id },
  });

  if (!profil) {
    return NextResponse.json({ greska: "Profil nije pronađen" }, { status: 404 });
  }

  const ids: string[] = Array.isArray(kategorijeIds) ? kategorijeIds : [];

  const cenaBroj =
    typeof cenaAngazmana === "number" && cenaAngazmana > 0
      ? cenaAngazmana
      : null;

  try {
    await prisma.majstorKategorija.deleteMany({
      where: { majstorProfilId: profil.id },
    });

    if (ids.length > 0) {
      await prisma.majstorKategorija.createMany({
        data: ids.map((id) => ({
          majstorProfilId: profil.id,
          kategorijaId: id,
        })),
      });
    }

    await prisma.majstorProfil.update({
      where: { id: profil.id },
      data: {
        bio: bio?.trim() || null,
        lokacija: lokacija.trim(),
        cenaAngazmana: cenaBroj,
        jedinicaCene: cenaBroj ? (jedinicaCene ?? "SAT") : null,
      },
    });
  } catch (err) {
    console.error("[PUT /api/profil]", err);
    return NextResponse.json(
      { greska: err instanceof Error ? err.message : "Nepoznata greška" },
      { status: 500 }
    );
  }

  return NextResponse.json({ uspeh: true });
}
