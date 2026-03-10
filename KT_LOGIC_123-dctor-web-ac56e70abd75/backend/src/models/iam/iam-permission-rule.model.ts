import {Entity, Model, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'iam_dctor_adapter'},
    strict: 'filter',
  },
})
export class IAMPermissionRule extends Entity {
  @property({
    type: 'string',
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'ptype',
    },
  })
  ptype: string;

  @property({
    type: 'string',
    id: true,
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'v0',
    },
  })
  v0: string;

  @property({
    type: 'string',
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'v1',
    },
  })
  v1: string;

  @property({
    type: 'string',
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'v2',
    },
  })
  v2: string;

  @property({
    type: 'string',
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'v3',
    },
  })
  v3: string;

  @property({
    type: 'string',
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'v4',
    },
  })
  v4: string;

  @property({
    type: 'string',
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'v5',
    },
  })
  v5: string;

  // @property({
  //   type: 'string',
  //   postgresql: {
  //     dataType: 'character varying (100)',
  //     columnName: 'id',
  //   },
  // })
  // id: string;


  constructor(data?: Partial<IAMPermissionRule>) {
    super(data);
  }
}

export interface IAMPermissionRuleRelations {
  // describe navigational properties here
}

export type IAMPermissionRuleWithRelations = IAMPermissionRule &
  IAMPermissionRuleRelations;
