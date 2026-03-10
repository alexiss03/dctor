import {
  IAMUser,
  IAMUserProperties,
  IAMUserRole,
  SearchIndex,
} from '../models';
import {IAMUserRepository, SearchIndexRepository} from '../repositories';

type DemoDoctorSpec = {
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  specialty: string;
  phone: string;
};

const DEMO_PATIENT_EMAIL = 'seed.patient.local@example.com';
const DEMO_PATIENT_PASSWORD = 'seedpass';

const DEMO_DOCTORS: DemoDoctorSpec[] = [
  {firstName: 'Amelia', lastName: 'Carter', city: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.006, specialty: 'Cardiology', phone: '+12125550101'},
  {firstName: 'Noah', lastName: 'Bennett', city: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832, specialty: 'Pediatrics', phone: '+14165550102'},
  {firstName: 'Sofia', lastName: 'Ramirez', city: 'Mexico City', country: 'Mexico', latitude: 19.4326, longitude: -99.1332, specialty: 'Dermatology', phone: '+5255550103'},
  {firstName: 'Lucas', lastName: 'Silva', city: 'Sao Paulo', country: 'Brazil', latitude: -23.5505, longitude: -46.6333, specialty: 'Neurology', phone: '+55115550104'},
  {firstName: 'Valentina', lastName: 'Diaz', city: 'Buenos Aires', country: 'Argentina', latitude: -34.6037, longitude: -58.3816, specialty: 'Endocrinology', phone: '+54115550105'},
  {firstName: 'Oliver', lastName: 'Wright', city: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, specialty: 'Orthopedics', phone: '+44205550106'},
  {firstName: 'Emma', lastName: 'Martin', city: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, specialty: 'General Medicine', phone: '+3315550107'},
  {firstName: 'Liam', lastName: 'Fischer', city: 'Berlin', country: 'Germany', latitude: 52.52, longitude: 13.405, specialty: 'Pulmonology', phone: '+49305550108'},
  {firstName: 'Isabella', lastName: 'Lopez', city: 'Madrid', country: 'Spain', latitude: 40.4168, longitude: -3.7038, specialty: 'Rheumatology', phone: '+34915550109'},
  {firstName: 'Ethan', lastName: 'Rossi', city: 'Rome', country: 'Italy', latitude: 41.9028, longitude: 12.4964, specialty: 'Gastroenterology', phone: '+39065550110'},
  {firstName: 'Maya', lastName: 'Hassan', city: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357, specialty: 'Internal Medicine', phone: '+2025550111'},
  {firstName: 'Aiden', lastName: 'Okafor', city: 'Lagos', country: 'Nigeria', latitude: 6.5244, longitude: 3.3792, specialty: 'Family Medicine', phone: '+23415550112'},
  {firstName: 'Grace', lastName: 'Njoroge', city: 'Nairobi', country: 'Kenya', latitude: -1.2921, longitude: 36.8219, specialty: 'Infectious Disease', phone: '+254205550113'},
  {firstName: 'Zain', lastName: 'Khan', city: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708, specialty: 'Nephrology', phone: '+97145550114'},
  {firstName: 'Anika', lastName: 'Patel', city: 'Mumbai', country: 'India', latitude: 19.076, longitude: 72.8777, specialty: 'Gynecology', phone: '+91225550115'},
  {firstName: 'Kai', lastName: 'Tan', city: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, specialty: 'Oncology', phone: '+6565550116'},
  {firstName: 'Yui', lastName: 'Sato', city: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, specialty: 'Psychiatry', phone: '+8135550117'},
  {firstName: 'Min', lastName: 'Park', city: 'Seoul', country: 'South Korea', latitude: 37.5665, longitude: 126.978, specialty: 'Otolaryngology', phone: '+8225550118'},
  {firstName: 'Chloe', lastName: 'Wilson', city: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, specialty: 'Sports Medicine', phone: '+6125550119'},
  {firstName: 'Aria', lastName: 'Ngata', city: 'Auckland', country: 'New Zealand', latitude: -36.8509, longitude: 174.7645, specialty: 'Urology', phone: '+6495550120'},
  {firstName: 'Narin', lastName: 'Sukchai', city: 'Bangkok', country: 'Thailand', latitude: 13.7563, longitude: 100.5018, specialty: 'Allergy and Immunology', phone: '+6625550121'},
  {firstName: 'Deniz', lastName: 'Demir', city: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784, specialty: 'Hematology', phone: '+902125550122'},
  {firstName: 'Thando', lastName: 'Maseko', city: 'Johannesburg', country: 'South Africa', latitude: -26.2041, longitude: 28.0473, specialty: 'Emergency Medicine', phone: '+27115550123'},
  {firstName: 'Harper', lastName: 'Lee', city: 'San Francisco', country: 'USA', latitude: 37.7749, longitude: -122.4194, specialty: 'Telemedicine', phone: '+14155550124'},
];

function toSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
}

function buildDoctorEmail(doctor: DemoDoctorSpec, index: number): string {
  const name = toSlug(`${doctor.firstName}.${doctor.lastName}`);
  return `seed.${name}.${index + 1}@demo.dctor.local`;
}

async function ensureDemoPatient(iamUserRepo: IAMUserRepository): Promise<void> {
  const existing = await iamUserRepo.findOne({
    where: {email: DEMO_PATIENT_EMAIL},
  });

  if (existing) {
    return;
  }

  await iamUserRepo.create(
    new IAMUser({
      owner: 'dctor',
      firstName: 'Jordan',
      lastName: 'Reed',
      birthday: '1993-09-22',
      gender: 'M',
      avatar: '',
      bio: 'Demo patient account',
      email: DEMO_PATIENT_EMAIL,
      emailVerified: true,
      password: DEMO_PATIENT_PASSWORD,
      phone: '+15550009999',
      properties: IAMUserProperties.serialize(
        new IAMUserProperties({
          insurance: [],
          notification_reminder: 1,
          push_notifications: false,
          email_notifications: false,
        }),
      ),
      roles: [
        new IAMUserRole({
          owner: 'dctor',
          name: 'role_patient',
          isEnabled: true,
        }),
      ],
    }),
  );
}

async function ensureDoctorSearchEntry(
  searchIndexRepo: SearchIndexRepository,
  sourceId: string,
  doctor: DemoDoctorSpec,
  index: number,
): Promise<void> {
  const existing = await searchIndexRepo.findOne({
    where: {
      sourceId,
      sourceType: 'doctor',
    },
  });

  if (existing) {
    return;
  }

  await searchIndexRepo.create(
    new SearchIndex({
      sourceType: 'doctor',
      sourceId,
      name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      treatments: [
        {
          id: `trt-${index + 1}`,
          name: doctor.specialty,
          currency: 'USD',
          price: 90 + (index % 7) * 15,
        },
      ] as any,
      insurance: [
        {
          id: 'ins-global',
          name: 'Global Health Plan',
        },
      ] as any,
      availability: [
        {
          weekday: (index % 5) + 1,
          timeStart: '09:00:00',
          timeEnd: '17:00:00',
          rule: 'WEEKLY',
        },
      ] as any,
      addresses: [
        {
          addressLine: `${doctor.city}, ${doctor.country}`,
          latitude: doctor.latitude,
          longitude: doctor.longitude,
        },
      ] as any,
      rating: Number((3.8 + (index % 10) * 0.1).toFixed(1)),
    }) as any,
  );
}

async function ensureDemoDoctor(
  iamUserRepo: IAMUserRepository,
  searchIndexRepo: SearchIndexRepository,
  doctor: DemoDoctorSpec,
  index: number,
): Promise<void> {
  const email = buildDoctorEmail(doctor, index);

  let existingDoctor = await iamUserRepo.findOne({
    where: {email},
  });

  if (!existingDoctor) {
    existingDoctor = await iamUserRepo.create(
      new IAMUser({
        owner: 'dctor',
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        birthday: '1988-01-01',
        gender: 'M',
        avatar: '',
        bio: `${doctor.specialty} specialist`,
        email,
        emailVerified: true,
        password: 'seedpass',
        phone: doctor.phone,
        properties: IAMUserProperties.serialize(
          new IAMUserProperties({
            insurance: [],
            notification_reminder: 1,
            push_notifications: false,
            email_notifications: false,
          }),
        ),
        roles: [
          new IAMUserRole({
            owner: 'dctor',
            name: 'role_doctor',
            isEnabled: true,
          }),
        ],
      }),
    );
  }

  if (!existingDoctor.id) {
    return;
  }

  await ensureDoctorSearchEntry(
    searchIndexRepo,
    existingDoctor.id,
    doctor,
    index,
  );
}

export async function seedDemoData(
  iamUserRepo: IAMUserRepository,
  searchIndexRepo: SearchIndexRepository,
): Promise<void> {
  await ensureDemoPatient(iamUserRepo);

  for (let index = 0; index < DEMO_DOCTORS.length; index++) {
    const doctor = DEMO_DOCTORS[index];
    await ensureDemoDoctor(iamUserRepo, searchIndexRepo, doctor, index);
  }
}
