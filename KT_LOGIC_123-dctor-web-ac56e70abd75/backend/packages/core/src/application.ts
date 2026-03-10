import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, extensionFor} from '@loopback/core';
import {LoggingBindings, LoggingComponent, WINSTON_FORMAT, WINSTON_TRANSPORT, WinstonTransports} from '@loopback/logging';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {format} from 'winston';

const types = require('pg').types;
const PG_DATATYPE_INT8 = 20;

// Fix for parsing of bigint fields
// Reference: https://github.com/brianc/node-pg-types/issues/28
// types.setTypeParser(PG_DATATYPE_INT8, 'text', parseFloat);

export class BaseApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  public error_codes_map: {[key: string]: number} = {};

  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.bind('datasources.config.dctordb').to(options.datasources.dctordb);

    // Set up default home page
    this.static('/', path.join(__dirname, '../../../public'));

    this.configure(LoggingBindings.COMPONENT).to({
      enableFluent: false, // default to true
      enableHttpAccessLog: false, // default to true
    });
    this.configure(LoggingBindings.WINSTON_LOGGER).to({
      level: 'info',
      format: format.json(),
      defaultMeta: {framework: 'LoopBack'},
    });
    this
      .bind('logging.winston.formats.colorize')
      .to(format.colorize())
      .apply(extensionFor(WINSTON_FORMAT));

    const consoleTransport = new WinstonTransports.Console({
      level: 'info',
      format: format.combine(format.colorize(), format.simple()),
    });
    this
      .bind('logging.winston.transports.console')
      .to(consoleTransport)
      .apply(extensionFor(WINSTON_TRANSPORT));

    this.component(LoggingComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
