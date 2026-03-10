import {
  Component,
  ClassMap,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';

import {BaseApplication} from './application';

import {DctorDbDataSource} from './datasources';

// import {OpenApiController} from './controllers';

import {CoreError} from './keys';

class CoreComponent implements Component {
  classes: ClassMap = {};

  controllers?: ControllerClass[] = [];

  providers?: ProviderMap = {};

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: BaseApplication,
  ) {
    application.dataSource(DctorDbDataSource, 'DctorDb');
    Object.assign(this.application.error_codes_map, CoreError.CODES);
  }
}

export {CoreComponent};
