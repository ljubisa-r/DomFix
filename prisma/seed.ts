import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const kategorije = [
  "Vodoinstalaterstvo",
  "Elektrika",
  "Stolarija",
  "Molerstvo",
  "Zidarski radovi",
  "Klima uređaji",
  "Keramika i pločice",
  "Parket i podovi",
  "Krovarski radovi",
  "Zavaravanje",
  "Uređenje bašte",
  "Selidbe",
];

async function main() {
  console.log("Dodajem kategorije...");

  for (const ime of kategorije) {
    await prisma.kategorija.upsert({
      where: { ime },
      update: {},
      create: { ime },
    });
  }

  console.log("Kreiran admin nalog...");
  const adminLozinka = await bcrypt.hash("admin123", 12);
  await prisma.korisnik.upsert({
    where: { email: "admin@domfix.rs" },
    update: {},
    create: {
      email: "admin@domfix.rs",
      lozinka: adminLozinka,
      ime: "Admin DomFix",
      uloga: "ADMIN",
    },
  });

  console.log("\nSeed završen!");
  console.log("Admin pristup:");
  console.log("  Email: admin@domfix.rs");
  console.log("  Lozinka: admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
