import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatusBedz from "@/components/StatusBedz";

export default async function DashboardStrana() {
  const korisnik = await getCurrentUser();
  if (!korisnik) redirect("/prijava");

  const zahtevi = await prisma.zahtev.findMany({
    where:
      korisnik.uloga === "KLIJENT"
        ? { klijentId: korisnik.id }
        : korisnik.uloga === "MAJSTOR"
          ? { majstorId: korisnik.id }
          : {},
    include: {
      klijent: { select: { id: true, ime: true, email: true } },
      majstor: { select: { id: true, ime: true, email: true } },
      kategorija: true,
      recenzija: true,
    },
    orderBy: { kreiranAt: "desc" },
  });

  const statistika = {
    ukupno: zahtevi.length,
    naCekanju: zahtevi.filter((z) => z.status === "NA_CEKANJU").length,
    prihvaceni: zahtevi.filter((z) => z.status === "PRIHVACEN").length,
    zavrseni: zahtevi.filter((z) => z.status === "ZAVRSEN").length,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Dobrodošli, {korisnik.ime}!
        </h1>
        <p className="text-gray-500 mt-1">
          {korisnik.uloga === "MAJSTOR" ? "Pregled vaših zahteva od klijenata" : "Pregled vaših zahteva majstorima"}
        </p>
      </div>

      {/* Statistike */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Ukupno", vrednost: statistika.ukupno, boja: "bg-gray-50 text-gray-700" },
          { label: "Na čekanju", vrednost: statistika.naCekanju, boja: "bg-yellow-50 text-yellow-700" },
          { label: "Prihvaćeni", vrednost: statistika.prihvaceni, boja: "bg-blue-50 text-blue-700" },
          { label: "Završeni", vrednost: statistika.zavrseni, boja: "bg-green-50 text-green-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.boja} rounded-xl p-4 text-center border`}>
            <div className="text-3xl font-bold">{s.vrednost}</div>
            <div className="text-sm font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Brze akcije */}
      <div className="flex flex-wrap gap-3 mb-8">
        {korisnik.uloga === "KLIJENT" && (
          <Link
            href="/majstori"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition-colors"
          >
            Traži majstora
          </Link>
        )}
        {korisnik.uloga === "ADMIN" && (
          <Link
            href="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition-colors"
          >
            Admin panel
          </Link>
        )}
        <Link
          href="/profil"
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-3 rounded-lg font-medium transition-colors"
        >
          Moj profil
        </Link>
      </div>

      {/* Lista zahteva */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {korisnik.uloga === "MAJSTOR" ? "Primljeni zahtevi" : "Moji zahtevi"}
          </h2>
        </div>

        {zahtevi.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3" aria-hidden="true">📋</div>
            <p className="text-gray-500">Nemate nijedan zahtev</p>
            {korisnik.uloga === "KLIJENT" && (
              <Link href="/majstori" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                Potražite majstora
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {zahtevi.map((z) => (
              <Link
                key={z.id}
                href={`/zahtevi/${z.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 truncate">
                      {z.kategorija.ime}
                    </span>
                    <StatusBedz status={z.status} />
                  </div>
                  <p className="text-sm text-gray-500 truncate mb-1">{z.opis}</p>
                  <p className="text-xs text-gray-500">
                    {korisnik.uloga === "MAJSTOR" ? `Klijent: ${z.klijent.ime}` : `Majstor: ${z.majstor.ime}`}
                    {" · "}
                    {z.kreiranAt.toLocaleDateString("sr-RS")}
                  </p>
                </div>
                <div className="text-gray-500 text-sm" aria-hidden="true">→</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
