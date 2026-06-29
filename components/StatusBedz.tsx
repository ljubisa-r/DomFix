const boje: Record<string, string> = {
  NA_CEKANJU: "bg-yellow-100 text-yellow-800",
  PRIHVACEN: "bg-blue-100 text-blue-800",
  ODBIJEN: "bg-red-100 text-red-800",
  ZAVRSEN: "bg-green-100 text-green-800",
};

const nazivi: Record<string, string> = {
  NA_CEKANJU: "Na čekanju",
  PRIHVACEN: "Prihvaćen",
  ODBIJEN: "Odbijen",
  ZAVRSEN: "Završen",
};

export default function StatusBedz({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${boje[status] ?? "bg-gray-100 text-gray-800"}`}
    >
      {nazivi[status] ?? status}
    </span>
  );
}
