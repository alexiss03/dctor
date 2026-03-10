// Copyright Seer Technologies Inc. 2019. All Rights Reserved.
import {AnyObject} from '@loopback/repository';
// import {ValidationResponse} from 'in-app-purchase';

/**
 * Class
 * @template S
 */
interface Class<S> {
  // new MyClass(...args) ==> T
  new (...args: any[]): S;
  // Other static properties/operations
  [property: string]: any;
}

type AppError = Error & {
  code?: string;
  details?: Array<AnyObject> | null;
};

// type AppleValidationResponse = ValidationResponse & {
//   receipt: AnyObject;
// };

type TxnFeeRates = {
  domestic: number;
  international: number;
  in_app_ios: number;
  credits: number;
};

type ValidationError = AppError & {};

export {
  // AppleValidationResponse,
  Class,
  AppError,
  TxnFeeRates,
  ValidationError,
};
