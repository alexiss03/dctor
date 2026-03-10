// Copyright KTLogic  2020. All Rights Reserved.
import {BindingKey} from '@loopback/context';

/**
 * Binding keys used by the helpers.
 */
export namespace CoreError {
  export const VALIDATION_FAILED = BindingKey.create<number>(
    'dctor.core.keys.app-error.validation-failed',
  );
  export const CODES: {[key: string]: number} = {
    [VALIDATION_FAILED.key]: 422,
  };
}
