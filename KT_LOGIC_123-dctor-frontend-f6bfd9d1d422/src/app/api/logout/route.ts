import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const nextCookies = cookies();

  nextCookies.delete("Authorization");

  return NextResponse.json({ message: "Logged out successfully" });
}
