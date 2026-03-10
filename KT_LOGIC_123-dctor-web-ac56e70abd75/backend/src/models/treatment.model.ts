import {model, property} from '@loopback/repository';
import {BaseEntity} from '@dctor/core';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'dctor', table: 'treatment'},
    strict: 'filter',
  },
})
export class Treatment extends BaseEntity('treatment') {
  @property({
    type: 'string',
    required: false,
    postgresql: {
      dataType: 'character varying (32)',
      columnName: 'cpt_code',
    },
  })
  cptCode: string;

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
    required: false,
    postgresql: {
      dataType: 'uuid',
      columnName: 'category_id',
    },
  })
  categoryId: string;

  constructor(data?: Partial<Treatment>) {
    super(data);
  }
}

export interface TreatmentRelations {
  // describe navigational properties here
}

export type TreatmentWithRelations = Treatment & TreatmentRelations;
