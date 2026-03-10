"use client";

import { getClinics, getTreatments } from "@/backendServer/healthcare";
import { getInsurances } from "@/backendServer/insurance";
import { getCurrentUser } from "@/backendServer/user";
import { CalendarOutlineIcon } from "@/icons/calendarOutline";
import { ClockOutlineIcon } from "@/icons/clockOutline";
import { ConditionIcon } from "@/icons/condition";
import { ContactIcon } from "@/icons/contact";
import { LocationIcon } from "@/icons/location";
import { Appointment } from "@/types/appointment";
import {
  BaseClinic,
  BaseDoctor,
  ClinicProfile,
  DoctorProfile,
  DoctorTreatment,
  HealthcareTreatment,
} from "@/types/healthcare";
import { DoctorInsurance, Insurance } from "@/types/insurance";
import { BasePatient, PatientProfile } from "@/types/patient";
import { SearchResult } from "@/types/search";
import {
  formatAvailabilitiesToday,
  formatDate,
  formatTimeblock,
  getAvailabilityTodayText,
} from "@/utils/date";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import _ from "lodash";
import Link from "next/link";
import { Fragment, ReactNode } from "react";
import { AppointmentStatus } from "../AppointmentStatus";
import { ButtonSelect } from "../ButtonSelect";
import { DatePicker } from "../DatePicker";
import { Input } from "../Input";
import { PhotoPreviewGroup } from "../PhotoPreviewGroup";
import { Rating } from "../Rating";
import { Select } from "../Select";
import { TextArea } from "../TextArea";
import { TreatmentItem } from "../TreatmentItem";
import { UserAvatar } from "../UserAvatar";
import styles from "./style.module.css";

export type HealthcareFieldProps = {
  data:
    | BaseDoctor
    | DoctorProfile
    | BaseClinic
    | ClinicProfile
    | Appointment
    | SearchResult
    | (BasePatient & Partial<PatientProfile>);
  field:
    | "photo"
    | "firstName"
    | "lastName"
    | "name"
    | "category"
    | "location"
    | "date"
    | "time"
    | "rating"
    | "insurance"
    | "status"
    | "condition"
    | "doctorsNotes"
    | "affiliatedDoctors"
    | "availabilityToday"
    | "birthday"
    | "gender"
    | "email"
    | "accountInfo"
    | "notificationSettings"
    | "password"
    | "clinics"
    | "photos"
    | "bio"
    | "contactNumber";
  icon?: boolean;
  label?: boolean;
  edit?: boolean;
  contextRole?: "doctor" | "patient" | "clinic";
};

const fieldIconMap: {
  [key in HealthcareFieldProps["field"]]: ReactNode;
} = {
  photo: null,
  firstName: null,
  lastName: null,
  name: null,
  category: null,
  location: <LocationIcon />,
  date: <CalendarOutlineIcon />,
  time: <ClockOutlineIcon />,
  rating: null,
  insurance: null,
  status: null,
  condition: <ConditionIcon />,
  doctorsNotes: null,
  affiliatedDoctors: null,
  availabilityToday: <ClockOutlineIcon />,
  birthday: null,
  gender: null,
  email: null,
  accountInfo: null,
  notificationSettings: null,
  password: null,
  clinics: null,
  photos: null,
  bio: null,
  contactNumber: <ContactIcon />,
};

const fieldLabelMap: {
  [key in HealthcareFieldProps["field"]]: string;
} = {
  photo: "Profile Picture",
  firstName: "First name",
  lastName: "Last name",
  name: "Name",
  category: "Treatments",
  location: "Location",
  date: "Date",
  time: "Time",
  rating: "Rating",
  insurance: "Insurance",
  status: "Status",
  condition: "Condition",
  doctorsNotes: `Doctor's notes`,
  affiliatedDoctors: "Affiliated doctors",
  availabilityToday: "Schedule today",
  birthday: "Birthday",
  gender: "Gender",
  email: "Email",
  accountInfo: "Account info",
  notificationSettings: "Notification settings",
  password: "Password",
  clinics: "Affiliated clinics",
  photos: "Photos",
  bio: "About me",
  contactNumber: "Contact number",
};

export function HealthcareField({
  data,
  field,
  icon,
  label,
  edit,
  contextRole,
}: HealthcareFieldProps) {
  const { data: allInsurances = [] } = useQuery(["insurances"], {
    queryFn: () =>
      getInsurances().then((response) =>
        "error" in response ? [] : response.data
      ),
  });

  const { data: allTreatments = [] } = useQuery(["treatments"], {
    queryFn: () =>
      getTreatments().then((response) =>
        "error" in response ? [] : response.data
      ),
  });

  const { data: allClinics = [] } = useQuery(["clinics"], {
    queryFn: () =>
      getClinics().then((response) =>
        "error" in response ? [] : response.data
      ),
  });

  const { data: currentUser } = useQuery(["currentUser"], {
    queryFn: () => getCurrentUser().then((response) => response.data),
  });

  const isOwnData = data.id === currentUser?.id;

  function renderName(name: string, fieldName?: string) {
    if (edit) {
      return (
        <Input type="text" name={fieldName ?? "name"} defaultValue={name} />
      );
    }

    return name;
  }

  function renderBirthday(birthday: string) {
    if (edit) {
      return (
        <DatePicker
          name="birthday"
          initialValue={new Date(birthday)}
          full
          format="YYYY-MM-DD"
        />
      );
    }

    return formatDate(birthday);
  }

  function renderGender(gender: "M" | "F") {
    if (edit) {
      return (
        <ButtonSelect
          name="gender"
          options={[
            { value: "M", text: "Male" },
            { value: "F", text: "Female" },
          ]}
          defaultValue={gender}
        />
      );
    }

    return gender === "M" ? "Male" : "Female";
  }

  function renderUserAvatar(src: string, name: string) {
    return (
      <div
        className={classNames(styles["user-avatar-container"], {
          [styles["with-top-margin"]]: !!label,
        })}
      >
        {!edit ? (
          <UserAvatar src={src} circle name={name} />
        ) : (
          <Input
            name="photo"
            type="image"
            text="Upload profile picture"
            defaultValue={src}
          />
        )}
      </div>
    );
  }

  function renderCategories(
    treatments: HealthcareTreatment[] | DoctorTreatment[]
  ): ReactNode {
    if ("clinic" in (treatments[0] ?? {})) {
      const _treatments = treatments as DoctorTreatment[];

      const clinicGroup = _(_treatments)
        .groupBy((treatment) => treatment.clinic.id)
        .values();

      return clinicGroup
        .map((value) => ({
          clinic: value[0].clinic,
          treatments: value.map((v) => v.treatment),
        }))
        .map((value) => (
          <Fragment key={value.clinic.id}>
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>{value.clinic.name}</strong>
            </p>
            {renderCategories(value.treatments)}
          </Fragment>
        ))
        .value();
    } else {
      const _treatments = treatments as HealthcareTreatment[];

      if (edit) {
        return (
          <Select
            name="treatments"
            isMulti
            options={allTreatments.map((treatment) => ({
              value: treatment.id,
              label: treatment.name,
            }))}
            defaultValue={_treatments.map((treatment) => ({
              value: treatment.id,
              label: treatment.name,
            }))}
          />
        );
      }

      if (icon) {
        return _treatments.map((category) => (
          <TreatmentItem key={category.id} treatment={category} />
        ));
      }

      return _treatments.map((category) => (
        <p key={category.id}>{category.name}</p>
      ));
    }
  }

  function renderInsurances(
    insurances: Insurance[] | DoctorInsurance[]
  ): ReactNode {
    if ("clinic" in (insurances[0] ?? {})) {
      const _insurances = insurances as DoctorInsurance[];

      const clinicGroup = _(_insurances)
        .groupBy((doctorInsurance) => doctorInsurance.clinic.id)
        .values();

      return clinicGroup
        .map((value) => ({
          clinic: value[0].clinic,
          insurances: value.map((v) => v.insurance),
        }))
        .map((value) => (
          <Fragment key={value.clinic.id}>
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>{value.clinic.name}</strong>
            </p>
            {renderInsurances(value.insurances)}
          </Fragment>
        ))
        .value();
    } else {
      const _insurances = insurances as Insurance[];

      if (edit) {
        return (
          <Select
            name="insurances"
            isMulti
            options={allInsurances.map((insurance) => ({
              value: insurance.id,
              label: insurance.name,
            }))}
            defaultValue={_insurances.map((insurance) => ({
              value: insurance.id,
              label: insurance.name,
            }))}
          />
        );
      }

      if (_insurances.length === 0) {
        return "No insurance";
      }

      return _insurances.map((insurance) => {
        const covered =
          currentUser &&
          "insurances" in currentUser &&
          currentUser.insurances
            .map((insurance) => insurance.id)
            .includes(insurance.id);

        return (
          <p key={insurance.id}>
            {insurance.name}
            {covered && !isOwnData ? (
              <span style={{ color: "#5757ff" }}> (you are covered here)</span>
            ) : (
              ""
            )}
          </p>
        );
      });
    }
  }

  function renderPassword() {
    const userId = currentUser?.id !== data.id ? data.id : "self";

    return (
      <Link href={`/settings/${userId}/edit/password`}>Change Password</Link>
    );
  }

  function renderClinics(clinics: BaseClinic[]) {
    if (edit) {
      return (
        <Select
          name="clinics"
          isMulti
          options={allClinics.map((clinic) => ({
            value: clinic.id,
            label: clinic.name,
          }))}
          defaultValue={clinics.map((clinic) => ({
            value: clinic.id,
            label: clinic.name,
          }))}
        />
      );
    }

    return clinics.map((clinic) => <p key={clinic.id}>{clinic.name}</p>);
  }

  function renderValue() {
    // clinic
    if ("type" in data && data.type === "clinic") {
      const fieldValueMap: {
        [key in HealthcareFieldProps["field"]]: ReactNode;
      } = {
        photo: renderUserAvatar(data.avatarUrl, data.name),
        firstName: null,
        lastName: null,
        name: renderName(data.name),
        category:
          "categories" in data ? renderCategories(data.categories) : null,
        location: "location" in data ? data.location.text : null,
        date: null,
        time: null,
        rating:
          "rating" in data && data.rating.score ? (
            <Rating
              score={data.rating.score}
              reviewsCount={data.rating.reviewsCount}
            />
          ) : null,
        insurance: null,
        status: null,
        condition: null,
        doctorsNotes: null,
        affiliatedDoctors: (
          <Link href={`/clinics/${data.id}/doctors`}>
            View affiliated doctors
          </Link>
        ),
        // @TODO:
        // availabilityToday:
        //   "availability" in data
        //     ? getAvailabilityTodayText(data.availability)
        //     : null,
        availabilityToday: null,
        birthday: null,
        gender: null,
        email: "email" in data ? data.email : null,
        accountInfo: null,
        notificationSettings: null,
        password: renderPassword(),
        clinics: null,
        photos:
          "photosUrl" in data ? (
            <PhotoPreviewGroup urls={data.photosUrl} />
          ) : null,
        bio: "bio" in data ? data.bio : null,
        contactNumber: "contactNumber" in data ? data.contactNumber : null,
      };

      return fieldValueMap[field];
    }

    // appointment (patient)
    else if ("status" in data && contextRole === "patient") {
      const fieldValueMap: {
        [key in HealthcareFieldProps["field"]]: ReactNode;
      } = {
        photo: renderUserAvatar(
          data.patient.avatarUrl,
          data.patient.displayName
        ),
        firstName: renderName(data.patient.firstName, "firstName"),
        lastName: renderName(data.patient.lastName, "lastName"),
        name: renderName(data.patient.displayName),
        category: renderCategories(data.doctor.categories),
        location: data.clinic.location.text,
        date: formatDate(data.timeblock.start),
        time: formatTimeblock(data.timeblock),
        rating: data.reviewScore ? <Rating score={data.reviewScore} /> : null,
        insurance: renderInsurances(data.patient.insurances),
        status: <AppointmentStatus status={data.status} />,
        condition: data.condition,
        doctorsNotes: !edit ? (
          data.doctorsNotes
        ) : (
          <TextArea
            name="doctorsNotes"
            defaultValue={data.doctorsNotes || ""}
          />
        ),
        affiliatedDoctors: null,
        availabilityToday: null,
        birthday: null,
        gender: null,
        email: null,
        accountInfo: null,
        notificationSettings: null,
        password: renderPassword(),
        clinics: null,
        photos: null,
        bio: null,
        contactNumber: null,
      };

      return fieldValueMap[field];
    }

    // appointment (doctor/clinic)
    else if ("status" in data) {
      const fieldValueMap: {
        [key in HealthcareFieldProps["field"]]: ReactNode;
      } = {
        photo: renderUserAvatar(data.doctor.avatarUrl, data.doctor.displayName),
        firstName: renderName(data.doctor.firstName, "firstName"),
        lastName: renderName(data.doctor.lastName, "lastName"),
        name: renderName(data.doctor.displayName),
        category: renderCategories(data.doctor.categories),
        location: data.clinic.location.text,
        date: formatDate(data.timeblock.start),
        time: formatTimeblock(data.timeblock),
        rating: data.reviewScore ? <Rating score={data.reviewScore} /> : null,
        insurance: renderInsurances(data.doctor.insurancesPerClinic),
        status: <AppointmentStatus status={data.status} />,
        condition: data.condition,
        doctorsNotes: !edit ? (
          data.doctorsNotes
        ) : (
          <TextArea
            name="doctorsNotes"
            defaultValue={data.doctorsNotes || ""}
          />
        ),
        affiliatedDoctors: null,
        availabilityToday: null,
        birthday: null,
        gender: null,
        email: null,
        accountInfo: null,
        notificationSettings: null,
        password: renderPassword(),
        clinics: null,
        photos: null,
        bio: data.doctor.bio,
        contactNumber: data.doctor.contactNumber,
      };

      return fieldValueMap[field];
    }

    // search result
    else if ("doctor" in data && "clinic" in data) {
      const fieldValueMap: {
        [key in HealthcareFieldProps["field"]]: ReactNode;
      } = {
        photo: renderUserAvatar(data.doctor.avatarUrl, data.doctor.displayName),
        firstName: null,
        lastName: null,
        name: renderName(data.doctor.displayName),
        category: renderCategories(data.doctor.categories),
        location: data.clinic.location.text,
        date: data.doctor.availability[0]
          ? formatDate(data.doctor.availability[0].start)
          : null,
        time: data.doctor.availability[0]
          ? formatAvailabilitiesToday(data.doctor.availability)
          : null,
        rating: data.doctor.rating.score ? (
          <Rating
            score={data.doctor.rating.score}
            reviewsCount={data.doctor.rating.reviewsCount}
          />
        ) : null,
        insurance: renderInsurances(data.doctor.insurances),
        status: null,
        condition: null,
        doctorsNotes: null,
        affiliatedDoctors: null,
        availabilityToday: null,
        birthday: null,
        gender: null,
        email: null,
        accountInfo: null,
        notificationSettings: null,
        password: renderPassword(),
        clinics: null,
        photos: null,
        bio: null,
        contactNumber: data.doctor.contactNumber,
      };

      return fieldValueMap[field];
    }
    // patient
    else if (data.type === "patient") {
      const fieldValueMap: {
        [key in HealthcareFieldProps["field"]]: ReactNode;
      } = {
        photo: renderUserAvatar(data.avatarUrl, data.displayName),
        firstName: renderName(data.firstName, "firstName"),
        lastName: renderName(data.lastName, "lastName"),
        name: renderName(data.displayName),
        category: null,
        location: null,
        date: null,
        time: null,
        rating: null,
        insurance:
          "insurances" in data && data.insurances
            ? renderInsurances(data.insurances)
            : null,
        status: null,
        condition: null,
        doctorsNotes: null,
        affiliatedDoctors: null,
        availabilityToday: null,
        birthday:
          "birthday" in data && data.birthday
            ? renderBirthday(data.birthday)
            : null,
        gender:
          "gender" in data && data.gender ? renderGender(data.gender) : null,
        email: "email" in data ? data.email : null,
        accountInfo: (data.dateCreated || data.dateLastOnline) && (
          <>
            {data.dateCreated && (
              <div className="two-column">
                <p>Date Created:</p>
                <strong>{formatDate(data.dateCreated)}</strong>
              </div>
            )}

            {data.dateLastOnline && (
              <div className="two-column">
                <p>Last Online:</p>
                <strong>{formatDate(data.dateLastOnline)}</strong>
              </div>
            )}

            <div className="two-column">
              <p>ID:</p>
              <strong>{data.id}</strong>
            </div>
          </>
        ),
        notificationSettings:
          "isPushNotificationsEnabled" in data ? (
            <>
              <div className="two-column">
                <p>Push Notification:</p>
                <strong>
                  {data.isPushNotificationsEnabled ? "Enabled" : "Disabled"}
                </strong>
              </div>
              <div className="two-column">
                <p>Email Notification:</p>
                <strong>
                  {data.isEmailNotificationsEnabled ? "Enabled" : "Disabled"}
                </strong>
              </div>
            </>
          ) : null,
        password: renderPassword(),
        clinics: null,
        photos: null,
        bio: null,
        contactNumber: null,
      };

      return fieldValueMap[field];
    }

    // doctor
    else {
      const fieldValueMap: {
        [key in HealthcareFieldProps["field"]]: ReactNode;
      } = {
        photo: renderUserAvatar(data.avatarUrl, data.displayName),
        firstName: renderName(data.firstName, "firstName"),
        lastName: renderName(data.lastName, "lastName"),
        name: renderName(data.displayName),
        category:
          "treatmentsPerClinic" in data
            ? renderCategories(data.treatmentsPerClinic)
            : null,
        // @TODO: handle multiple clinics
        location: "clinics" in data ? data.clinics[0].location.text : null,
        date: null,
        time: null,
        rating:
          "rating" in data && data.rating.score ? (
            <Rating
              score={data.rating.score}
              reviewsCount={data.rating.reviewsCount}
            />
          ) : null,
        insurance:
          "insurancesPerClinic" in data
            ? renderInsurances(data.insurancesPerClinic)
            : null,
        status: null,
        condition: null,
        doctorsNotes: null,
        affiliatedDoctors: null,
        availabilityToday:
          "availabilityPerClinic" in data
            ? getAvailabilityTodayText(
                data.availabilityPerClinic.map((d) => d.availability)
              )
            : null,
        birthday: null,
        gender: null,
        email: "email" in data ? data.email : null,
        accountInfo: null,
        notificationSettings: null,
        password: renderPassword(),
        clinics: "clinics" in data ? renderClinics(data.clinics) : null,
        photos:
          "photosUrl" in data ? (
            <PhotoPreviewGroup urls={data.photosUrl} />
          ) : null,
        bio: "bio" in data ? data.bio : null,
        contactNumber: "contactNumber" in data ? data.contactNumber : null,
      };

      return fieldValueMap[field];
    }
  }

  const iconIsSmall = !label;
  const valueIsSmallText = !label && field !== "rating";
  const valueIsLarge = field === "name" && !icon && !label;

  const renderedValue = renderValue();

  if (
    !renderedValue ||
    (Array.isArray(renderedValue) && renderedValue.length === 0)
  ) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {icon && fieldIconMap[field] && (
        <div
          className={classNames(styles["icon-container"], {
            [styles["small-icon"]]: iconIsSmall,
          })}
        >
          {fieldIconMap[field]}
        </div>
      )}
      <div className={styles["label-value-container"]}>
        {label && fieldLabelMap[field] && (
          <div className={classNames(styles.label, styles["small-text"])}>
            {fieldLabelMap[field]}
          </div>
        )}
        <div
          className={classNames(styles.value, {
            [styles["small-text"]]: !valueIsLarge && valueIsSmallText,
            [styles["large-text"]]: valueIsLarge,
          })}
        >
          {renderedValue}
        </div>
      </div>
    </div>
  );
}
