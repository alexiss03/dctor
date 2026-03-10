import { ProfilePage } from "@/components/ProfilePage";

export default async function DoctorProfilePage({
  params,
}: {
  params: { doctorID: string };
}) {
  const { doctorID } = params;

  return <ProfilePage id={doctorID} />;
}
