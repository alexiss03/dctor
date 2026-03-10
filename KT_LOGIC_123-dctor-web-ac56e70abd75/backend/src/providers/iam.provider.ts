import {getService, juggler} from '@loopback/service-proxy';
import {inject, Provider} from '@loopback/core';
import {IAMDataSource} from '../datasources';
import {IAMResponse, IAMUser} from '../models';

export interface IAMService {
  signup(
    baseURL: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
  ): Promise<IAMResponse>;
  getUser(
    baseURL: string,
    authorization: string,
    owner: string,
    id: string,
    email: string | undefined,
  ): Promise<IAMResponse>;
  updateUser(
    baseURL: string,
    authorization: string,
    owner: string,
    id: string,
    user: IAMUser,
    columns: string[],
  ): Promise<IAMResponse>;
  sendVerificationCode(
    baseURL: string,
    type: string,
    applicationId: string,
    method: string,
    checkType: string,
    dest: string,
  ): Promise<IAMResponse>;
  getEmailAndPhone(
    baseURL: string,
    username: string
  ): Promise<IAMUser & IAMResponse>;
  login(
    baseURL: string,
    authorization: string,
    id: string,
    username: string,
    type: string,
    code: string
  ): Promise<IAMResponse>;
  setPassword(
    baseURL: string,
    authorization: string,
    id: string,
    oldPassword: string,
    newPassword: string
  ): Promise<IAMResponse>;
}

export class IAMServiceProvider implements Provider<IAMService> {
  constructor(
    @inject('datasources.IAM')
    protected ds: IAMDataSource,
  ) {}

  value(): Promise<IAMService> {
    return getService(this.ds);
  }
}
