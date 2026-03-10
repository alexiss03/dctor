import {AnyObject, Model, model, property} from '@loopback/repository';

/**
 * {
 *   "id": 9078,
 *   "owner": "built-in",
 *   "name": "68f55b28-7380-46b1-9bde-64fe1576e3b3",
 *   "createdTime": "2022-01-01T01:03:42+08:00",
 *   "organization": "built-in",
 *   "clientIp": "159.89.126.192",
 *   "user": "admin",
 *   "method": "POST",
 *   "requestUri": "/api/login",
 *   "action": "login",
 *   "isTriggered": false
 * }
 */

@model({})
export class SignUpWebhookPayload extends Model {
  @property({
    type: 'number',
    required: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  owner: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'date',
    required: true,
  })
  createdTime: Date;

  @property({
    type: 'string',
    required: true,
  })
  organization: string;

  @property({
    type: 'string',
    required: true,
  })
  clientIp: string;

  @property({
    type: 'string',
    required: true,
  })
  user: string;

  @property({
    type: 'string',
    required: true,
  })
  method: string;

  @property({
    type: 'string',
    required: true,
  })
  requestUri: string;

  @property({
    type: 'string',
    required: true,
  })
  action: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isTriggered: boolean;
}
