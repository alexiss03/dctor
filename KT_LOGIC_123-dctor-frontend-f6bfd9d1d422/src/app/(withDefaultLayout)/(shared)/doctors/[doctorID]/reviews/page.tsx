import { ReviewsPage } from "@/components/ReviewsPage";

export default function DoctorsReviews({
  params,
}: {
  params: { doctorID: string };
}) {
  return <ReviewsPage id={params.doctorID} />;
}
