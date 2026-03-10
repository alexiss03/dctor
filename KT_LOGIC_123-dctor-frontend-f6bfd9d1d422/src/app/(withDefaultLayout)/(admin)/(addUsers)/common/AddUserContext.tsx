"use client";

import {
  CreateClinicInput,
  CreateDoctorClinicField,
  CreateDoctorInput,
  createClinic,
  createDoctor,
} from "@/backendServer/admin";
import { usePrompt } from "@/hooks/usePrompt";
import { SuccessCheckIcon } from "@/icons/successCheck";
import { Availability, BaseClinic, ClinicProfile } from "@/types/healthcare";
import _ from "lodash";
import { useRouter } from "next/navigation";
import {
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

type Step = {
  title: string;
  render: ReactNode;
};

type AddUserContextOutput = [
  {
    formData: FormData;
    currentStep: Step;
    currentStepIndex: number;
  },
  {
    back: () => void;
    next: () => void;
    getSelectedClinics: () =>
      | (BaseClinic & Pick<ClinicProfile, "categories">)[]
      | null;
  }
];

const AddUserContext = createContext<AddUserContextOutput | undefined>(
  undefined
);

export function useAddUser() {
  const context = useContext(AddUserContext);

  if (!context) {
    throw new Error("useAddUser must be used within an AddUserContext");
  }

  return context;
}

type AddUserProviderProps = {
  steps: Step[];
  clinics: (BaseClinic & Pick<ClinicProfile, "categories">)[];
};

export function AddUserProvider({
  children,
  steps,
  clinics,
}: PropsWithChildren<AddUserProviderProps>) {
  const router = useRouter();
  const { prompt, errorPrompt } = usePrompt();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const formData = useRef(new FormData());

  function handleBack() {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((currentStep) => currentStep - 1);
    }
  }

  async function handleNext() {
    if (currentStepIndex === steps.length - 1) {
      const formObject: Record<
        string,
        FormDataEntryValue | FormDataEntryValue[]
      > = {};

      for (const pair of formData.current.entries()) {
        if (formObject[pair[0]]) {
          if (Array.isArray(formObject[pair[0]])) {
            (formObject[pair[0]] as FormDataEntryValue[]).push(pair[0]);
          } else {
            formObject[pair[0]] = [
              formObject[pair[0]] as FormDataEntryValue,
              pair[1],
            ];
          }
        } else {
          formObject[pair[0]] = pair[1];
        }
      }

      const clinicIds = formData.current.getAll("clinics");

      // doctor creation
      if (clinicIds.length) {
        const response = await createDoctor(formatDoctorFields(formObject));

        if ("error" in response) {
          errorPrompt();

          return;
        }

        const newDoctor = response.data;

        prompt({
          icon: <SuccessCheckIcon />,
          message: "Doctor added!",
          description: "Auto-generated password has been sent.",
        });

        router.push(`/doctors/${newDoctor.id}`);
      }

      // clinic
      else {
        const response = await createClinic(formatClinicFields(formObject));

        if ("error" in response) {
          errorPrompt();

          return;
        }

        const newClinic = response.data;

        prompt({
          icon: <SuccessCheckIcon />,
          message: "Clinic added!",
          description: "Auto-generated password has been sent.",
        });

        router.push(`/clinics/${newClinic.id}`);
      }

      return;
    }

    setCurrentStepIndex((currentStep) => currentStep + 1);
  }

  function getSelectedClinics() {
    const clinicIds = formData.current.getAll("clinics");

    if (!clinicIds.length) {
      return null;
    }

    const selectedClinics = clinics.filter((clinic) =>
      clinicIds.includes(clinic.id)
    );

    return selectedClinics;
  }

  return (
    <AddUserContext.Provider
      value={[
        {
          formData: formData.current,
          currentStep: steps[currentStepIndex],
          currentStepIndex: currentStepIndex,
        },
        {
          back: handleBack,
          next: handleNext,
          getSelectedClinics,
        },
      ]}
    >
      {children}
    </AddUserContext.Provider>
  );
}

function formatDoctorFields(
  formObject: Record<string, FormDataEntryValue | FormDataEntryValue[]>
): CreateDoctorInput {
  if (!Array.isArray(formObject.clinics)) {
    formObject.clinics = [formObject.clinics];
  }

  const clinicsFields: CreateDoctorClinicField[] = (
    formObject.clinics as string[]
  ).map((clinicId) => {
    let insuranceIds = formObject[`insurances/${clinicId}`] as
      | string
      | string[];

    if (!Array.isArray(insuranceIds)) {
      insuranceIds = [insuranceIds] as string[];
    }

    const schedule: Availability[] = _(formObject)
      .pickBy((_, key) => new RegExp(`^weekday\/${clinicId}\/\\d+$`).test(key))
      .map((_, key) => {
        return key.split("/")[2];
      })
      .map((_weekday) => {
        const weekday = parseInt(_weekday);

        const start = `${(
          formObject[`time/${clinicId}/${weekday}/start`] as string
        ).padStart(2, "0")}:00:00`;
        const end = `${(
          formObject[`time/${clinicId}/${weekday}/end`] as string
        ).padStart(2, "0")}:00:00`;

        return {
          weekday,
          start,
          end,
        };
      })
      .value();

    let treatmentIds = formObject[`treatments/${clinicId}`] as
      | string
      | string[];

    if (!Array.isArray(treatmentIds)) {
      treatmentIds = [treatmentIds] as string[];
    }

    const treatments = treatmentIds.map((treatmentId) => ({
      treatmentId,
      price: parseInt(
        (formObject[`price/${clinicId}/${treatmentId}`] as string).replaceAll(
          ",",
          ""
        )
      ),
    }));

    return {
      clinicId,
      insuranceIds,
      schedule,
      treatments,
    };
  });

  return {
    firstName: formObject.firstName as string,
    lastName: formObject.lastName as string,
    email: formObject.email as string,
    contactNumber: formObject.contactNumber as string,
    bio: formObject.bio as string,
    // photo: formObject.photo as string,
    clinics: clinicsFields,
    gender: formObject.gender as "M" | "F",
    birthday: formObject.birthday as string,
  };
}

function formatClinicFields(
  formObject: Record<string, FormDataEntryValue | FormDataEntryValue[]>
): CreateClinicInput {
  let insuranceIds = formObject[`insurances`] as string | string[];

  if (!Array.isArray(insuranceIds)) {
    insuranceIds = [insuranceIds] as string[];
  }

  const schedule: Availability[] = _(formObject)
    .pickBy((_, key) => new RegExp(`^weekday\/\\d+$`).test(key))
    .map((_, key) => {
      return key.split("/")[1];
    })
    .map((_weekday) => {
      const weekday = parseInt(_weekday);

      const start = `${(formObject[`time/${weekday}/start`] as string).padStart(
        2,
        "0"
      )}:00:00`;
      const end = `${(formObject[`time/${weekday}/end`] as string).padStart(
        2,
        "0"
      )}:00:00`;

      return {
        weekday,
        start,
        end,
      };
    })
    .value();

  let treatmentIds = formObject[`treatments`] as string | string[];

  if (!Array.isArray(treatmentIds)) {
    treatmentIds = [treatmentIds] as string[];
  }

  const treatments = treatmentIds.map((treatmentId) => ({
    treatmentId,
    price: parseInt(
      (formObject[`price/${treatmentId}`] as string).replaceAll(",", "")
    ),
  }));

  return {
    user: {
      firstName: formObject.firstName as string,
      lastName: formObject.lastName as string,
      gender: formObject.gender as "M" | "F",
      email: formObject.email as string,
      birthday: formObject.birthday as string,
      contactNumber: formObject.contactNumber as string,
    },
    clinic: {
      name: formObject.clinicName as string,
      email: formObject.clinicEmail as string,
      contactNumber: formObject.clinicContactNumber as string,
      bio: formObject.bio as string,
    },
    location: {
      address: formObject.address as string,
      latitude: parseFloat(formObject.latitude as string),
      longitude: parseFloat(formObject.longitude as string),
    },
    // photo: string, // @TODO: handle image uploads
    insuranceIds,
    schedule,
    treatments,
  };
}
