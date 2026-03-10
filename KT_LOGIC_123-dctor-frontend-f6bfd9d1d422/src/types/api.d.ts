type DoctorBaseAPI = {
  doctor: {
    name: string;
    id: string;
  };
};

type TreatmentAPI = {
  price: number;
  treatment: {
    name: string;
    cpt_code: string;
  };
  id: string;
  currency: string;
};

type AvailabilityAPI = {
  weekday: number;
  time_start: string;
  rule: unknown;
  time_end: string;
};

type AvailabilitySlotAPI = {
  is_available: boolean;
  dtstart: string;
  dtend: string;
  clinic_id: string;
};

type LocationAPI = {
  longitude: number;
  address_line: string;
  latitude: number;
};

type FacilityAPI = {
  name: string;
  doctors: DoctorBaseAPI[];
  avatar: string;
  reviews_received_stats: {
    aggregate: {
      count: number;
      avg: {
        rating: number | null;
      };
    };
  };
};

type GetInsurancesResultAPI = {
  emirates: string;
  uuid: string;
  name: string;
};

type InsuranceAPI = {
  emirates: string;
  id: string;
  name: string;
};

type HealthFacilityAPI = {
  treatments: TreatmentAPI[] | NonNullable<unknown>;
  availability: AvailabilityAPI[] | NonNullable<unknown>;
  insurance_list: { insurance: InsuranceAPI }[] | NonNullable<unknown>;
  facility: {
    id: string;
    name: string;
    attributes: {
      addresses: LocationAPI[] | NonNullable<unknown>;
    };
  };
};

type UserAPI = {
  avatar: string;
  phone: string;
  reviews_received_stats: {
    aggregate: {
      count: number;
      avg: {
        rating: number | null;
      };
    };
  };
  health_facilities: HealthFacilityAPI[] | NonNullable<unknown>;
};

type SearchResultClinicAPI = {
  availability: AvailabilityAPI[];
  addresses: LocationAPI[];
  insurance_list: InsuranceAPI[];
  user: null;
  facility: FacilityAPI;
  treatments: TreatmentAPI[];
  name: string;
  source_id: string;
  source_type: "clinic";
};

type SearchResultDoctorAPI = {
  treatments: TreatmentAPI[] | NonNullable<unknown>;
  availability: AvailabilityAPI[] | NonNullable<unknown>;
  addresses: LocationAPI[] | NonNullable<unknown>;
  name: string;
  facility: null;
  source_id: string;
  source_type: "doctor";
  insurance_list: { insurance: InsuranceAPI }[] | NonNullable<unknown>;
  user: UserAPI;
};

type SearchResultPatientAPI = {
  user: {
    phone: string;
    reviews_received_stats: {
      aggregate: {
        avg: {
          rating: null;
        };
        count: 0;
      };
    };
    health_facilities: [];
    avatar: string;
  };
  source_id: string;
  facility: null;
  source_type: "patient";
  addresses: [];
  treatments: [];
  availability: [];
  insurance_list: { insurance: InsuranceAPI }[];
  name: string;
};

export type SearchResultAPI =
  | SearchResultClinicAPI
  | SearchResultDoctorAPI
  | SearchResultPatientAPI;

type AttendeeAPI = {
  id: string;
  status: null;
  attendee_id: string;
};

export type AppointmentAPI = {
  id: string;
  dtstart: string;
  dtend: string;
  notes: string | null;
  status: "incoming" | "ongoing" | "completed" | "cancelled";
  condition: string;
  clinic_id: string;
  attendees: AttendeeAPI[];
};

export type GetUserResultAPI = {
  id: string;
  roles: string[];
  avatar: string;
  availability_calendar: AvailabilitySlotAPI[] | NonNullable<unknown>;
  insurance_list: NonNullable<unknown> | InsuranceAPI[];
  bio: string;
  name: string;
  first_name: string;
  last_name: string;
  tag: string;
  health_facilities: HealthFacilityAPI[] | NonNullable<unknown>;
  phone: string;
  email: string;
  birthday: string;
  gender: "M" | "F";
  properties?: {
    notification_reminder: number;
    push_notifications: boolean;
    email_notifications: boolean;
  };
};

export type GetTreatmentsResultAPI = {
  category: {
    id: string;
    name: string;
  };
  cpt_code: string;
  name: string;
  uuid: string;
};

export type TreatmentCategoryAPI = {
  id: string;
  name: string;
  icon_url: string;
  attributes: {
    bg_color: string;
    card_type: "default" | "categories";
  };
};

export type TreatmentSectionAPI = {
  id: string;
  name: string;
  icon_url: string;
  parent: null;
  sub_categories: TreatmentCategoryAPI[];
  description: string;
};

export type GetTreatmentCategoriesResultAPI = {
  treatment_categories: TreatmentSectionAPI[];
};

export type ReviewAPI = {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  create_date: string;
  rating: number;
  reference_id: string;
  reference_type: string;
  comments: string;
};
