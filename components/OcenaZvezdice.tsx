"use client";

interface Props {
  ocena: number;
  max?: number;
  velicina?: "sm" | "md" | "lg";
  klikabilno?: boolean;
  onOcena?: (ocena: number) => void;
}

export default function OcenaZvezdice({
  ocena,
  max = 5,
  velicina = "md",
  klikabilno = false,
  onOcena,
}: Props) {
  const vel = velicina === "sm" ? "w-4 h-4" : velicina === "lg" ? "w-7 h-7" : "w-5 h-5";

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((zvezdica) => (
        <button
          key={zvezdica}
          type="button"
          disabled={!klikabilno}
          onClick={() => klikabilno && onOcena?.(zvezdica)}
          className={`${vel} ${klikabilno ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill={zvezdica <= ocena ? "#f59e0b" : "none"}
            stroke={zvezdica <= ocena ? "#f59e0b" : "#d1d5db"}
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}
