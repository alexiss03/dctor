"use server";

import { bookAppointment } from "@/backendServer/appointment";

export async function book(formData: FormData) {
  const doctorID = formData.get("doctorID") as string;
  const clinicID = formData.get("clinicID") as string;
  const dateStart = formData.get("dateStart") as string;
  const condition = formData.get("condition") as string;

  const response = await bookAppointment({
    doctorID,
    clinicID,
    dateStart,
    condition,
  });

  return response;
}
