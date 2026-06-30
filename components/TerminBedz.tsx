export default function TerminBedz({ termin }: { termin: string | Date | null | undefined }) {
  if (!termin) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
      <span aria-hidden="true">📅</span>
      Termin dolaska:{" "}
      {new Date(termin).toLocaleString("sr-Latn-RS", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  );
}
