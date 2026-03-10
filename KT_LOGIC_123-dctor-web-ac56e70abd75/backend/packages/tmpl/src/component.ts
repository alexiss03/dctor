import {
  Component,
  ClassMap,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';

import {BaseApplication} from '@dctor/core';

// import {OpenApiController} from './controllers';

import {TmplError} from './keys';

class TmplComponent implements Component {
  classes: ClassMap = {};

  controllers?: ControllerClass[] = [];

  providers?: ProviderMap = {};

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: BaseApplication,
  ) {
    Object.assign(this.application.error_codes_map, TmplError.CODES);
  }
}

export {TmplComponent};
