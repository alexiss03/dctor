"use server";

import { BasePatient, PatientProfile } from "@/types/patient";
import { search } from "./search";

export async function getPatients(q?: string) {
  const searchParams = new URLSearchParams();

  if (q) {
    searchParams.append("query[input]", q);
  }

  searchParams.append("query[source_type]", "patient");

  const response = await search<
    BasePatient & Pick<PatientProfile, "insurances">
  >({
    q,
    types: ["patient"],
  });

  return response;
}
