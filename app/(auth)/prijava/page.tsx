"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PrijavaStrana() {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const [ucitava, setUcitava] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGreska("");
    setUcitava(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lozinka }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGreska(data.greska);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setGreska("Greška pri prijavi. Pokušajte ponovo.");
    } finally {
      setUcitava(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dobrodošli nazad</h1>
        <p className="text-gray-500 mb-8">Prijavite se na vaš DomFix nalog</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email adresa
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vas@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lozinka
            </label>
            <input
              type="password"
              required
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {greska && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
              {greska}
            </div>
          )}

          <button
            type="submit"
            disabled={ucitava}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition-colors mt-2"
          >
            {ucitava ? "Prijava u toku..." : "Prijavi se"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Nemate nalog?{" "}
          <Link href="/registracija" className="text-blue-600 font-medium hover:underline">
            Registrujte se
          </Link>
        </p>
      </div>
    </div>
  );
}
