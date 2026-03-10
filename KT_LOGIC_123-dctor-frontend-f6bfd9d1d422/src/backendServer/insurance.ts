"use server";

import { GetInsurancesResultAPI } from "@/types/api";
import { formatInsurance } from "@/utils/healthcare";
import { get } from ".";

export async function getInsurances() {
  const response = await get<GetInsurancesResultAPI[]>("insurance");

  if ("error" in response) {
    return response;
  }

  return { data: response.data.map((insurance) => formatInsurance(insurance)) };
}
