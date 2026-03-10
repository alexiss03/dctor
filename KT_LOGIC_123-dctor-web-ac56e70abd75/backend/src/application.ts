import {ApplicationConfig, ControllerClass} from '@loopback/core';

import {Class, Repository} from '@loopback/repository';

import {RestBindings} from '@loopback/rest';

import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';

import {BaseApplication, CoreComponent} from '@dctor/core';

import {IAMDataSource} from './datasources';
import { BASE_API_SPEC } from './docs/base-openapi-spec';

import {
  DoctorReviewRepository,
  EventRepository,
  EventAttendeeRepository,
  FacilityRepository,
  IAMUserRepository,
  IAMPermissionRuleRepository,
  IAMVerificationRecordRepository,
  InsuranceRepository,
  SearchIndexRepository,
  TreatmentRepository,
  TreatmentCategoryRepository,
} from './repositories';

import {
  AppointmentController,
  DoctorReviewController,
  FacilityController,
  IAMController,
  IAMUserController,
  InsuranceController,
  SearchController,
  TreatmentController,
  TreatmentCategoryController,
} from './controllers';

import {DctorSequence} from './sequence';
import {IAMServiceProvider} from './providers';

export {ApplicationConfig};

export class DctorApiApplication extends BaseApplication {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.bind('dctor.config.supportEmail').to(options.dctor.supportEmail);
    this.bind('dctor.config.verificationCodeTimeout').to(
      options.dctor.verificationCodeTimeout,
    );
    this.bind('datasources.config.iam').to(options.datasources.iam);
    this.dataSource(IAMDataSource, 'IAM');

    // Set up the custom sequence
    this.sequence(DctorSequence);

    this.component(CoreComponent);

    [
      DoctorReviewRepository,
      EventRepository,
      EventAttendeeRepository,
      FacilityRepository,
      IAMUserRepository,
      IAMPermissionRuleRepository,
      IAMVerificationRecordRepository,
      InsuranceRepository,
      SearchIndexRepository,
      TreatmentRepository,
      TreatmentCategoryRepository,
    ].map((clazz: Class<Repository<any>>) => this.repository(clazz));

    let self = this;
    [{service: IAMServiceProvider, name: 'IAMService'}].map(args =>
      self.service(args.service, {interface: 'IAMService'}),
    );

    [
      AppointmentController,
      DoctorReviewController,
      FacilityController,
      IAMController,
      IAMUserController,
      InsuranceController,
      SearchController,
      TreatmentCategoryController,
      TreatmentController,
    ].map((ctor: ControllerClass) => this.controller(ctor));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestBindings.API_SPEC).to(BASE_API_SPEC);
    this.configure(RestExplorerBindings.CONFIG).to(options.rest);
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
  }
}
