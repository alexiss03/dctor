import { BaseClinic } from "./healthcare";

export type Insurance = {
  id: string;
  name: string;
};

export type DoctorInsurance = {
  insurance: Insurance;
  clinic: BaseClinic;
};
