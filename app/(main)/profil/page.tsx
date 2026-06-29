"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OcenaZvezdice from "@/components/OcenaZvezdice";

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
  } | null;
}

export default function ProfilStrana() {
  const [korisnik, setKorisnik] = useState<KorisnikProfil | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.korisnik) { router.push("/prijava"); return; }
        setKorisnik(d.korisnik);
      });
  }, [router]);

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
              {new Date(korisnik.kreiranAt).toLocaleDateString("sr-RS", { year: "numeric", month: "long" })}
            </span>
          </div>
        </div>
      </div>

      {korisnik.majstorProfil && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Profil majstora</h3>

          <div className="flex items-center gap-3 mb-4">
            <OcenaZvezdice ocena={Math.round(korisnik.majstorProfil.prosecnaOcena)} velicina="md" />
            <span className="font-semibold text-gray-800">
              {korisnik.majstorProfil.prosecnaOcena.toFixed(1)}
            </span>
            <span className="text-gray-400 text-sm">
              ({korisnik.majstorProfil.brojRecenzija} recenzija)
            </span>
          </div>

          <div className="grid gap-3 text-sm mb-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Lokacija</span>
              <span className="font-medium text-gray-900">{korisnik.majstorProfil.lokacija}</span>
            </div>
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
        </div>
      )}
    </div>
  );
}
