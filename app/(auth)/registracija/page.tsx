"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Kategorija {
  id: string;
  ime: string;
}

export default function RegistracijaStrana() {
  const [korak, setKorak] = useState(1);
  const [uloga, setUloga] = useState<"KLIJENT" | "MAJSTOR">("KLIJENT");
  const [ime, setIme] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [lokacija, setLokacija] = useState("");
  const [bio, setBio] = useState("");
  const [odabraneKategorije, setOdabraneKategorije] = useState<string[]>([]);
  const [kategorije, setKategorije] = useState<Kategorija[]>([]);
  const [greska, setGreska] = useState("");
  const [ucitava, setUcitava] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/kategorije")
      .then((r) => r.json())
      .then((d) => setKategorije(d.kategorije ?? []));
  }, []);

  function toggleKategorija(id: string) {
    setOdabraneKategorije((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGreska("");
    setUcitava(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          lozinka,
          ime,
          telefon,
          uloga,
          ...(uloga === "MAJSTOR" ? { lokacija, bio, kategorije: odabraneKategorije } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGreska(data.greska);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setGreska("Greška pri registraciji. Pokušajte ponovo.");
    } finally {
      setUcitava(false);
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Kreirajte nalog</h1>
        <p className="text-gray-500 mb-8">Pridružite se DomFix zajednici</p>

        {korak === 1 && (
          <div className="flex flex-col gap-4">
            <p className="font-medium text-gray-700">Ko ste vi?</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setUloga("KLIJENT")}
                className={`p-5 rounded-xl border-2 text-center transition-all ${
                  uloga === "KLIJENT"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-3xl mb-2">🏠</div>
                <div className="font-semibold text-gray-900">Tražim majstora</div>
                <div className="text-sm text-gray-500 mt-1">Potrebna mi je usluga</div>
              </button>
              <button
                type="button"
                onClick={() => setUloga("MAJSTOR")}
                className={`p-5 rounded-xl border-2 text-center transition-all ${
                  uloga === "MAJSTOR"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-3xl mb-2">🔧</div>
                <div className="font-semibold text-gray-900">Ja sam majstor</div>
                <div className="text-sm text-gray-500 mt-1">Nudim usluge</div>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setKorak(2)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors mt-2"
            >
              Nastavi
            </button>
          </div>
        )}

        {korak === 2 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ime i prezime</label>
                <input
                  type="text"
                  required
                  value={ime}
                  onChange={(e) => setIme(e.target.value)}
                  placeholder="Marko Marković"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                  type="tel"
                  value={telefon}
                  onChange={(e) => setTelefon(e.target.value)}
                  placeholder="+381 6X XXX XXXX"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email adresa</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vas@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lozinka</label>
              <input
                type="password"
                required
                minLength={6}
                value={lozinka}
                onChange={(e) => setLozinka(e.target.value)}
                placeholder="Minimum 6 karaktera"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {uloga === "MAJSTOR" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grad/lokacija</label>
                  <input
                    type="text"
                    required
                    value={lokacija}
                    onChange={(e) => setLokacija(e.target.value)}
                    placeholder="npr. Beograd"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kratko o sebi (opciono)</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Opišite vaše iskustvo..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {kategorije.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategorije usluga</label>
                    <div className="flex flex-wrap gap-2">
                      {kategorije.map((k) => (
                        <button
                          key={k.id}
                          type="button"
                          onClick={() => toggleKategorija(k.id)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                            odabraneKategorije.includes(k.id)
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {k.ime}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {greska && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                {greska}
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setKorak(1)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Nazad
              </button>
              <button
                type="submit"
                disabled={ucitava}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {ucitava ? "Registracija..." : "Registruj se"}
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-gray-500 mt-6 text-sm">
          Već imate nalog?{" "}
          <Link href="/prijava" className="text-blue-600 font-medium hover:underline">
            Prijavite se
          </Link>
        </p>
      </div>
    </div>
  );
}
