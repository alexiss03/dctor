import cache from "memory-cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  let appointments = cache.get(`doctor/${id}/appointments`);

  console.log("from fetch");
  console.log(`doctor/${id}/appointments`);
  console.log(appointments);

  if (!appointments) {
    appointments = {};
  }

  return NextResponse.json(appointments);
}
