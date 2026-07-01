"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Pencil } from "lucide-react";
import OcenaZvezdice from "@/components/OcenaZvezdice";
import ReferencaKarta from "@/components/ReferencaKarta";
import UrediProfilForma, { type ProfilZaEdit } from "@/components/UrediProfilForma";

interface Referenca {
  id: string;
  naslov: string;
  opis: string;
  slike: string[];
}

interface KorisnikProfil {
  id: string;
  ime: string;
  email: string;
  telefon: string | null;
  uloga: string;
  kreiranAt: string;
  majstorProfil: {
    bio: string | null;
    lokacija: string;
    prosecnaOcena: number;
    brojRecenzija: number;
    kategorije: { kategorija: { id: string; ime: string } }[];
    reference: Referenca[];
    cenaAngazmana: number | null;
    jedinicaCene: string | null;
  } | null;
}

const MAX_SLIKA = 6;

export default function ProfilStrana() {
  const [korisnik, setKorisnik] = useState<KorisnikProfil | null>(null);
  const [urediProfilOtvoren, setUrediProfilOtvoren] = useState(false);
  const [formaOtvorena, setFormaOtvorena] = useState(false);
  const [naslov, setNaslov] = useState("");
  const [opis, setOpis] = useState("");
  const [odabraneSlike, setOdabraneSlike] = useState<File[]>([]);
  const [saljeSe, setSaljeSe] = useState(false);
  const [greska, setGreska] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.korisnik) { router.push("/prijava"); return; }
        setKorisnik(d.korisnik);
      });
  }, [router]);

  const pregledi = odabraneSlike.map((f) => URL.createObjectURL(f));
  useEffect(() => {
    return () => pregledi.forEach((url) => URL.revokeObjectURL(url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [odabraneSlike]);

  function dodajSlike(nove: File[]) {
    if (nove.length === 0) return;
    setOdabraneSlike((trenutne) => [...trenutne, ...nove].slice(0, MAX_SLIKA));
  }

  function ukloniSliku(indeks: number) {
    setOdabraneSlike((trenutne) => trenutne.filter((_, i) => i !== indeks));
  }

  function zatvoriFormu() {
    setFormaOtvorena(false);
    setNaslov("");
    setOpis("");
    setOdabraneSlike([]);
    setGreska("");
  }

  async function dodajReferencu(e: FormEvent) {
    e.preventDefault();
    setGreska("");

    if (odabraneSlike.length === 0) {
      setGreska("Dodajte bar jednu sliku rada");
      return;
    }

    setSaljeSe(true);
    const formData = new FormData();
    formData.set("naslov", naslov);
    formData.set("opis", opis);
    odabraneSlike.forEach((slika) => formData.append("slike", slika));

    const res = await fetch("/api/reference", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setGreska(data.greska);
      setSaljeSe(false);
      return;
    }

    setKorisnik((k) =>
      k && k.majstorProfil
        ? { ...k, majstorProfil: { ...k.majstorProfil, reference: [data.referenca, ...k.majstorProfil.reference] } }
        : k
    );
    setSaljeSe(false);
    zatvoriFormu();
  }

  function profilSacuvan(novePodatke: ProfilZaEdit) {
    setKorisnik((k) =>
      k && k.majstorProfil
        ? { ...k, majstorProfil: { ...k.majstorProfil, ...novePodatke } }
        : k
    );
    setUrediProfilOtvoren(false);
  }

  async function obrisiReferencu(id: string) {
    setKorisnik((k) =>
      k && k.majstorProfil
        ? { ...k, majstorProfil: { ...k.majstorProfil, reference: k.majstorProfil.reference.filter((r) => r.id !== id) } }
        : k
    );
    await fetch(`/api/reference/${id}`, { method: "DELETE" });
  }

  if (!korisnik) return <div className="py-16 text-center text-gray-400">Učitava se...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Moj profil</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-5 mb-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center text-2xl font-bold">
            {korisnik.ime[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{korisnik.ime}</h2>
            <p className="text-gray-500">{korisnik.email}</p>
            <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-medium ${
              korisnik.uloga === "MAJSTOR" ? "bg-orange-100 text-orange-700" :
              korisnik.uloga === "ADMIN" ? "bg-purple-100 text-purple-700" :
              "bg-blue-100 text-blue-700"
            }`}>
              {korisnik.uloga === "MAJSTOR" ? "Majstor" : korisnik.uloga === "ADMIN" ? "Administrator" : "Klijent"}
            </span>
          </div>
        </div>

        <div className="grid gap-3 text-sm">
          {korisnik.telefon && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Telefon</span>
              <span className="font-medium text-gray-900">{korisnik.telefon}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Član od</span>
            <span className="font-medium text-gray-900">
              {new Date(korisnik.kreiranAt).toLocaleDateString("sr-Latn-RS", { year: "numeric", month: "long" })}
            </span>
          </div>
        </div>
      </div>

      {korisnik.majstorProfil && (
        <div className={`bg-white rounded-xl border p-6 ${urediProfilOtvoren ? "border-blue-200" : "border-gray-200"}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              {urediProfilOtvoren ? "Uredi profil" : "Profil majstora"}
            </h3>
            {!urediProfilOtvoren && (
              <button
                onClick={() => setUrediProfilOtvoren(true)}
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <Pencil className="size-3.5" />
                Uredi profil
              </button>
            )}
          </div>

          {urediProfilOtvoren ? (
            <UrediProfilForma
              profil={korisnik.majstorProfil}
              onSacuvano={profilSacuvan}
              onOtkazi={() => setUrediProfilOtvoren(false)}
            />
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <OcenaZvezdice ocena={Math.round(korisnik.majstorProfil.prosecnaOcena)} velicina="md" />
                <span className="font-semibold text-gray-800">
                  {korisnik.majstorProfil.prosecnaOcena.toFixed(1)}
                </span>
                <span className="text-gray-400 text-sm">
                  ({korisnik.majstorProfil.brojRecenzija} recenzija)
                </span>
              </div>

              <div className="grid gap-0 text-sm mb-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Lokacija</span>
                  <span className="font-medium text-gray-900">{korisnik.majstorProfil.lokacija}</span>
                </div>
                {korisnik.majstorProfil.cenaAngazmana != null && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Cena angažmana</span>
                    <span className="font-medium text-gray-900">
                      {korisnik.majstorProfil.cenaAngazmana.toLocaleString("sr-RS")} din
                      {korisnik.majstorProfil.jedinicaCene === "SAT" ? "/sat" : "/dan"}
                    </span>
                  </div>
                )}
              </div>

              {korisnik.majstorProfil.bio && (
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 mb-4">
                  {korisnik.majstorProfil.bio}
                </div>
              )}

              {korisnik.majstorProfil.kategorije.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Kategorije</p>
                  <div className="flex flex-wrap gap-2">
                    {korisnik.majstorProfil.kategorije.map(({ kategorija }) => (
                      <span
                        key={kategorija.id}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                      >
                        {kategorija.ime}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {korisnik.majstorProfil && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Moji radovi</h3>
            {!formaOtvorena && (
              <button
                onClick={() => setFormaOtvorena(true)}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="size-4" />
                Dodaj rad
              </button>
            )}
          </div>

          {formaOtvorena && (
            <form
              onSubmit={dodajReferencu}
              className="bg-white rounded-xl border border-gray-200 p-5 mb-4 flex flex-col gap-4"
            >
              <div>
                <label htmlFor="naslovRada" className="block text-sm font-medium text-gray-700 mb-1">
                  Naslov rada
                </label>
                <input
                  id="naslovRada"
                  required
                  value={naslov}
                  onChange={(e) => setNaslov(e.target.value)}
                  placeholder="Npr. Renoviranje kupatila u Zemunu"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="opisRada" className="block text-sm font-medium text-gray-700 mb-1">
                  Kratak opis
                </label>
                <textarea
                  id="opisRada"
                  required
                  value={opis}
                  onChange={(e) => setOpis(e.target.value)}
                  placeholder="Šta ste uradili, koliko je trajalo, šta je bio izazov..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slike rada <span className="text-gray-400 font-normal">(do {MAX_SLIKA})</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const fajlovi = Array.from(e.target.files ?? []);
                    e.target.value = "";
                    dodajSlike(fajlovi);
                  }}
                  className="hidden"
                />
                {odabraneSlike.length < MAX_SLIKA && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 rounded-lg py-4 text-sm text-gray-600 hover:text-blue-700 transition-colors"
                  >
                    Izaberite slike sa uređaja
                  </button>
                )}

                {odabraneSlike.length > 0 && (
                  <div className="grid grid-cols-3 gap-1.5 mt-3">
                    {pregledi.map((url, i) => (
                      <div key={url} className="relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Pregled ${i + 1}`}
                          className="aspect-square w-full rounded-lg object-cover border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => ukloniSliku(i)}
                          aria-label="Ukloni sliku"
                          className="absolute top-1 right-1 bg-gray-900/60 hover:bg-gray-900/80 text-white rounded-full p-1 transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {greska && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{greska}</div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={zatvoriFormu}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Otkaži
                </button>
                <button
                  type="submit"
                  disabled={saljeSe}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg font-semibold transition-colors"
                >
                  {saljeSe ? "Čuva se..." : "Sačuvaj rad"}
                </button>
              </div>
            </form>
          )}

          {korisnik.majstorProfil.reference.length === 0 ? (
            !formaOtvorena && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-500 text-sm">
                  Još uvek niste dodali nijedan rad. Klijenti pre svega gledaju vaše prethodne poslove.
                </p>
              </div>
            )
          ) : (
            <div className="flex flex-col gap-3">
              {korisnik.majstorProfil.reference.map((r) => (
                <ReferencaKarta key={r.id} referenca={r} onObrisi={obrisiReferencu} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
