import { Page } from "@/components/Page";
import { UserGuard } from "@/components/UserGuard";
import { AddClinic } from "./AddClinic";

export default async function AddClinicPage() {
  return (
    <UserGuard allowedTypes={["admin"]}>
      <Page title="Add New Clinic">
        <AddClinic />
      </Page>
    </UserGuard>
  );
}
