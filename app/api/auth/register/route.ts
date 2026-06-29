import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { potpisiToken, posaljiKolacic } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, lozinka, ime, telefon, uloga, lokacija, bio, kategorije } =
      await req.json();

    if (!email || !lozinka || !ime || !uloga) {
      return NextResponse.json(
        { greska: "Sva obavezna polja moraju biti popunjena" },
        { status: 400 }
      );
    }

    const postojeci = await prisma.korisnik.findUnique({ where: { email } });
    if (postojeci) {
      return NextResponse.json(
        { greska: "Korisnik sa ovom email adresom već postoji" },
        { status: 400 }
      );
    }

    const hashLozinka = await bcrypt.hash(lozinka, 12);

    const korisnik = await prisma.korisnik.create({
      data: {
        email,
        lozinka: hashLozinka,
        ime,
        telefon,
        uloga,
        ...(uloga === "MAJSTOR" && lokacija
          ? {
              majstorProfil: {
                create: {
                  lokacija,
                  bio,
                  ...(kategorije?.length
                    ? {
                        kategorije: {
                          create: (kategorije as string[]).map((katId) => ({
                            kategorija: { connect: { id: katId } },
                          })),
                        },
                      }
                    : {}),
                },
              },
            }
          : {}),
      },
    });

    const token = await potpisiToken({
      id: korisnik.id,
      email: korisnik.email,
      uloga: korisnik.uloga,
      ime: korisnik.ime,
    });

    const res = NextResponse.json(
      {
        korisnik: {
          id: korisnik.id,
          email: korisnik.email,
          ime: korisnik.ime,
          uloga: korisnik.uloga,
        },
      },
      { status: 201 }
    );

    res.cookies.set(posaljiKolacic(token));
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ greska: "Greška servera" }, { status: 500 });
  }
}
