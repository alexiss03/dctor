import {
  AvailabilityAPI,
  SearchResultAPI,
  SearchResultDoctorAPI,
} from "@/types/api";
import _ from "lodash";

function generateAvailability(start: number, end: number): AvailabilityAPI[] {
  const hours = end - start;

  return _.flatten(
    Array.from(new Array(hours)).map((_, i) => {
      const _start = start + i;

      return Array.from(new Array(5)).map((_, j) => {
        const weekday = j + 1;

        return {
          weekday,
          time_start: `${(_start + "").padStart(2, "0")}:00:00`,
          rule: null,
          time_end: `${(_start + 1 + "").padStart(2, "0")}:00:00`,
        };
      });
    })
  );
}

export const SAMPLE_SEARCH_RESULTS: SearchResultAPI[] = [
  {
    treatments: [
      {
        price: 10,
        treatment: {
          name: "Cell enumeration &id",
          cpt_code: "86152",
        },
        id: "f2e1a342-fe69-5cba-bc6c-a0416a92d6d4",
        currency: "USD",
      },
    ],
    availability: generateAvailability(9, 22),
    addresses: [
      {
        longitude: 0,
        address_line:
          "2273 Woodbridge Lane, Southfield, Michigan, United States of America",
        latitude: 0,
      },
    ],
    name: "Mayo Clinic - Rochester",
    facility: {
      name: "Mayo Clinic - Rochester",
      doctors: [
        {
          doctor: {
            name: "Lambert Honrade",
            id: "1f2cbe1a-2304-4ae1-95a3-703f8f3053ea",
          },
        },
      ],
      avatar: "/DUMMYclinic.jpg",
      reviews_received_stats: {
        aggregate: {
          count: 1,
          avg: {
            rating: 5,
          },
        },
      },
    },
    source_id: "f2e1a342-fe69-5cba-bc6c-a0416a92d6d4",
    source_type: "clinic",
    insurance_list: [
      {
        emirates: "Sharjah",
        id: "a03f4a54-9fa9-5268-8075-7a42ddfb0990",
        name: "American Life Insurance Co",
      },
      {
        emirates: "Abu Dhabi",
        id: "0065d439-5677-53d1-b49a-e00414664141",
        name: "Al Wathba National Insurance Co P.S.C.",
      },
    ],
    user: null,
  },
  {
    treatments: [
      {
        price: 10,
        treatment: {
          name: "Cell enumeration &id",
          cpt_code: "86152",
        },
        id: "f2e1a342-fe69-5cba-bc6c-a0416a92d6d4",
        currency: "USD",
      },
    ],
    availability: generateAvailability(10, 21),
    addresses: [
      {
        longitude: 0,
        address_line:
          "2273 Woodbridge Lane, Southfield, Michigan, United States of America",
        latitude: 0,
      },
    ],
    name: "Lambert Honrade",
    facility: null,
    source_id: "1f2cbe1a-2304-4ae1-95a3-703f8f3053ea",
    source_type: "doctor",
    insurance_list: [
      {
        insurance: {
          emirates: "Sharjah",
          id: "a03f4a54-9fa9-5268-8075-7a42ddfb0990",
          name: "American Life Insurance Co",
        },
      },
    ],
    user: {
      reviews_received_stats: {
        aggregate: {
          count: 1,
          avg: {
            rating: 5,
          },
        },
      },
      health_facilities: [
        {
          treatments: [
            {
              price: 100,
              treatment: {
                name: "Oral HIV-1/HIV-2 screen",
                cpt_code: "G0435",
              },
              id: "00ffc4a0-8162-5029-b56b-ea71da2ef1a3",
              currency: "USD",
            },
          ],
          availability: generateAvailability(9, 22),
          insurance_list: [
            {
              insurance: {
                emirates: "Sharjah",
                id: "a03f4a54-9fa9-5268-8075-7a42ddfb0990",
                name: "American Life Insurance Co",
              },
            },
          ],
          facility: {
            id: "f2e1a342-fe69-5cba-bc6c-a0416a92d6d4",
            name: "Mayo Clinic - Rochester",
            attributes: {
              addresses: [
                {
                  longitude: 0,
                  address_line:
                    "2273 Woodbridge Lane, Southfield, Michigan, United States of America",
                  latitude: 0,
                },
              ],
            },
          },
        },
      ],
    },
  } as SearchResultDoctorAPI,
];
