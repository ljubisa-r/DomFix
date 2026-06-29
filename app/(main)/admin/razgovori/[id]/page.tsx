"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import StatusBedz from "@/components/StatusBedz";
import OcenaZvezdice from "@/components/OcenaZvezdice";

interface Poruka {
  id: string;
  sadrzaj: string;
  kreiranAt: string;
  posiljalac: { id: string; ime: string; uloga: string };
}

interface Zahtev {
  id: string;
  opis: string;
  status: string;
  kreiranAt: string;
  kategorija: { ime: string };
  klijent: { id: string; ime: string; email: string; telefon: string | null };
  majstor: { id: string; ime: string; email: string; telefon: string | null };
  poruke: Poruka[];
  recenzija: { ocena: number; komentar: string | null } | null;
}

export default function AdminRazgovorStrana() {
  const { id } = useParams<{ id: string }>();
  const [zahtev, setZahtev] = useState<Zahtev | null>(null);
  const router = useRouter();
  const porukeDno = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (!d.korisnik || d.korisnik.uloga !== "ADMIN") {
        router.push("/dashboard");
      }
    });

    fetch(`/api/admin/razgovori/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d.zahtev) setZahtev(d.zahtev); });
  }, [id, router]);

  useEffect(() => {
    porukeDno.current?.scrollIntoView({ behavior: "smooth" });
  }, [zahtev?.poruke]);

  if (!zahtev) return <div className="py-16 text-center text-gray-400">Učitava se...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          ← Nazad na listu
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-500 text-sm">Razgovor #{id.slice(-8)}</span>
      </div>

      {/* Informacije o zahtevu */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">{zahtev.kategorija.ime}</h1>
            <p className="text-gray-500 text-sm">
              Kreiran: {new Date(zahtev.kreiranAt).toLocaleDateString("sr-RS", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <StatusBedz status={zahtev.status} />
        </div>

        <p className="text-gray-700 mb-5 bg-gray-50 p-4 rounded-lg leading-relaxed">{zahtev.opis}</p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-400 uppercase font-medium mb-2">Klijent</p>
            <p className="font-semibold text-gray-900">{zahtev.klijent.ime}</p>
            <p className="text-gray-500 text-sm">{zahtev.klijent.email}</p>
            {zahtev.klijent.telefon && <p className="text-gray-500 text-sm">{zahtev.klijent.telefon}</p>}
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-400 uppercase font-medium mb-2">Majstor</p>
            <p className="font-semibold text-gray-900">{zahtev.majstor.ime}</p>
            <p className="text-gray-500 text-sm">{zahtev.majstor.email}</p>
            {zahtev.majstor.telefon && <p className="text-gray-500 text-sm">{zahtev.majstor.telefon}</p>}
          </div>
        </div>

        {zahtev.recenzija && (
          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="font-medium text-amber-800 mb-2 text-sm">Recenzija klijenta</p>
            <OcenaZvezdice ocena={zahtev.recenzija.ocena} velicina="sm" />
            {zahtev.recenzija.komentar && (
              <p className="text-amber-700 text-sm mt-1">"{zahtev.recenzija.komentar}"</p>
            )}
          </div>
        )}
      </div>

      {/* Razgovor — samo za čitanje */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Razgovor</h2>
          <span className="text-sm text-gray-400">{zahtev.poruke.length} poruka</span>
        </div>

        <div className="p-6 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: "500px" }}>
          {zahtev.poruke.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Nema poruka u ovom razgovoru</p>
          ) : (
            zahtev.poruke.map((p) => {
              const jeKlijent = p.posiljalac.id === zahtev.klijent.id;
              return (
                <div key={p.id} className={`flex gap-3 ${jeKlijent ? "" : "flex-row-reverse"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    jeKlijent ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {p.posiljalac.ime[0].toUpperCase()}
                  </div>
                  <div className={`max-w-[70%] ${jeKlijent ? "" : "items-end"}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      jeKlijent
                        ? "bg-blue-50 text-gray-900 rounded-tl-sm"
                        : "bg-orange-50 text-gray-900 rounded-tr-sm"
                    }`}>
                      {p.sadrzaj}
                    </div>
                    <div className={`text-xs text-gray-400 mt-1 px-1 ${jeKlijent ? "" : "text-right"}`}>
                      <span className="font-medium">{p.posiljalac.ime}</span>
                      {" · "}
                      {new Date(p.kreiranAt).toLocaleString("sr-RS", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={porukeDno} />
        </div>

        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
          <p className="text-xs text-gray-400 text-center">
            Admin režim — samo za pregled razgovora
          </p>
        </div>
      </div>
    </div>
  );
}
