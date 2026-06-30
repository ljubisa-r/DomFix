import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { supabaseAdmin, SLIKE_BUCKET } from "@/lib/supabase";

const MAX_SLIKA = 6;
const MAX_VELICINA = 5 * 1024 * 1024;
const DOZVOLJENI_TIPOVI = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  const korisnik = await getCurrentUser();
  if (!korisnik || korisnik.uloga !== "MAJSTOR") {
    return NextResponse.json(
      { greska: "Samo majstori mogu dodati radove" },
      { status: 403 }
    );
  }

  const majstorProfil = await prisma.majstorProfil.findUnique({
    where: { korisnikId: korisnik.id },
  });
  if (!majstorProfil) {
    return NextResponse.json(
      { greska: "Profil majstora nije pronađen" },
      { status: 404 }
    );
  }

  const formData = await req.formData();
  const naslov = ((formData.get("naslov") as string) ?? "").trim();
  const opis = ((formData.get("opis") as string) ?? "").trim();
  const slike = formData.getAll("slike").filter((s): s is File => s instanceof File);

  if (!naslov || !opis) {
    return NextResponse.json(
      { greska: "Naslov i opis su obavezni" },
      { status: 400 }
    );
  }
  if (slike.length === 0) {
    return NextResponse.json(
      { greska: "Dodajte bar jednu sliku rada" },
      { status: 400 }
    );
  }
  if (slike.length > MAX_SLIKA) {
    return NextResponse.json(
      { greska: `Najviše ${MAX_SLIKA} slika po radu` },
      { status: 400 }
    );
  }
  for (const slika of slike) {
    if (!DOZVOLJENI_TIPOVI.includes(slika.type)) {
      return NextResponse.json(
        { greska: "Dozvoljene su samo JPG, PNG i WEBP slike" },
        { status: 400 }
      );
    }
    if (slika.size > MAX_VELICINA) {
      return NextResponse.json(
        { greska: "Svaka slika mora biti manja od 5MB" },
        { status: 400 }
      );
    }
  }

  const urlovi: string[] = [];
  for (const slika of slike) {
    const ekstenzija = slika.name.split(".").pop() || "jpg";
    const putanja = `reference/${korisnik.id}/${crypto.randomUUID()}.${ekstenzija}`;
    const bafer = Buffer.from(await slika.arrayBuffer());

    const { error } = await supabaseAdmin.storage
      .from(SLIKE_BUCKET)
      .upload(putanja, bafer, { contentType: slika.type });

    if (error) {
      return NextResponse.json(
        { greska: "Greška pri otpremanju slike" },
        { status: 500 }
      );
    }

    const { data } = supabaseAdmin.storage.from(SLIKE_BUCKET).getPublicUrl(putanja);
    urlovi.push(data.publicUrl);
  }

  const referenca = await prisma.referenca.create({
    data: {
      majstorProfilId: majstorProfil.id,
      naslov,
      opis,
      slike: urlovi,
    },
  });

  return NextResponse.json({ referenca }, { status: 201 });
}
