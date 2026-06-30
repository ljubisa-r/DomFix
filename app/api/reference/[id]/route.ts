import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { supabaseAdmin, SLIKE_BUCKET } from "@/lib/supabase";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const korisnik = await getCurrentUser();
  if (!korisnik) {
    return NextResponse.json({ greska: "Nije prijavljen" }, { status: 401 });
  }

  const { id } = await params;
  const referenca = await prisma.referenca.findUnique({
    where: { id },
    include: { majstorProfil: true },
  });

  if (!referenca) {
    return NextResponse.json({ greska: "Rad nije pronađen" }, { status: 404 });
  }
  if (referenca.majstorProfil.korisnikId !== korisnik.id) {
    return NextResponse.json({ greska: "Zabranjen pristup" }, { status: 403 });
  }

  const oznaka = `/storage/v1/object/public/${SLIKE_BUCKET}/`;
  const putanje = referenca.slike
    .map((url) => {
      const i = url.indexOf(oznaka);
      return i === -1 ? null : url.slice(i + oznaka.length);
    })
    .filter((p): p is string => p !== null);

  if (putanje.length > 0) {
    await supabaseAdmin.storage.from(SLIKE_BUCKET).remove(putanje);
  }

  await prisma.referenca.delete({ where: { id } });

  return NextResponse.json({ uspeh: true });
}
