"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Korisnik {
  id: string;
  ime: string;
  uloga: string;
}

export default function Navbar() {
  const [korisnik, setKorisnik] = useState<Korisnik | null>(null);
  const [menuOtvoren, setMenuOtvoren] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.korisnik) setKorisnik(d.korisnik);
      })
      .catch(() => {});
  }, []);

  async function odjava() {
    await fetch("/api/auth/logout", { method: "POST" });
    setKorisnik(null);
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">Dom</span>
            <span className="text-2xl font-bold text-orange-500">Fix</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/majstori"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Majstori
            </Link>
            {korisnik ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Kontrolna tabla
                </Link>
                {korisnik.uloga === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setMenuOtvoren(!menuOtvoren)}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {korisnik.ime[0].toUpperCase()}
                    </div>
                    <span className="font-medium">{korisnik.ime}</span>
                  </button>
                  {menuOtvoren && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                      <Link
                        href="/profil"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setMenuOtvoren(false)}
                      >
                        Moj profil
                      </Link>
                      <button
                        onClick={odjava}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Odjava
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/prijava"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Prijava
                </Link>
                <Link
                  href="/registracija"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Registracija
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOtvoren(!menuOtvoren)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {menuOtvoren && (
          <div className="md:hidden py-3 border-t border-gray-100 flex flex-col gap-2">
            <Link href="/majstori" className="px-2 py-2 text-gray-700 hover:text-blue-600" onClick={() => setMenuOtvoren(false)}>
              Majstori
            </Link>
            {korisnik ? (
              <>
                <Link href="/dashboard" className="px-2 py-2 text-gray-700 hover:text-blue-600" onClick={() => setMenuOtvoren(false)}>
                  Kontrolna tabla
                </Link>
                <Link href="/profil" className="px-2 py-2 text-gray-700 hover:text-blue-600" onClick={() => setMenuOtvoren(false)}>
                  Moj profil
                </Link>
                {korisnik.uloga === "ADMIN" && (
                  <Link href="/admin" className="px-2 py-2 text-gray-700 hover:text-blue-600" onClick={() => setMenuOtvoren(false)}>
                    Admin panel
                  </Link>
                )}
                <button onClick={odjava} className="px-2 py-2 text-red-600 text-left hover:text-red-700">
                  Odjava
                </button>
              </>
            ) : (
              <>
                <Link href="/prijava" className="px-2 py-2 text-gray-700 hover:text-blue-600" onClick={() => setMenuOtvoren(false)}>
                  Prijava
                </Link>
                <Link href="/registracija" className="px-2 py-2 text-blue-600 font-medium" onClick={() => setMenuOtvoren(false)}>
                  Registracija
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
