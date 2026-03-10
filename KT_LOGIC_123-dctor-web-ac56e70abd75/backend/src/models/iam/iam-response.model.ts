import {Entity, model, property} from '@loopback/repository';

@model({})
export class IAMResponse extends Entity {
  @property({
    type: 'string',
  })
  status: string;

  @property({
    type: 'string',
  })
  msg: string;

  @property({
    type: 'string',
  })
  sub: string;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'object',
  })
  data: any;

  @property({
    type: 'object',
  })
  data2: any;

  constructor(data?: Partial<IAMResponse>) {
    super(data);
  }
}

export interface IAMResponseRelations {
  // describe navigational properties here
}

export type IAMResponseWithRelations = IAMResponse & IAMResponseRelations;
