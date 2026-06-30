"use client";

import { Suspense, useState, useEffect, FormEvent } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import OcenaZvezdice from "@/components/OcenaZvezdice";
import ReferencaKarta from "@/components/ReferencaKarta";
import { ROK_OPCIJE } from "@/lib/rokovi";

interface Korisnik {
  id: string;
  ime: string;
  email: string;
  telefon: string | null;
}

interface Kategorija {
  id: string;
  ime: string;
}

interface Referenca {
  id: string;
  naslov: string;
  opis: string;
  slike: string[];
}

interface MajstorProfil {
  bio: string | null;
  lokacija: string;
  prosecnaOcena: number;
  brojRecenzija: number;
  kategorije: { kategorija: Kategorija }[];
  reference: Referenca[];
}

interface MajstorDetalji {
  id: string;
  ime: string;
  email: string;
  telefon: string | null;
  majstorProfil: MajstorProfil;
}

interface Recenzija {
  id: string;
  ocena: number;
  komentar: string | null;
  kreiranAt: string;
  klijent: { ime: string };
}

interface TrenutniKorisnik {
  id: string;
  uloga: string;
}

interface Projekat {
  id: string;
  opis: string;
  zeljeniRok: string | null;
  kategorija: Kategorija;
}

export default function MajstorProfilStrana() {
  return (
    <Suspense>
      <MajstorProfilSadrzaj />
    </Suspense>
  );
}

function MajstorProfilSadrzaj() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projekatId = searchParams.get("projekat") ?? "";
  const [majstor, setMajstor] = useState<MajstorDetalji | null>(null);
  const [recenzije, setRecenzije] = useState<Recenzija[]>([]);
  const [trenutniKorisnik, setTrenutniKorisnik] = useState<TrenutniKorisnik | null>(null);
  const [kategorije, setKategorije] = useState<Kategorija[]>([]);
  const [projekat, setProjekat] = useState<Projekat | null>(null);
  const [modalOtvoren, setModalOtvoren] = useState(false);
  const [odabranaKat, setOdabranaKat] = useState("");
  const [opis, setOpis] = useState("");
  const [zeljeniRok, setZeljeniRok] = useState("");
  const [posiljanje, setPosiljanje] = useState(false);
  const [greska, setGreska] = useState("");
  const [uspeh, setUspeh] = useState("");

  useEffect(() => {
    fetch(`/api/majstori/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setMajstor(d.majstor);
        setRecenzije(d.recenzije ?? []);
      });

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.korisnik) setTrenutniKorisnik(d.korisnik); });

    fetch("/api/kategorije")
      .then((r) => r.json())
      .then((d) => setKategorije(d.kategorije ?? []));
  }, [id]);

  useEffect(() => {
    if (!projekatId) return;
    fetch(`/api/projekti/${projekatId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.projekat) return;
        setProjekat(d.projekat);
        setOdabranaKat(d.projekat.kategorija.id);
        setOpis(d.projekat.opis);
        setZeljeniRok(d.projekat.zeljeniRok ?? "");
      });
  }, [projekatId]);

  async function posaljiZahtev(e: FormEvent) {
    e.preventDefault();
    if (!trenutniKorisnik) { router.push("/prijava"); return; }
    setGreska(""); setPosiljanje(true);

    const res = await fetch("/api/zahtevi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        majstorId: id,
        kategorijaId: odabranaKat,
        opis,
        zeljeniRok: zeljeniRok || undefined,
        projekatId: projekat?.id,
      }),
    });
    const data = await res.json();

    if (!res.ok) { setGreska(data.greska); }
    else {
      setUspeh("Zahtev je uspešno poslat!");
      setModalOtvoren(false);
      if (!projekat) { setOpis(""); setOdabranaKat(""); setZeljeniRok(""); }
    }
    setPosiljanje(false);
  }

  if (!majstor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-400">
        Učitava se...
      </div>
    );
  }

  const profil = majstor.majstorProfil;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {uspeh && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-5 py-4 rounded-xl flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold">Zahtev poslat!</p>
            <p className="text-sm">{uspeh}</p>
          </div>
        </div>
      )}

      {/* Profil kartica */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-20 h-20 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center text-3xl font-bold flex-shrink-0">
            {majstor.ime[0].toUpperCase()}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{majstor.ime}</h1>
            <p className="text-gray-500 flex items-center gap-1 mb-3">
              📍 {profil.lokacija}
            </p>

            <div className="flex items-center gap-3 mb-4">
              <OcenaZvezdice ocena={Math.round(profil.prosecnaOcena)} velicina="md" />
              <span className="font-semibold text-gray-800">
                {profil.prosecnaOcena.toFixed(1)}
              </span>
              <span className="text-gray-400 text-sm">
                ({profil.brojRecenzija} recenzija)
              </span>
            </div>

            {profil.kategorije.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {profil.kategorije.map(({ kategorija }) => (
                  <span
                    key={kategorija.id}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {kategorija.ime}
                  </span>
                ))}
              </div>
            )}

            {profil.bio && (
              <p className="text-gray-600 leading-relaxed">{profil.bio}</p>
            )}
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            {trenutniKorisnik?.uloga === "KLIJENT" && (
              <button
                onClick={() => setModalOtvoren(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap"
              >
                {projekat ? "Pošalji svoj projekat" : "Pošalji zahtev"}
              </button>
            )}
            {!trenutniKorisnik && (
              <button
                onClick={() => router.push("/prijava")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap"
              >
                Prijavite se za zahtev
              </button>
            )}
            {majstor.telefon && (
              <a
                href={`tel:${majstor.telefon}`}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-colors text-center whitespace-nowrap"
              >
                📞 {majstor.telefon}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Radovi */}
      {profil.reference.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Radovi ({profil.reference.length})
          </h2>
          <div className="flex flex-col gap-3">
            {profil.reference.map((r) => (
              <ReferencaKarta key={r.id} referenca={r} />
            ))}
          </div>
        </div>
      )}

      {/* Recenzije */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          Recenzije ({recenzije.length})
        </h2>

        {recenzije.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Još uvek nema recenzija</p>
        ) : (
          <div className="flex flex-col gap-4">
            {recenzije.map((r) => (
              <div key={r.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                    {r.klijent.ime[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{r.klijent.ime}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.kreiranAt).toLocaleDateString("sr-Latn-RS")}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <OcenaZvezdice ocena={r.ocena} velicina="sm" />
                  </div>
                </div>
                {r.komentar && <p className="text-gray-600 text-sm">{r.komentar}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal za zahtev */}
      {modalOtvoren && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Zahtev za {majstor.ime}
            </h3>
            {projekat && (
              <p className="text-sm text-gray-500 mb-5">
                Popunjeno iz vašeg projekta — možete izmeniti pre slanja.
              </p>
            )}

            <form onSubmit={posaljiZahtev} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija usluge</label>
                <select
                  required
                  value={odabranaKat}
                  onChange={(e) => setOdabranaKat(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Izaberite kategoriju</option>
                  {profil.kategorije.length > 0
                    ? profil.kategorije.map(({ kategorija }) => (
                        <option key={kategorija.id} value={kategorija.id}>
                          {kategorija.ime}
                        </option>
                      ))
                    : kategorije.map((k) => (
                        <option key={k.id} value={k.id}>{k.ime}</option>
                      ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opis problema</label>
                <textarea
                  required
                  value={opis}
                  onChange={(e) => setOpis(e.target.value)}
                  placeholder="Opišite šta vam je potrebno..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Željeni rok realizacije <span className="text-gray-400 font-normal">(opciono)</span>
                </label>
                <select
                  value={zeljeniRok}
                  onChange={(e) => setZeljeniRok(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Nije bitno, izaberite ako znate</option>
                  {ROK_OPCIJE.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {greska && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{greska}</div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOtvoren(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Otkaži
                </button>
                <button
                  type="submit"
                  disabled={posiljanje}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg font-semibold transition-colors"
                >
                  {posiljanje ? "Šalje se..." : "Pošalji"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
