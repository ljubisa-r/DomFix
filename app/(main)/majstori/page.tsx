"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import OcenaZvezdice from "@/components/OcenaZvezdice";

interface Kategorija {
  id: string;
  ime: string;
}

interface Majstor {
  id: string;
  lokacija: string;
  prosecnaOcena: number;
  brojRecenzija: number;
  bio: string | null;
  korisnik: { id: string; ime: string; email: string };
  kategorije: { kategorija: Kategorija }[];
}

interface Projekat {
  id: string;
  opis: string;
  kategorija: Kategorija;
}

export default function MajstoriStrana() {
  return (
    <Suspense>
      <MajstoriSadrzaj />
    </Suspense>
  );
}

function MajstoriSadrzaj() {
  const searchParams = useSearchParams();
  const projekatId = searchParams.get("projekat") ?? "";
  const [majstori, setMajstori] = useState<Majstor[]>([]);
  const [kategorije, setKategorije] = useState<Kategorija[]>([]);
  const [projekat, setProjekat] = useState<Projekat | null>(null);
  const [pretraga, setPretraga] = useState(searchParams.get("pretraga") ?? "");
  const [odabranaKat, setOdabranaKat] = useState(searchParams.get("kategorija") ?? "");
  const [lokacija, setLokacija] = useState(searchParams.get("lokacija") ?? "");
  const [ucitava, setUcitava] = useState(false);

  useEffect(() => {
    fetch("/api/kategorije")
      .then((r) => r.json())
      .then((d) => setKategorije(d.kategorije ?? []));
  }, []);

  useEffect(() => {
    if (!projekatId) { setProjekat(null); return; }
    fetch(`/api/projekti/${projekatId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setProjekat(d?.projekat ?? null));
  }, [projekatId]);

  const pretraziMajstore = useCallback(async () => {
    setUcitava(true);
    const params = new URLSearchParams();
    if (pretraga) params.set("pretraga", pretraga);
    if (odabranaKat) params.set("kategorija", odabranaKat);
    if (lokacija) params.set("lokacija", lokacija);

    const res = await fetch(`/api/majstori?${params.toString()}`);
    const data = await res.json();
    setMajstori(data.majstori ?? []);
    setUcitava(false);
  }, [pretraga, odabranaKat, lokacija]);

  useEffect(() => {
    pretraziMajstore();
  }, [pretraziMajstore]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pronađi majstora</h1>
      <p className="text-gray-500 mb-8">
        {majstori.length > 0 ? `${majstori.length} majstora pronađeno` : "Pretraži dostupne majstore"}
      </p>

      {projekat && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full shrink-0">
            Aktivan projekat
          </span>
          <p className="text-sm text-gray-700 line-clamp-1">{projekat.opis}</p>
          <span className="text-sm text-gray-400 sm:ml-auto shrink-0">
            Izaberite majstora kome ćete ga poslati
          </span>
        </div>
      )}

      {/* Filteri */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pretraži po imenu</label>
          <input
            type="text"
            value={pretraga}
            onChange={(e) => setPretraga(e.target.value)}
            placeholder="Ime majstora..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija</label>
          <select
            value={odabranaKat}
            onChange={(e) => setOdabranaKat(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">Sve kategorije</option>
            {kategorije.map((k) => (
              <option key={k.id} value={k.id}>{k.ime}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Lokacija</label>
          <input
            type="text"
            value={lokacija}
            onChange={(e) => setLokacija(e.target.value)}
            placeholder="npr. Beograd"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Lista majstora */}
      {ucitava ? (
        <div className="text-center py-16 text-gray-400">Učitava se...</div>
      ) : majstori.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Nema rezultata</h3>
          <p className="text-gray-500">Pokušajte sa drugačijim filterima</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {majstori.map((m) => (
            <Link
              key={m.id}
              href={projekat ? `/majstori/${m.korisnik.id}?projekat=${projekat.id}` : `/majstori/${m.korisnik.id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  {m.korisnik.ime[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{m.korisnik.ime}</h3>
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

              {m.bio && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{m.bio}</p>
              )}

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
                  {m.kategorije.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                      +{m.kategorije.length - 3}
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
