import {model, property} from '@loopback/repository';
import {BaseEntity} from '@dctor/core';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'dctor', table: 'treatment_category'},
    strict: 'filter',
  },
})
export class TreatmentCategory extends BaseEntity('treatment_category') {

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
      columnName: 'parent_id',
    },
  })
  parentId: string;

  @property({
    type: 'string',
    required: false,
    postgresql: {
      dataType: 'character varying (2048)',
      columnName: 'icon_url',
    },
  })
  iconUrl: string;

  constructor(data?: Partial<TreatmentCategory>) {
    super(data);
  }
}

export interface TreatmentCategoryRelations {
  // describe navigational properties here
}

export type TreatmentCategoryWithRelations = TreatmentCategory & TreatmentCategoryRelations;
