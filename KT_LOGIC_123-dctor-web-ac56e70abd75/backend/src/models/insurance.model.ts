import {model, property} from '@loopback/repository';
import {BaseEntity} from '@dctor/core';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'dctor', table: 'insurance'},
    strict: 'filter',
  },
})
export class Insurance extends BaseEntity('insurance') {
  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'character varying (256)',
      columnName: 'name',
    },
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'character varying (128)',
      columnName: 'emirates',
    },
  })
  emirates: string;

  constructor(data?: Partial<Insurance>) {
    super(data);
  }
}

export interface InsuranceRelations {
  // describe navigational properties here
}

export type InsuranceWithRelations = Insurance & InsuranceRelations;
