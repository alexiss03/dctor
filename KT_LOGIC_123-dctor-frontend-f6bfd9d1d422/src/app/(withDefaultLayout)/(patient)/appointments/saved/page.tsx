import { SAMPLE_CLINIC, SAMPLE_DOCTOR } from "@/mockData";

import { Button } from "@/components/Button";
import { HealthcareBox } from "@/components/HealthcareBox";
import appointmentStyles from "../style.module.css";

const SAMPLE_DOCTORS = [SAMPLE_DOCTOR, SAMPLE_DOCTOR, SAMPLE_CLINIC];

export default function SavedProfilesPage() {
  return (
    <div className={appointmentStyles.container}>
      {SAMPLE_DOCTORS.map((doctor, i) => (
        <HealthcareBox
          key={`${doctor.id}/${i}`}
          data={doctor}
          fields={[
            {
              name: "photo",
            },
            {
              name: "name",
            },
            {
              name: "category",
            },
            {
              name: "location",
              icon: true,
            },
            {
              name: "rating",
            },
          ]}
          actions={[
            <Button key="remove" variant="secondary" size="large">
              Remove
            </Button>,
            <Button key="book" variant="primary" size="large">
              Book
            </Button>,
          ]}
        />
      ))}
    </div>
  );
}
