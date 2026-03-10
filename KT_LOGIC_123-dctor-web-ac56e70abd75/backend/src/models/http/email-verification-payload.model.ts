import {AnyObject, Model, model, property} from '@loopback/repository';

@model({})
export class EmailVerificationPayload extends Model {
  @property({
    type: 'string',
    required: true,
  })
  dest: string;

  @property({
    type: 'string',
    required: false,
  })
  code: string;

  @property({
    type: 'string',
    required: false,
  })
  method: string;
}
