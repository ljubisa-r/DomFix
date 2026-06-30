"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Referenca {
  id: string;
  naslov: string;
  opis: string;
  slike: string[];
}

export default function RadoviTraka({
  radovi,
  onOtvori,
}: {
  radovi: Referenca[];
  onOtvori: (referenca: Referenca) => void;
}) {
  const trakaRef = useRef<HTMLDivElement>(null);
  const [mozeLevo, setMozeLevo] = useState(false);
  const [mozeDesno, setMozeDesno] = useState(false);

  function azurirajStrelice() {
    const el = trakaRef.current;
    if (!el) return;
    setMozeLevo(el.scrollLeft > 4);
    setMozeDesno(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    azurirajStrelice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radovi]);

  function pomeri(smer: 1 | -1) {
    trakaRef.current?.scrollBy({ left: smer * 200, behavior: "smooth" });
  }

  if (radovi.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-2">Radovi ({radovi.length})</p>

      <div className="relative">
        {mozeLevo && (
          <button
            type="button"
            onClick={() => pomeri(-1)}
            aria-label="Prikaži prethodne radove"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-gray-900/60 hover:bg-gray-900/80 text-white rounded-full p-1 transition-colors"
          >
            <ChevronLeft className="size-3.5" />
          </button>
        )}

        <div
          ref={trakaRef}
          onScroll={azurirajStrelice}
          className="flex gap-1.5 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
        >
          {radovi.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onOtvori(r)}
              className="group shrink-0 w-20 aspect-square rounded-lg overflow-hidden border border-gray-200 snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.slike[0]}
                alt={r.naslov}
                loading="lazy"
                className="w-full h-full object-cover motion-safe:group-hover:scale-105 transition-transform duration-200"
              />
            </button>
          ))}
        </div>

        {mozeDesno && (
          <button
            type="button"
            onClick={() => pomeri(1)}
            aria-label="Prikaži sledeće radove"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-gray-900/60 hover:bg-gray-900/80 text-white rounded-full p-1 transition-colors"
          >
            <ChevronRight className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
