"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROK_OPCIJE } from "@/lib/rokovi";

interface Kategorija {
  id: string;
  ime: string;
}

interface TrenutniKorisnik {
  id: string;
  uloga: string;
}

export default function NoviProjekatStrana() {
  const router = useRouter();
  const [trenutniKorisnik, setTrenutniKorisnik] = useState<TrenutniKorisnik | null>(null);
  const [provereno, setProvereno] = useState(false);
  const [kategorije, setKategorije] = useState<Kategorija[]>([]);
  const [kategorijaId, setKategorijaId] = useState("");
  const [opis, setOpis] = useState("");
  const [lokacija, setLokacija] = useState("");
  const [zeljeniRok, setZeljeniRok] = useState("");
  const [greska, setGreska] = useState("");
  const [salje, setSalje] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setTrenutniKorisnik(d.korisnik ?? null);
        setProvereno(true);
      });

    fetch("/api/kategorije")
      .then((r) => r.json())
      .then((d) => setKategorije(d.kategorije ?? []));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGreska("");
    setSalje(true);

    try {
      const res = await fetch("/api/projekti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kategorijaId, opis, lokacija, zeljeniRok: zeljeniRok || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        setGreska(data.greska);
        return;
      }

      const params = new URLSearchParams({
        kategorija: kategorijaId,
        projekat: data.projekat.id,
      });
      if (lokacija) params.set("lokacija", lokacija);

      router.push(`/majstori?${params.toString()}`);
    } catch {
      setGreska("Greška pri kreiranju projekta. Pokušajte ponovo.");
    } finally {
      setSalje(false);
    }
  }

  if (!provereno) {
    return <div className="py-16 text-center text-gray-400">Učitava se...</div>;
  }

  if (!trenutniKorisnik) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Prijavite se da opišete posao</h1>
        <p className="text-gray-500 mb-6">
          Da bismo vas povezali sa pravim majstorom, prvo se prijavite ili kreirajte nalog.
        </p>
        <Link
          href="/prijava"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Prijavi se
        </Link>
      </div>
    );
  }

  if (trenutniKorisnik.uloga !== "KLIJENT") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Ova opcija je za klijente</h1>
        <p className="text-gray-500 mb-6">
          Vaš nalog je registrovan kao majstor, pa ne možete kreirati projekat.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Idi na kontrolnu tablu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Opišite svoj posao</h1>
        <p className="text-gray-500 mb-8">
          Recite nam šta vam treba, a mi vam pokazujemo majstore koji to rade.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="kategorija" className="block text-sm font-medium text-gray-700 mb-1">
              Kategorija posla
            </label>
            <select
              id="kategorija"
              required
              value={kategorijaId}
              onChange={(e) => setKategorijaId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Izaberite kategoriju</option>
              {kategorije.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.ime}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="opis" className="block text-sm font-medium text-gray-700 mb-1">
              Opis posla
            </label>
            <textarea
              id="opis"
              required
              minLength={10}
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
              placeholder="Npr. Curi slavina u kupatilu, potrebna je zamena dihtunga."
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label htmlFor="zeljeniRok" className="block text-sm font-medium text-gray-700 mb-1">
              Željeni rok realizacije <span className="text-gray-400 font-normal">(opciono)</span>
            </label>
            <select
              id="zeljeniRok"
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
            <p className="text-sm text-gray-400 mt-1">
              Pomaže majstoru da proceni da li može da stigne u tom roku.
            </p>
          </div>

          <div>
            <label htmlFor="lokacija" className="block text-sm font-medium text-gray-700 mb-1">
              Lokacija <span className="text-gray-400 font-normal">(opciono)</span>
            </label>
            <input
              id="lokacija"
              type="text"
              value={lokacija}
              onChange={(e) => setLokacija(e.target.value)}
              placeholder="npr. Beograd, Vračar"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-400 mt-1">
              Pomaže nam da vam prikažemo majstore u vašoj okolini.
            </p>
          </div>

          {greska && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{greska}</div>
          )}

          <button
            type="submit"
            disabled={salje}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {salje ? "Kreira se..." : "Pronađi majstora za ovaj posao"}
          </button>
        </form>
      </div>
    </div>
  );
}
