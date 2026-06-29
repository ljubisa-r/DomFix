import Link from "next/link";
import Navbar from "@/components/Navbar";
import OcenaZvezdice from "@/components/OcenaZvezdice";
import { prisma } from "@/lib/prisma";

const ikoneKategorija: Record<string, string> = {
  Vodoinstalaterstvo: "🔧",
  Elektrika: "⚡",
  Stolarija: "🪟",
  Molerstvo: "🎨",
  "Zidarski radovi": "🏗️",
  "Klima uređaji": "❄️",
  "Keramika i pločice": "🧱",
  "Parket i podovi": "🪵",
  "Krovarski radovi": "🏠",
  Zavaravanje: "🔥",
  "Uređenje bašte": "🌿",
  Selidbe: "📦",
};

const koraci = [
  {
    broj: "1",
    naziv: "Pronađite majstora",
    opis: "Pretražite majstore po kategoriji, lokaciji i oceni",
  },
  {
    broj: "2",
    naziv: "Pošaljite zahtev",
    opis: "Opišite šta vam treba i pošaljite zahtev majstoru",
  },
  {
    broj: "3",
    naziv: "Dogovorite se",
    opis: "Komunicirajte direktno i dogovorite sve detalje",
  },
];

export default async function PocetnaStrana() {
  const [kategorije, istaknutiMajstori, brojMajstora, brojZavrsenih, prosecnaOcena] =
    await Promise.all([
      prisma.kategorija.findMany({
        include: { _count: { select: { majstori: true } } },
        orderBy: { ime: "asc" },
      }),
      prisma.majstorProfil.findMany({
        where: { brojRecenzija: { gt: 0 } },
        include: {
          korisnik: { select: { id: true, ime: true } },
          kategorije: { include: { kategorija: true } },
        },
        orderBy: { prosecnaOcena: "desc" },
        take: 3,
      }),
      prisma.majstorProfil.count(),
      prisma.zahtev.count({ where: { status: "ZAVRSEN" } }),
      prisma.majstorProfil.aggregate({
        where: { brojRecenzija: { gt: 0 } },
        _avg: { prosecnaOcena: true },
      }),
    ]);

  const prosek = prosecnaOcena._avg.prosecnaOcena;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero sekcija */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Pronađite pouzdanog{" "}
            <span className="text-orange-400">majstora</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            DomFix vas povezuje sa proverenim majstorima u vašem gradu. Brzo,
            jednostavno i pouzdano.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projekti/novi"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
            >
              Opišite svoj posao
            </Link>
            <Link
              href="/majstori"
              className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors border border-white/40"
            >
              Pregledaj majstore
            </Link>
          </div>
        </div>
      </section>

      {/* Poverenje */}
      <section className="bg-blue-50 border-b border-blue-100 py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-700">{brojMajstora}+</p>
            <p className="text-sm text-gray-600">registrovanih majstora</p>
          </div>
          {prosek != null && (
            <div>
              <p className="text-2xl font-bold text-blue-700">{prosek.toFixed(1)}/5</p>
              <p className="text-sm text-gray-600">prosečna ocena majstora</p>
            </div>
          )}
          {brojZavrsenih > 0 && (
            <div>
              <p className="text-2xl font-bold text-blue-700">{brojZavrsenih}+</p>
              <p className="text-sm text-gray-600">završenih poslova</p>
            </div>
          )}
          <p className="text-sm text-gray-600 max-w-xs">
            Ako majstor ne odgovori ili ne dođe, pomažemo vam da pronađete drugog —
            besplatno.
          </p>
        </div>
      </section>

      {/* Kategorije */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Popularne kategorije
          </h2>
          <p className="text-gray-500 text-center mb-10">
            Pronađite stručnjaka za svaki posao
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {kategorije.map((k) => (
              <Link
                key={k.id}
                href={`/majstori?kategorija=${k.id}`}
                className="flex flex-col items-center gap-2 p-5 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all group"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">
                  {ikoneKategorija[k.ime] ?? "🛠️"}
                </span>
                <span className="text-sm font-medium text-gray-700 text-center">
                  {k.ime}
                </span>
                <span className="text-xs text-gray-400">
                  {k._count.majstori > 0
                    ? `${k._count.majstori} ${k._count.majstori === 1 ? "majstor" : "majstora"}`
                    : "Uskoro"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Kako funkcioniše */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Kako funkcioniše?
          </h2>
          <p className="text-gray-500 text-center mb-12">
            Tri jednostavna koraka do rešenja vašeg problema — posao može biti
            rešen već danas
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {koraci.map((k) => (
              <div key={k.broj} className="text-center">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {k.broj}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {k.naziv}
                </h3>
                <p className="text-gray-500">{k.opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Istaknuti majstori */}
      {istaknutiMajstori.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
              Najbolje ocenjeni majstori
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Provereni majstori sa najvišim ocenama klijenata
            </p>
            <div className="grid gap-5 md:grid-cols-3">
              {istaknutiMajstori.map((m) => (
                <Link
                  key={m.id}
                  href={`/majstori/${m.korisnik.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                      {m.korisnik.ime[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {m.korisnik.ime}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <span>📍</span> {m.lokacija}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <OcenaZvezdice ocena={Math.round(m.prosecnaOcena)} velicina="sm" />
                    <span className="text-sm font-medium text-gray-700">
                      {m.prosecnaOcena.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({m.brojRecenzija} {m.brojRecenzija === 1 ? "recenzija" : "recenzija"})
                    </span>
                  </div>
                  {m.kategorije.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.kategorije.slice(0, 3).map(({ kategorija }) => (
                        <span
                          key={kategorija.id}
                          className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                        >
                          {kategorija.ime}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4 bg-blue-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Jeste li majstor? Pridružite se!
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Registrujte se besplatno i počnite da primate zahteve od klijenata
            u vašoj oblasti.
          </p>
          <Link
            href="/registracija"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Registruj se kao majstor
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center">
        <p>© 2024 DomFix. Sva prava zadržana.</p>
      </footer>
    </div>
  );
}
