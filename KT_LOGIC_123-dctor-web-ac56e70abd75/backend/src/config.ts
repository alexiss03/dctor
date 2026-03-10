import config from 'config';
import {ApplicationConfig} from '@loopback/core';
import {
  RequestBodyParserOptions,
  RestServerConfig,
  RequestBodyValidationOptions,
} from '@loopback/rest';
import qs from 'qs';

export const getConfig = async (): Promise<ApplicationConfig> => {
  let base_path: string = '/api';
  const appConfig = config;
  if (appConfig.has('base_path')) {
    base_path = appConfig.get('base_path');
  }
  let validation: RequestBodyValidationOptions = {
    // ajvKeywords: true,
    allErrors: true,
    // jsonPointers: true,
    $data: true,
  };
  let requestBodyParser: RequestBodyParserOptions = {
    validation,
    json: {
      limit: '50mb',
    },
  };
  let rest: RestServerConfig = {
    // protocol: 'https',
    // key: fs.readFileSync('./dctor-server.key'),
    // cert: fs.readFileSync('./dctor-server.cert'),
    port: +(process.env.PORT ?? 3000),
    host: process.env.HOST,
    basePath: base_path,
    // The `gracePeriodForClose` provides a graceful close for http/https
    // servers with keep-alive clients. The default value is `Infinity`
    // (don't force-close). If you want to immediately destroy all sockets
    // upon stop, set its value to `0`.
    // See https://www.npmjs.com/package/stoppable
    gracePeriodForClose: 5000, // 5 seconds
    expressSettings: {
      // This is needed since by default, when nesting
      // objects qs will only parse up to 5 children deep
      // Reference: https://www.npmjs.com/package/qs
      'query parser fn': (str?: string): any => {
        if (!str) {
          return {};
        }
        return qs.parse(str, {depth: 100});
      },
    },
    openApiSpec: {
      // useful when used with OpenAPI-to-GraphQL to locate your application
      setServersFromRequest: true,
      endpointMapping: {
        [`${base_path}/openapi-spec.json`]: {
          version: '3.0.0',
          format: 'json',
        },
        /*
         * Commented out due to a call on js-yaml's safeDump without
         * skipping invalid types / values in  rest.server.ts resulting
         * to an error.
         */
        // [`${base_path}/openapi-spec.yaml`]: {
        //   version: '3.0.0',
        //   format: 'yaml',
        // },
      },
    },
    requestBodyParser,
  };

  if (appConfig.has('cors')) {
    rest.cors = {...appConfig.get('cors')};
  }
  return {
    dctor: {
      supportEmail: appConfig.get('supportEmail'),
      verificationCodeTimeout: appConfig.get('verificationCodeTimeout'),
    },
    datasources: {...(<object>appConfig.get('datasources'))},
    rest,
  };
};
