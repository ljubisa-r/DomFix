import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const kategorije = await prisma.kategorija.findMany({
    orderBy: { ime: "asc" },
  });
  return NextResponse.json({ kategorije });
}
