import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { potpisiToken, posaljiKolacic } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, lozinka } = await req.json();

    if (!email || !lozinka) {
      return NextResponse.json(
        { greska: "Email i lozinka su obavezni" },
        { status: 400 }
      );
    }

    const korisnik = await prisma.korisnik.findUnique({ where: { email } });
    if (!korisnik) {
      return NextResponse.json(
        { greska: "Pogrešan email ili lozinka" },
        { status: 401 }
      );
    }

    const ispravnaLozinka = await bcrypt.compare(lozinka, korisnik.lozinka);
    if (!ispravnaLozinka) {
      return NextResponse.json(
        { greska: "Pogrešan email ili lozinka" },
        { status: 401 }
      );
    }

    const token = await potpisiToken({
      id: korisnik.id,
      email: korisnik.email,
      uloga: korisnik.uloga,
      ime: korisnik.ime,
    });

    const res = NextResponse.json({
      korisnik: {
        id: korisnik.id,
        email: korisnik.email,
        ime: korisnik.ime,
        uloga: korisnik.uloga,
      },
    });

    res.cookies.set(posaljiKolacic(token));
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ greska: "Greška servera" }, { status: 500 });
  }
}
