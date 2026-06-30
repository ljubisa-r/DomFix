"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useParams } from "next/navigation";
import { srLatn } from "date-fns/locale";
import StatusBedz from "@/components/StatusBedz";
import RokBedz from "@/components/RokBedz";
import TerminBedz from "@/components/TerminBedz";
import OcenaZvezdice from "@/components/OcenaZvezdice";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Korisnik {
  id: string;
  ime: string;
  uloga: string;
}

interface Poruka {
  id: string;
  sadrzaj: string;
  kreiranAt: string;
  posiljalac: { id: string; ime: string; uloga: string };
}

interface Zahtev {
  id: string;
  opis: string;
  zeljeniRok: string | null;
  terminDolaska: string | null;
  status: string;
  kreiranAt: string;
  kategorija: { ime: string };
  klijent: { id: string; ime: string; email: string; telefon: string | null };
  majstor: { id: string; ime: string; email: string; telefon: string | null };
  poruke: Poruka[];
  recenzija: { ocena: number; komentar: string | null } | null;
}

export default function ZahtevDetalj() {
  const { id } = useParams<{ id: string }>();
  const [zahtev, setZahtev] = useState<Zahtev | null>(null);
  const [korisnik, setKorisnik] = useState<Korisnik | null>(null);
  const [poruka, setPoruka] = useState("");
  const [saljePoruku, setSaljePoruku] = useState(false);
  const [recenzijaOcena, setRecenzijaOcena] = useState(0);
  const [recenzijaKomentar, setRecenzijaKomentar] = useState("");
  const [saljeRecenziju, setSaljeRecenziju] = useState(false);
  const [azuriraStatus, setAzuriraStatus] = useState(false);
  const [greska, setGreska] = useState("");
  const [terminPopoverOtvoren, setTerminPopoverOtvoren] = useState(false);
  const [odabraniDatum, setOdabraniDatum] = useState<Date | undefined>();
  const [odabranoVreme, setOdabranoVreme] = useState("");
  const porukeDno = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (d.korisnik) setKorisnik(d.korisnik);
    });
    ucitajZahtev();
  }, [id]);

  useEffect(() => {
    porukeDno.current?.scrollIntoView({ behavior: "smooth" });
  }, [zahtev?.poruke]);

  async function ucitajZahtev() {
    const res = await fetch(`/api/zahtevi/${id}`);
    const data = await res.json();
    if (data.zahtev) setZahtev(data.zahtev);
  }

  async function posaljiPoruku(e: FormEvent) {
    e.preventDefault();
    if (!poruka.trim()) return;
    setSaljePoruku(true);

    await fetch(`/api/zahtevi/${id}/poruke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sadrzaj: poruka.trim() }),
    });

    setPoruka("");
    await ucitajZahtev();
    setSaljePoruku(false);
  }

  async function promeniStatus(noviStatus: string, terminDolaska?: Date) {
    setAzuriraStatus(true);
    await fetch(`/api/zahtevi/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: noviStatus,
        terminDolaska: terminDolaska?.toISOString(),
      }),
    });
    await ucitajZahtev();
    setAzuriraStatus(false);
  }

  function potvrdiPrihvatanje() {
    if (!odabraniDatum || !odabranoVreme) return;
    const [sati, minuti] = odabranoVreme.split(":").map(Number);
    const termin = new Date(odabraniDatum);
    termin.setHours(sati, minuti, 0, 0);

    promeniStatus("PRIHVACEN", termin);
    setTerminPopoverOtvoren(false);
    setOdabraniDatum(undefined);
    setOdabranoVreme("");
  }

  async function posaljiRecenziju(e: FormEvent) {
    e.preventDefault();
    setGreska(""); setSaljeRecenziju(true);

    const res = await fetch("/api/recenzije", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zahtevId: id, ocena: recenzijaOcena, komentar: recenzijaKomentar }),
    });
    const data = await res.json();

    if (!res.ok) { setGreska(data.greska); }
    else { await ucitajZahtev(); }
    setSaljeRecenziju(false);
  }

  if (!zahtev) {
    return <div className="py-16 text-center text-gray-400">Učitava se...</div>;
  }

  const jeKlijent = korisnik?.id === zahtev.klijent.id;
  const jeMajstor = korisnik?.id === zahtev.majstor.id;
  const jeAdmin = korisnik?.uloga === "ADMIN";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Zaglavlje zahteva */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">{zahtev.kategorija.ime}</h1>
            <p className="text-gray-500 text-sm">
              {new Date(zahtev.kreiranAt).toLocaleDateString("sr-Latn-RS", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <StatusBedz status={zahtev.status} />
        </div>

        <p className="text-gray-700 leading-relaxed">{zahtev.opis}</p>

        {(zahtev.zeljeniRok || zahtev.terminDolaska) && (
          <div className="mt-3 mb-2 flex flex-wrap items-center gap-2">
            <RokBedz rok={zahtev.zeljeniRok} />
            <TerminBedz termin={zahtev.terminDolaska} />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 text-sm mt-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 mb-0.5">Klijent</p>
            <p className="font-medium text-gray-900">{zahtev.klijent.ime}</p>
            {zahtev.klijent.telefon && <p className="text-gray-500">{zahtev.klijent.telefon}</p>}
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 mb-0.5">Majstor</p>
            <p className="font-medium text-gray-900">{zahtev.majstor.ime}</p>
            {zahtev.majstor.telefon && <p className="text-gray-500">{zahtev.majstor.telefon}</p>}
          </div>
        </div>

        {/* Dugmad za akcije */}
        {jeMajstor && zahtev.status === "NA_CEKANJU" && (
          <div className="flex gap-3 mt-5">
            <Popover open={terminPopoverOtvoren} onOpenChange={setTerminPopoverOtvoren}>
              <PopoverTrigger asChild>
                <button
                  disabled={azuriraStatus}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Prihvati zahtev
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="start">
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="font-medium text-foreground text-sm">Termin dolaska</p>
                    <p className="text-muted-foreground text-xs">
                      Izaberite datum i vreme kada planirate da dođete.
                    </p>
                  </div>
                  <Calendar
                    mode="single"
                    locale={srLatn}
                    selected={odabraniDatum}
                    onSelect={setOdabraniDatum}
                    disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                    className="p-0"
                  />
                  <div>
                    <label htmlFor="vremeTermina" className="block text-sm font-medium text-foreground mb-1">
                      Vreme
                    </label>
                    <input
                      id="vremeTermina"
                      type="time"
                      value={odabranoVreme}
                      onChange={(e) => setOdabranoVreme(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={potvrdiPrihvatanje}
                    disabled={!odabraniDatum || !odabranoVreme || azuriraStatus}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-2.5 rounded-lg font-medium transition-colors text-sm"
                  >
                    Potvrdi prihvatanje
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            <button
              onClick={() => promeniStatus("ODBIJEN")}
              disabled={azuriraStatus}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Odbij zahtev
            </button>
          </div>
        )}

        {jeMajstor && zahtev.status === "PRIHVACEN" && (
          <button
            onClick={() => promeniStatus("ZAVRSEN")}
            disabled={azuriraStatus}
            className="mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            Označi kao završen
          </button>
        )}
      </div>

      {/* Razgovor */}
      <div className="bg-white rounded-xl border border-gray-200 flex flex-col" style={{ minHeight: "400px" }}>
        <div className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-900">
          Razgovor
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3" style={{ maxHeight: "400px" }}>
          {zahtev.poruke.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Još nema poruka. Pošaljite prvu!</p>
          ) : (
            zahtev.poruke.map((p) => {
              const jaPosiljalac = p.posiljalac.id === korisnik?.id;
              return (
                <div
                  key={p.id}
                  className={`flex flex-col max-w-[75%] ${jaPosiljalac ? "ml-auto items-end" : "items-start"}`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      jaPosiljalac
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-900 rounded-bl-sm"
                    }`}
                  >
                    {p.sadrzaj}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 px-1">
                    {!jaPosiljalac && <span className="font-medium">{p.posiljalac.ime} · </span>}
                    {new Date(p.kreiranAt).toLocaleTimeString("sr-Latn-RS", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              );
            })
          )}
          <div ref={porukeDno} />
        </div>

        {(jeKlijent || jeMajstor || jeAdmin) && (
          <form onSubmit={posaljiPoruku} className="p-4 border-t border-gray-100 flex gap-3">
            <input
              type="text"
              value={poruka}
              onChange={(e) => setPoruka(e.target.value)}
              placeholder="Napišite poruku..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="submit"
              disabled={saljePoruku || !poruka.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              Pošalji
            </button>
          </form>
        )}
      </div>

      {/* Recenzija */}
      {jeKlijent && zahtev.status === "ZAVRSEN" && !zahtev.recenzija && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Ostavite recenziju</h3>
          <form onSubmit={posaljiRecenziju} className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-gray-700 mb-2">Vaša ocena</p>
              <OcenaZvezdice
                ocena={recenzijaOcena}
                velicina="lg"
                klikabilno
                onOcena={setRecenzijaOcena}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Komentar (opciono)</label>
              <textarea
                value={recenzijaKomentar}
                onChange={(e) => setRecenzijaKomentar(e.target.value)}
                placeholder="Kako je protekao posao?"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              />
            </div>
            {greska && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{greska}</div>}
            <button
              type="submit"
              disabled={saljeRecenziju || recenzijaOcena === 0}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-2.5 rounded-lg font-semibold transition-colors"
            >
              {saljeRecenziju ? "Šalje se..." : "Pošalji recenziju"}
            </button>
          </form>
        </div>
      )}

      {zahtev.recenzija && (
        <div className="bg-green-50 rounded-xl border border-green-200 p-5">
          <p className="font-medium text-green-800 mb-2">✅ Recenzija ostavljena</p>
          <OcenaZvezdice ocena={zahtev.recenzija.ocena} velicina="sm" />
          {zahtev.recenzija.komentar && (
            <p className="text-green-700 text-sm mt-2">{zahtev.recenzija.komentar}</p>
          )}
        </div>
      )}
    </div>
  );
}
