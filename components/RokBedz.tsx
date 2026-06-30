import { ROK_NAZIVI } from "@/lib/rokovi";

export default function RokBedz({ rok }: { rok: string | null | undefined }) {
  if (!rok) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
      <span aria-hidden="true">🕐</span>
      {ROK_NAZIVI[rok] ?? rok}
    </span>
  );
}
