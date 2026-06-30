export const ROK_OPCIJE = [
  { value: "HITNO", label: "Hitno — što pre" },
  { value: "NEDELJA_DANA", label: "U narednih nedelju dana" },
  { value: "MESEC_DANA", label: "U narednih mesec dana" },
  { value: "FLEKSIBILNO", label: "Nisam u žurbi" },
] as const;

export const ROK_NAZIVI: Record<string, string> = {
  HITNO: "Hitno",
  NEDELJA_DANA: "Ova nedelja",
  MESEC_DANA: "Ovaj mesec",
  FLEKSIBILNO: "Fleksibilno",
};
