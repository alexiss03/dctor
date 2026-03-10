import {model, property} from '@loopback/repository';
import {BaseEntity} from '@dctor/core';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'dctor', table: 'facility'},
    strict: 'filter',
  },
})
export class Facility extends BaseEntity('facility') {
  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'character varying (256)',
      columnName: 'name',
    },
  })
  name: string;

  constructor(data?: Partial<Facility>) {
    super(data);
  }
}

export interface FacilityRelations {
  // describe navigational properties here
}

export type FacilityWithRelations = Facility & FacilityRelations;
