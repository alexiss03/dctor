"use client";

import classNames from "classnames";

import { AppointmentBooking } from "@/app/(patient)/search/AppointmentBooking";
import { getReviews } from "@/backendServer/healthcare";
import { getCurrentUser, getUser } from "@/backendServer/user";
import { HealthcareBox, HealthcareBoxProps } from "@/components/HealthcareBox";
import { HealthcareField } from "@/components/HealthcareField";
import { Page } from "@/components/Page";
import { useSidePane } from "@/hooks/useSidePane";
import { ClockOutlineIcon } from "@/icons/clockOutline";
import { ContactIcon } from "@/icons/contact";
import { LocationIcon } from "@/icons/location";
import {
  Availability,
  ClinicProfile,
  DoctorProfile,
  Review,
} from "@/types/healthcare";
import { PatientProfile } from "@/types/patient";
import { User } from "@/types/user";
import { formatTimeblock } from "@/utils/date";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import _ from "lodash";
import Link from "next/link";
import { notFound, usePathname, useRouter } from "next/navigation";
import { Fragment, ReactNode } from "react";
import { Button } from "../Button";
import { PhotoPreview } from "../PhotoPreview";
import { InfoBox } from "./InfoBox";
import { InformationField } from "./InformationField";
import { InsurancesCovered } from "./InsurancesCovered";
import { ReviewItem } from "./ReviewItem";
import styles from "./style.module.css";

type ProfilePageFieldsProps = {
  data: DoctorProfile | ClinicProfile;
  user?: DoctorProfile | ClinicProfile | PatientProfile | User | null;
  reviews: Review[];
};

function ProfilePageFields({ data, user, reviews }: ProfilePageFieldsProps) {
  const { open, close } = useSidePane();
  const router = useRouter();

  function handleBookAppointment() {
    if (data.type === "doctor") {
      open(
        <AppointmentBooking data={data} onCancel={close} />,
        "Book appointment"
      );
    }
  }

  function handleEditProfile() {
    router.push(`/settings/${data.id}`);
  }

  let actions: ReactNode[] = [];

  if (!user) {
    actions = [];
  } else if (user.type === "patient") {
    actions = [
      // <Button key="save" size="medium">
      //   Save Profile
      // </Button>,
      <Button
        key="book"
        variant="primary"
        size="medium"
        onClick={handleBookAppointment}
      >
        Book Appointment
      </Button>,
    ];
  } else if (user.type === "admin") {
    actions = [
      <Button
        key="edit"
        variant="clear"
        size="medium"
        onClick={handleEditProfile}
      >
        Edit Profile
      </Button>,
      <Button key="delete" variant="clear" size="medium">
        Delete
      </Button>,
      <Button key="generatePassword" variant="clear" size="medium">
        Auto-generate Password
      </Button>,
    ];
  }

  function getTopBoxFields() {
    const fields: HealthcareBoxProps["fields"] = [
      { name: "photo" },
      { name: "name" },
      { name: "category" },
      { name: "location", icon: true },
      { name: "availabilityToday", icon: true },
      { name: "rating" },
    ];

    if (data?.type === "clinic") {
      fields.push({
        name: "affiliatedDoctors",
      });
    }

    return fields;
  }

  function renderAddresses() {
    if (data.type === "clinic") {
      return <p>{data.location.text}</p>;
    }

    return (
      <>
        {data.clinics.map((clinic) => (
          <Fragment key={clinic.id}>
            <div className={styles["sublabel-container"]}>
              <strong>{clinic.name}</strong>
            </div>
            <p>{clinic.location.text}</p>
          </Fragment>
        ))}
      </>
    );
  }

  function renderAvailability(data: Availability[]): ReactNode {
    return Array.from(new Array(7)).map((__, weekday) => {
      const availabilityCurrentWeekday = data.filter(
        (d) => d.weekday === weekday
      );

      const earliestStart = _.minBy(
        availabilityCurrentWeekday,
        (availability) => dayjs(availability.start, "HH:mm:ss").unix()
      );

      const latestEnd = _.maxBy(availabilityCurrentWeekday, (availability) =>
        dayjs(availability.end, "HH:mm:ss").unix()
      );

      return (
        <div key={weekday} className={styles["info-two-column"]}>
          <p>{dayjs().day(weekday).format("dddd")}</p>
          <p>
            {earliestStart?.start && latestEnd?.end
              ? formatTimeblock({
                  start: earliestStart.start,
                  end: latestEnd.end,
                })
              : "No schedule available."}
          </p>
        </div>
      );
    });
  }

  function renderSchedule(data: DoctorProfile | ClinicProfile): ReactNode {
    if (data.type === "clinic") {
      return renderAvailability(data.availability);
    }

    const availabilityPerClinic = _.groupBy(
      data.availabilityPerClinic,
      (doctorAvailability) => doctorAvailability.clinic.id
    );

    return Object.values(availabilityPerClinic).map((doctorAvailability) => (
      <Fragment key={doctorAvailability[0]?.clinic.id ?? "unknown-clinic"}>
        <div className={styles["sublabel-container"]}>
          <strong>{doctorAvailability[0]?.clinic.name ?? "Clinic"}</strong>
        </div>
        {renderAvailability(doctorAvailability.map((d) => d.availability))}
      </Fragment>
    ));
  }

  return (
    <div className={styles.wrapper}>
      <div className={classNames(styles["doctor-info-container"], "white-box")}>
        <HealthcareBox
          data={data}
          fields={getTopBoxFields()}
          direction="column"
          hasContainer={false}
          actions={actions}
        />
      </div>
      <div className={styles["info-boxes-container"]}>
        <div>
          <InfoBox label="Overview">
            <InformationField icon={<LocationIcon />} label="Address">
              {renderAddresses()}
            </InformationField>
            <InformationField icon={<ContactIcon />} label="Contact">
              <div className={styles["info-two-column"]}>
                <div>
                  <div className={styles["sublabel-container"]}>
                    <strong>Mobile</strong>
                  </div>
                  <p>{data.contactNumber}</p>
                </div>
                <div>
                  <div className={styles["sublabel-container"]}>
                    <strong>Email</strong>
                  </div>
                  <p>{data.email}</p>
                </div>
              </div>
            </InformationField>
            <InformationField icon={<ClockOutlineIcon />} label="Schedule">
              {renderSchedule(data)}
            </InformationField>
          </InfoBox>
          {data.type === "clinic" ? (
            <InsurancesCovered data={data.insurances} type="clinic" />
          ) : (
            <InsurancesCovered data={data.insurancesPerClinic} type="doctor" />
          )}

          <InfoBox
            label="Reviews"
            actions={
              reviews.length
                ? [
                    <Link
                      key="viewAll"
                      href={`/${
                        data.type === "clinic" ? "clinics" : "doctors"
                      }/${data.id}/reviews`}
                    >
                      View all
                    </Link>,
                  ]
                : undefined
            }
          >
            <div>
              {reviews.length === 0 && <p>This user has no reviews yet.</p>}
              {reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
          </InfoBox>
        </div>
        <div>
          <InfoBox label="About Me">{data.bio}</InfoBox>
          <InfoBox label="Treatment">
            <HealthcareField data={data} field="category" icon />
          </InfoBox>
          <div>
            <InfoBox label="Photos">
              <div className={styles["photo-previews-container"]}>
                {data.photosUrl.length === 0 && <p>No photos available.</p>}
                {data.photosUrl.map((photo) => (
                  <PhotoPreview key={photo} url={photo} />
                ))}
              </div>
            </InfoBox>
          </div>
        </div>
      </div>
    </div>
  );
}

const REVIEWS_PREVIEW_LIMIT = 5;

type ProfilePageProps = {
  id: string;
};

export function ProfilePage({ id }: ProfilePageProps) {
  const pathname = usePathname();

  const { data: user } = useQuery(["currentUser"], {
    queryFn: () => getCurrentUser().then((response) => response.data),
  });

  const { data, isFetched } = useQuery(["profile", id], {
    queryFn: () =>
      getUser<DoctorProfile | PatientProfile | null>(id).then((response) =>
        "error" in response ? null : response.data
      ),
  });

  const { data: reviewsData } = useQuery(
    ["reviews", id, REVIEWS_PREVIEW_LIMIT],
    {
      queryFn: () => {
        return getReviews(id, {
          limit: REVIEWS_PREVIEW_LIMIT,
        }).then((response) => ("error" in response ? [] : response.data));
      },
    }
  );

  if ((!data && isFetched) || data?.type === "patient") {
    notFound();
  }

  const title = `${
    pathname.startsWith("/doctors") ? "Doctor" : "Clinic"
  }'s Profile`;
  const backUrl: string | -1 =
    user && user.type === "admin" ? "/search/doctor" : -1;

  return (
    <Page title={title} backUrl={backUrl}>
      {data && reviewsData && (
        <ProfilePageFields data={data} user={user} reviews={reviewsData} />
      )}
    </Page>
  );
}
