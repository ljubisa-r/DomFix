"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StatusBedz from "@/components/StatusBedz";

interface Zahtev {
  id: string;
  opis: string;
  status: string;
  kreiranAt: string;
  azuriranAt: string;
  kategorija: { ime: string };
  klijent: { id: string; ime: string; email: string };
  majstor: { id: string; ime: string; email: string };
  _count: { poruke: number };
}

export default function AdminStrana() {
  const [zahtevi, setZahtevi] = useState<Zahtev[]>([]);
  const [ucitava, setUcitava] = useState(true);
  const [greska, setGreska] = useState("");
  const [filter, setFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.korisnik || d.korisnik.uloga !== "ADMIN") {
          router.push("/dashboard");
        }
      });

    fetch("/api/admin/razgovori")
      .then((r) => r.json())
      .then((d) => {
        if (d.greska) { setGreska(d.greska); }
        else { setZahtevi(d.zahtevi ?? []); }
        setUcitava(false);
      });
  }, [router]);

  const filtrirani = filter
    ? zahtevi.filter(
        (z) =>
          z.status === filter ||
          z.klijent.ime.toLowerCase().includes(filter.toLowerCase()) ||
          z.majstor.ime.toLowerCase().includes(filter.toLowerCase()) ||
          z.kategorija.ime.toLowerCase().includes(filter.toLowerCase())
      )
    : zahtevi;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin panel</h1>
        <p className="text-gray-500 mt-1">Pregled svih razgovora između majstora i klijenata</p>
      </div>

      {/* Statistike */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Ukupno zahteva", vrednost: zahtevi.length, boja: "bg-gray-50 text-gray-700 border-gray-200" },
          { label: "Na čekanju", vrednost: zahtevi.filter(z => z.status === "NA_CEKANJU").length, boja: "bg-yellow-50 text-yellow-700 border-yellow-200" },
          { label: "Aktivni", vrednost: zahtevi.filter(z => z.status === "PRIHVACEN").length, boja: "bg-blue-50 text-blue-700 border-blue-200" },
          { label: "Završeni", vrednost: zahtevi.filter(z => z.status === "ZAVRSEN").length, boja: "bg-green-50 text-green-700 border-green-200" },
        ].map((s) => (
          <div key={s.label} className={`${s.boja} rounded-xl p-4 text-center border`}>
            <div className="text-3xl font-bold">{s.vrednost}</div>
            <div className="text-sm font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pretraga */}
      <div className="mb-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtriraj po imenu, kategoriji ili statusu..."
          className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Tabela zahteva */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            Svi razgovori ({filtrirani.length})
          </h2>
        </div>

        {greska ? (
          <div className="p-6 text-red-600">{greska}</div>
        ) : ucitava ? (
          <div className="text-center py-12 text-gray-400">Učitava se...</div>
        ) : filtrirani.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Nema rezultata</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Kategorija</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Klijent</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Majstor</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Poruke</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Datum</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtrirani.map((z) => (
                  <tr key={z.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{z.kategorija.ime}</td>
                    <td className="px-5 py-3.5">
                      <div className="text-gray-900">{z.klijent.ime}</div>
                      <div className="text-gray-400 text-xs">{z.klijent.email}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-gray-900">{z.majstor.ime}</div>
                      <div className="text-gray-400 text-xs">{z.majstor.email}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBedz status={z.status} />
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {z._count.poruke} {z._count.poruke === 1 ? "poruka" : "poruka"}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">
                      {new Date(z.kreiranAt).toLocaleDateString("sr-RS")}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/razgovori/${z.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                      >
                        Pogledaj →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
