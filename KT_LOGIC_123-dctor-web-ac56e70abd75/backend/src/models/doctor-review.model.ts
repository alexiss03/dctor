import {model, property} from '@loopback/repository';
import {BaseEntity} from '@dctor/core';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'dctor', table: 'doctor_review'},
    strict: 'filter',
  },
})
export class DoctorReview extends BaseEntity('doctor_review') {

  @property({
    required: true,
    postgresql: {
      dataType: 'uuid',
      columnName: 'doctor_id',
    },
  })
  doctorId: string;

  @property({
    required: true,
    postgresql: {
      dataType: 'uuid',
      columnName: 'patient_id',
    },
  })
  patientId: string;

  @property({
    type: 'number',
    required: false,
    postgresql: {
      columnName: 'rating',
    },
  })
  rating: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'text',
      columnName: 'comments',
    },
  })
  comments: string;

  @property({
    type: 'string',
    required: false,
    postgresql: {
      dataType: 'character varying (256)',
      columnName: 'location',
    },
  })
  location: string;

  @property({
    type: 'string',
    required: false,
    postgresql: {
      dataType: 'character varying (256)',
      columnName: 'treatment',
    },
  })
  treatment: string;

  constructor(data?: Partial<DoctorReview>) {
    super(data);
  }
}

export interface DoctorReviewRelations {
  // describe navigational properties here
}

export type DoctorReviewWithRelations = DoctorReview & DoctorReviewRelations;
