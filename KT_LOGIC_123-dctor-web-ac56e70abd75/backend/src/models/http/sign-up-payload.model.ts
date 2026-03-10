import {AnyObject, Model, model, property} from '@loopback/repository';
import { IAMUser } from '../iam';

@model({})
export class SignUpPayload extends IAMUser {
    @property({
        type: 'boolean',
        required: true,
      })
      agreement: boolean;    
}
