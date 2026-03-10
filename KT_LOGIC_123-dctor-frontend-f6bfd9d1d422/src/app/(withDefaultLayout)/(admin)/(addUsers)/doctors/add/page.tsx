import { Page } from "@/components/Page";
import { UserGuard } from "@/components/UserGuard";
import { AddDoctor } from "./AddDoctor";

export default async function AddDoctorPage() {
  return (
    <UserGuard allowedTypes={["admin"]}>
      <Page title="Add New Account">
        <AddDoctor />
      </Page>
    </UserGuard>
  );
}
