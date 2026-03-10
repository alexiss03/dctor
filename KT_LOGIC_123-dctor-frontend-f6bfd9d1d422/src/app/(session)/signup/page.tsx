import { getInsurances } from "@/backendServer/insurance";
import _ from "lodash";
import { SignupForm } from "./SignupForm";

export default async function SignupPage() {
  const insurances = await getInsurances();

  const sortedInsurances = _.sortBy(insurances, "name");

  return <SignupForm insurances={sortedInsurances} />;
}
