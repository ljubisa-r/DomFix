"use client";

import { useState, useEffect } from "react";

interface Kategorija {
  id: string;
  ime: string;
}

export interface ProfilZaEdit {
  bio: string | null;
  lokacija: string;
  kategorije: { kategorija: { id: string; ime: string } }[];
  cenaAngazmana: number | null;
  jedinicaCene: string | null;
}

interface Props {
  profil: ProfilZaEdit;
  onSacuvano: (novePodatke: ProfilZaEdit) => void;
  onOtkazi: () => void;
}

export default function UrediProfilForma({ profil, onSacuvano, onOtkazi }: Props) {
  const [bio, setBio] = useState(profil.bio ?? "");
  const [lokacija, setLokacija] = useState(profil.lokacija);
  const [sveKategorije, setSveKategorije] = useState<Kategorija[]>([]);
  const [odabraneIds, setOdabraneIds] = useState<Set<string>>(
    new Set(profil.kategorije.map((k) => k.kategorija.id))
  );
  const [cena, setCena] = useState(
    profil.cenaAngazmana != null ? String(profil.cenaAngazmana) : ""
  );
  const [jedinica, setJedinica] = useState(profil.jedinicaCene ?? "SAT");
  const [saljeSe, setSaljeSe] = useState(false);
  const [greska, setGreska] = useState("");

  useEffect(() => {
    fetch("/api/kategorije")
      .then((r) => r.json())
      .then((d) => setSveKategorije(d.kategorije));
  }, []);

  function toggleKategorija(id: string) {
    setOdabraneIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function sacuvaj(e: React.FormEvent) {
    e.preventDefault();
    setGreska("");
    setSaljeSe(true);

    const cenaAngazmana = cena ? parseFloat(cena) : null;

    const res = await fetch("/api/profil", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bio: bio.trim() || null,
        lokacija: lokacija.trim(),
        kategorijeIds: Array.from(odabraneIds),
        cenaAngazmana,
        jedinicaCene: jedinica,
      }),
    });

    const data = await res.json();
    setSaljeSe(false);

    if (!res.ok) {
      setGreska(data.greska ?? "Greška pri čuvanju");
      return;
    }

    onSacuvano({
      bio: bio.trim() || null,
      lokacija: lokacija.trim(),
      kategorije: sveKategorije
        .filter((k) => odabraneIds.has(k.id))
        .map((k) => ({ kategorija: k })),
      cenaAngazmana,
      jedinicaCene: cenaAngazmana ? jedinica : null,
    });
  }

  return (
    <form onSubmit={sacuvaj} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="upf-bio"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Opis
        </label>
        <textarea
          id="upf-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Opišite svoja iskustva, specijalnosti i pristup poslu..."
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div>
        <label
          htmlFor="upf-lokacija"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Lokacija
        </label>
        <input
          id="upf-lokacija"
          required
          value={lokacija}
          onChange={(e) => setLokacija(e.target.value)}
          placeholder="Npr. Beograd, Novi Sad..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Kategorije</p>
        {sveKategorije.length === 0 ? (
          <p className="text-sm text-gray-400">Učitava se...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sveKategorije.map((k) => {
              const odabrana = odabraneIds.has(k.id);
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => toggleKategorija(k.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    odabrana
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {k.ime}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-1.5">
          Cena angažmana
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="50"
            value={cena}
            onChange={(e) => setCena(e.target.value)}
            placeholder="Npr. 1500"
            className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={jedinica}
            onChange={(e) => setJedinica(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shrink-0"
          >
            <option value="SAT">po satu</option>
            <option value="DAN">po danu</option>
          </select>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Ostavite prazno ako dogovarate cenu za svaki posao posebno
        </p>
      </div>

      {greska && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          {greska}
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onOtkazi}
          className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          Otkaži
        </button>
        <button
          type="submit"
          disabled={saljeSe}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          {saljeSe ? "Čuva se..." : "Sačuvaj profil"}
        </button>
      </div>
    </form>
  );
}
