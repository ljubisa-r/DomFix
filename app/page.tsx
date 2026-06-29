import Link from "next/link";
import Navbar from "@/components/Navbar";

const usluge = [
  { ikona: "🔧", naziv: "Vodoinstalateri" },
  { ikona: "⚡", naziv: "Elektriničari" },
  { ikona: "🪟", naziv: "Stolarija" },
  { ikona: "🎨", naziv: "Molerstvo" },
  { ikona: "🏗️", naziv: "Zidarski radovi" },
  { ikona: "❄️", naziv: "Klima uređaji" },
];

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

export default function PocetnaStrana() {
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
              href="/majstori"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
            >
              Traži majstora
            </Link>
            <Link
              href="/registracija"
              className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors border border-white/40"
            >
              Postani majstor
            </Link>
          </div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {usluge.map((u) => (
              <Link
                key={u.naziv}
                href={`/majstori?pretraga=${encodeURIComponent(u.naziv)}`}
                className="flex flex-col items-center gap-3 p-5 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all group"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">
                  {u.ikona}
                </span>
                <span className="text-sm font-medium text-gray-700 text-center">
                  {u.naziv}
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
            Tri jednostavna koraka do rešenja vašeg problema
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
