import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ poruka: "Uspešno odjavljen" });
  res.cookies.set({
    name: "domfix_token",
    value: "",
    maxAge: 0,
    path: "/",
  });
  return res;
}
