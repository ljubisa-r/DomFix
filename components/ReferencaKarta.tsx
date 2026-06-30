"use client";

import { Trash2 } from "lucide-react";

interface ReferencaProp {
  id: string;
  naslov: string;
  opis: string;
  slike: string[];
}

export default function ReferencaKarta({
  referenca,
  onObrisi,
}: {
  referenca: ReferencaProp;
  onObrisi?: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="font-semibold text-gray-900">{referenca.naslov}</h4>
        {onObrisi && (
          <button
            onClick={() => onObrisi(referenca.id)}
            aria-label={`Obriši rad „${referenca.naslov}"`}
            className="shrink-0 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg p-1.5 transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-3">{referenca.opis}</p>

      <div className="grid grid-cols-3 gap-1.5">
        {referenca.slike.map((slika, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={slika}
            src={slika}
            alt={`${referenca.naslov} — slika ${i + 1}`}
            loading="lazy"
            className="aspect-square w-full rounded-lg object-cover border border-gray-100"
          />
        ))}
      </div>
    </div>
  );
}
