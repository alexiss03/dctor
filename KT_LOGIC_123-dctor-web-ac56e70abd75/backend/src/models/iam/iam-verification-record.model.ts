import {Entity, Model, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'iam_verification_record'},
    strict: 'filter',
  },
})
export class IAMVerificationRecord extends Entity {
  @property({
    type: 'string',
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'owner',
    },
  })
  owner: string;

  @property({
    type: 'string',
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'name',
    },
  })
  name: string;

  @property({
    type: 'string',
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'created_time',
    },
  })
  created_time: string;

  @property({
    type: 'string',
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'remote_addr',
    },
  })
  remote_addr: string;

  @property({
    type: 'string',
    postgresql: {
      dataType: 'character varying (10)',
      columnName: 'type',
    },
  })
  type: string;

  // address: string[];

  @property({
    type: 'string',
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'user',
    },
  })
  user: string;

  @property({
    type: 'string',
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'provider',
    },
  })
  provider: string;

  @property({
    type: 'string',
    id: true,
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'receiver',
    },
  })
  receiver: string;

  @property({
    type: 'string',
    id: true,
    postgresql: {
      dataType: 'character varying (10)',
      columnName: 'code',
    },
  })
  code: string;

  @property({
    type: 'number',
    postgresql: {
      dataType: 'bigint',
      columnName: 'time',
    },
  })
  time: number;

  @property({
    type: 'boolean',
    postgresql: {
      columnName: 'is_used',
    },
  })
  is_used: boolean;

  constructor(data?: Partial<IAMVerificationRecord>) {
    super(data);
  }
}

export interface IAMVerificationRecordRelations {
  // describe navigational properties here
}

export type IAMVerificationRecordWithRelations = IAMVerificationRecord &
  IAMVerificationRecordRelations;
