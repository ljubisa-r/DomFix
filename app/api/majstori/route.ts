import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kategorija = searchParams.get("kategorija");
  const lokacija = searchParams.get("lokacija");
  const pretraga = searchParams.get("pretraga");

  const majstori = await prisma.majstorProfil.findMany({
    where: {
      ...(kategorija
        ? {
            kategorije: {
              some: { kategorija: { id: kategorija } },
            },
          }
        : {}),
      ...(lokacija
        ? { lokacija: { contains: lokacija, mode: "insensitive" } }
        : {}),
      ...(pretraga
        ? {
            korisnik: {
              ime: { contains: pretraga, mode: "insensitive" },
            },
          }
        : {}),
    },
    include: {
      korisnik: {
        select: { id: true, ime: true, telefon: true, email: true },
      },
      kategorije: {
        include: { kategorija: true },
      },
      reference: {
        orderBy: { kreiranAt: "desc" },
      },
    },
    orderBy: { prosecnaOcena: "desc" },
  });

  return NextResponse.json({ majstori });
}
