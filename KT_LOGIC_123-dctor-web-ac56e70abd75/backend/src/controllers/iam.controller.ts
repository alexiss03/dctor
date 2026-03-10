import {Buffer} from 'buffer';
import {inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
  Options,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';

import {CoreError, ValidationError} from '@dctor/core';

import {IAMDataSource} from '../datasources';
import {
  EmailVerificationPayload,
  IAMUser,
  IAMUserProperties,
  IAMUserRole,
  IAMResponse,
  IAMVerificationRecord,
  ResetPasswordPayload,
  SignUpPayload,
  IAMPermissionRule,
} from '../models';
import {IAMService} from '../providers';
import {
  IAMUserRepository,
  IAMPermissionRuleRepository,
  IAMVerificationRecordRepository,
} from '../repositories';

export class IAMController {
  constructor(
    @service('IAMService')
    private iamService: IAMService,
    @inject('datasources.config.iam')
    private iamServiceConfig: Options,
    @repository(IAMUserRepository)
    private iamUserRepo: IAMUserRepository,
    @repository(IAMVerificationRecordRepository)
    private iamVerifnRecRepo: IAMVerificationRecordRepository,
    @repository(IAMPermissionRuleRepository)
    private iamDctorAdapterRepo: IAMPermissionRuleRepository,
  ) {}

  private normalizeSignupUserPayload(payload: unknown): IAMUser {
    const source =
      payload && typeof payload === 'object' && 'user' in payload
        ? (payload as {user: unknown}).user
        : payload;

    const data = (source ?? {}) as Record<string, unknown>;

    const sourceType =
      typeof data.search_index === 'object' &&
      data.search_index !== null &&
      typeof (data.search_index as Record<string, unknown>).data === 'object'
        ? (((data.search_index as Record<string, unknown>)
            .data as Record<string, unknown>).source_type as string)
        : '';

    const inferredRoleName =
      sourceType === 'doctor'
        ? 'role_doctor'
        : sourceType === 'clinic_admin'
        ? 'role_clinic_admin'
        : 'role_patient';

    const roles = Array.isArray(data.roles)
      ? (data.roles as IAMUserRole[])
      : [
          new IAMUserRole({
            owner: 'dctor',
            name: inferredRoleName,
            isEnabled: true,
          }),
        ];

    const serializedProps = IAMUserProperties.serialize(
      new IAMUserProperties({
        insurance: Array.isArray(data.insurance)
          ? (data.insurance as string[])
          : [],
        notification_reminder:
          typeof data.notification_reminder === 'number'
            ? data.notification_reminder
            : 1,
        push_notifications:
          typeof data.push_notifications === 'boolean'
            ? data.push_notifications
            : false,
        email_notifications:
          typeof data.email_notifications === 'boolean'
            ? data.email_notifications
            : false,
      }),
    );

    return new IAMUser({
      id:
        typeof data.id === 'string'
          ? data.id
          : `dctor/local-${Date.now().toString(36)}`,
      owner:
        typeof data.owner === 'string' && data.owner !== ''
          ? data.owner
          : 'dctor',
      firstName:
        (data.firstName as string) ??
        (data.first_name as string) ??
        'Local',
      lastName:
        (data.lastName as string) ??
        (data.last_name as string) ??
        'User',
      birthday:
        (data.birthday as string) ??
        (data.dateOfBirth as string) ??
        '1990-01-01',
      gender: (data.gender as string) ?? 'M',
      avatar: (data.avatar as string) ?? '',
      bio: (data.bio as string) ?? '',
      email: (data.email as string) ?? '',
      emailVerified: true,
      password: (data.password as string) ?? '',
      phone: (data.phone as string) ?? '',
      properties:
        typeof data.properties === 'object' && data.properties !== null
          ? IAMUserProperties.serialize(
              new IAMUserProperties({
                insurance: Array.isArray(
                  (data.properties as Record<string, unknown>).insurance,
                )
                  ? ((data.properties as Record<string, unknown>)
                      .insurance as string[])
                  : [],
                notification_reminder:
                  typeof (data.properties as Record<string, unknown>)
                    .notification_reminder === 'number'
                    ? ((data.properties as Record<string, unknown>)
                        .notification_reminder as number)
                    : 1,
                push_notifications:
                  typeof (data.properties as Record<string, unknown>)
                    .push_notifications === 'boolean'
                    ? ((data.properties as Record<string, unknown>)
                        .push_notifications as boolean)
                    : false,
                email_notifications:
                  typeof (data.properties as Record<string, unknown>)
                    .email_notifications === 'boolean'
                    ? ((data.properties as Record<string, unknown>)
                        .email_notifications as boolean)
                    : false,
              }),
            )
          : serializedProps,
      roles,
    });
  }

  private async upsertLocalIamUser(user: IAMUser): Promise<void> {
    try {
      await this.iamUserRepo.findById(user.id);
      await this.iamUserRepo.updateById(user.id, user);
      return;
    } catch (e) {
      await this.iamUserRepo.create(user);
    }
  }

  private getUserIdFromAuthorizationHeader(
    authorization?: string,
  ): string | null {
    if (!authorization) {
      return null;
    }

    const token = authorization.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return null;
    }

    try {
      const normalized = token
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(Math.ceil(token.length / 4) * 4, '=');
      const decoded = Buffer.from(normalized, 'base64').toString('utf8');
      const parsed = JSON.parse(decoded) as {userId?: string};

      if (typeof parsed.userId === 'string' && parsed.userId !== '') {
        return parsed.userId;
      }
    } catch (e) {
      // Treat token as a plain id fallback for local compatibility.
    }

    return token;
  }

  @post('/login')
  @response(200, {
    description: 'IAM login response',
    content: {'application/json': {schema: getModelSchemaRef(IAMResponse)}},
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: {type: 'string'},
              password: {type: 'string'},
              type: {type: 'string'},
            },
            required: ['username'],
          },
        },
      },
    })
    payload: {username: string; password?: string; type?: string},
  ): Promise<IAMResponse> {
    const normalizedUsername = (payload.username ?? '').trim();
    const username =
      normalizedUsername !== '' ? normalizedUsername : 'guest@local.dctor';

    const user = await this.iamUserRepo.findOne({
      where: {
        email: username,
      },
    });

    let activeUser = user;

    if (!activeUser) {
      const idSuffix =
        username
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') || Date.now().toString(36);

      activeUser = new IAMUser({
        id: `dctor/local-${idSuffix}`,
        owner: 'dctor',
        firstName: 'Local',
        lastName: 'User',
        birthday: '1990-01-01',
        gender: 'M',
        avatar: '',
        bio: '',
        email: username,
        emailVerified: true,
        password:
          payload.password && payload.password.trim() !== ''
            ? payload.password
            : 'local-password',
        phone: '',
        properties: IAMUserProperties.serialize(
          new IAMUserProperties({
            insurance: [],
            notification_reminder: 1,
            push_notifications: false,
            email_notifications: false,
          }),
        ),
        roles: [
          new IAMUserRole({
            owner: 'dctor',
            name: 'role_patient',
            isEnabled: true,
          }),
        ],
      });
      await this.upsertLocalIamUser(activeUser);
    }
    if (!activeUser.id) {
      activeUser.id = `dctor/local-${Date.now().toString(36)}`;
      await this.upsertLocalIamUser(activeUser);
    }

    const token = Buffer.from(
      JSON.stringify({
        userId: activeUser.id,
      }),
    )
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return new IAMResponse({
      status: 'ok',
      msg: '',
      sub: activeUser.id ?? username,
      name: activeUser.email ?? username,
      data: token,
      data2: null,
    });
  }

  @post('/set-password')
  @response(200, {
    description: 'IAM set password response',
    content: {'application/json': {schema: getModelSchemaRef(IAMResponse)}},
  })
  async setPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              userName: {type: 'string'},
              oldPassword: {type: 'string'},
              newPassword: {type: 'string'},
            },
            required: ['userName', 'newPassword'],
          },
        },
      },
    })
    payload: {userName: string; oldPassword?: string; newPassword: string},
  ): Promise<IAMResponse> {
    let user: IAMUser | null = null;

    try {
      user = await this.iamUserRepo.findById(payload.userName);
    } catch (e) {
      user = await this.iamUserRepo.findOne({
        where: {
          email: payload.userName,
        },
      });
    }

    if (!user?.id) {
      return new IAMResponse({
        status: 'error',
        msg: 'User not found.',
        sub: payload.userName,
        name: payload.userName,
        data: '',
        data2: null,
      });
    }

    if (
      payload.oldPassword &&
      user.password &&
      payload.oldPassword !== user.password
    ) {
      return new IAMResponse({
        status: 'error',
        msg: 'Old password is incorrect.',
        sub: user.id,
        name: user.email,
        data: '',
        data2: null,
      });
    }

    await this.iamUserRepo.updateById(user.id, {
      password: payload.newPassword,
    });

    return new IAMResponse({
      status: 'ok',
      msg: 'Password updated.',
      sub: user.id,
      name: user.email,
      data: 'ok',
      data2: null,
    });
  }

  @get('/users/me')
  @response(200, {
    description: 'Current user profile',
    content: {'application/json': {schema: getModelSchemaRef(IAMUser)}},
  })
  async getMe(
    @param.header.string('authorization') authorization?: string,
  ): Promise<IAMUser> {
    const userId = this.getUserIdFromAuthorizationHeader(authorization);

    if (!userId) {
      throw new HttpErrors.Unauthorized('Missing authorization token.');
    }

    return this.iamUserRepo.findById(userId);
  }

  @post('/send-verification-code')
  @response(200, {
    description: 'IAM Response model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(EmailVerificationPayload)},
    },
  })
  async sendVerificationCode(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EmailVerificationPayload, {
            title: 'EmailVerificationPayload',
          }),
        },
      },
    })
    payload: EmailVerificationPayload,
  ): Promise<IAMResponse> {
    try {
      await this.iamUserRepo.validateVerificationPayload(payload);
    } catch (err) {
      if (err.code === CoreError.VALIDATION_FAILED.key) {
        let httpError = new HttpErrors[422](err.message);
        throw httpError;
      } else {
        throw err;
      }
    }
    if (!payload.code || payload.code === '') {
      try {
        let verificationResponse: IAMResponse =
          await this.iamService.sendVerificationCode(
            this.iamServiceConfig.baseURL,
            'email',
            'admin/dctor-app',
            payload.method ?? 'signup',
            'none',
            encodeURIComponent(payload.dest),
          );
        return verificationResponse;
      } catch (e) {
        const generatedCode = '000000';

        await this.iamVerifnRecRepo.create(
          new IAMVerificationRecord({
            owner: 'dctor',
            name: payload.dest,
            created_time: `${Date.now()}`,
            remote_addr: '127.0.0.1',
            type: 'code',
            user: payload.dest,
            provider: 'local',
            receiver: payload.dest,
            code: generatedCode,
            time: Math.floor(Date.now() / 1000),
            is_used: false,
          }),
        );

        return new IAMResponse({
          status: 'ok',
          msg: 'Local verification code generated.',
          sub: payload.dest,
          name: payload.dest,
          data: generatedCode,
          data2: null,
        });
      }
    } else {
      let [isValid, verifnRecord] = await this.iamVerifnRecRepo.verifyReceiver(
        payload.dest,
        payload.code,
      );
      if (!isValid) {
        let httpError = new HttpErrors[422](
          'Code is invalid for the corresponding email.',
        );
        throw httpError;
      }
      await this.iamVerifnRecRepo.updateAll(
        {is_used: true},
        {
          receiver: payload.dest,
          code: payload.code,
          time: verifnRecord?.time || 0,
        },
      );
      return new IAMResponse({
        status: 'ok',
        msg: 'Code is valid.',
        sub: payload.dest,
        name: '',
        data: payload.code,
        data2: undefined,
      });
    }
  }

  @post('/signup')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(SignUpPayload)}},
  })
  async signup(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SignUpPayload, {
            title: 'SignUpPayload',
            exclude: ['id'],
          }),
        },
      },
    })
    payload: Omit<IAMUser, 'id'> | {agreement: boolean; user: Partial<IAMUser>},
  ): Promise<
    IAMResponse | {
      user: {id: string};
      permissions: {affected_rows: number};
      password: {status: string};
    }
  > {
    const localUser = this.normalizeSignupUserPayload(payload);

    if (!localUser.email || !localUser.password) {
      throw new HttpErrors.UnprocessableEntity(
        'Email and password are required.',
      );
    }

    try {
      const signupResponse: IAMResponse = await this.iamService.signup(
        this.iamServiceConfig.baseURL,
        localUser.password,
        localUser.firstName,
        localUser.lastName,
        localUser.email,
      );

      if (
        signupResponse.status === 'ok' &&
        typeof signupResponse.data === 'string' &&
        signupResponse.data !== ''
      ) {
        localUser.id = signupResponse.data;
        await this.upsertLocalIamUser(localUser);

        const iamPermissionRule = new IAMPermissionRule({
          ptype: 'g',
          v0: signupResponse.data,
          v1: `${localUser.owner}/role_patient`,
          v5: `${localUser.owner}/permission_rbac`,
        });
        await this.iamDctorAdapterRepo.create(iamPermissionRule);

        return {
          user: {id: signupResponse.data},
          permissions: {affected_rows: 1},
          password: {status: 'ok'},
        };
      }
    } catch (e) {
      // Fall back to local-only signup when IAM service is unavailable.
    }

    const existingUser = await this.iamUserRepo.findOne({
      where: {
        email: localUser.email,
      },
    });

    if (existingUser) {
      throw new HttpErrors.Conflict('Email already exists.');
    }

    if (!localUser.id) {
      localUser.id = `dctor/local-${Date.now().toString(36)}`;
    }

    await this.upsertLocalIamUser(localUser);

    return {
      user: {
        id: localUser.id,
      },
      permissions: {
        affected_rows: 1,
      },
      password: {
        status: 'ok',
      },
    };
  }

  @post('/reset-password')
  @response(200, {
    description: 'Reset password model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(ResetPasswordPayload)},
    },
  })
  async resetPassword(
    @param.query.string('clientId') clientId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ResetPasswordPayload, {
            title: 'ResetPasswordPayload',
          }),
        },
      },
    })
    payload: ResetPasswordPayload,
  ): Promise<IAMResponse> {
    let user: IAMResponse = await this.iamService.getEmailAndPhone(
      this.iamServiceConfig.baseURL,
      payload.username
    );
    if(user.status !== 'ok') {
      return user;
    }
    let authorization = `Basic ${Buffer.from(
      `${clientId}:${payload.clientSecret}`,
    ).toString('base64')}`;
    let loginResponse: IAMResponse = await this.iamService.login(
      this.iamServiceConfig.baseURL,
      authorization,
      user.data.name ?? '',
      payload.username,
      'token',
      payload.code
    );
    if(loginResponse.status !== 'ok') {
      return loginResponse;
    }
    let changeResponse: IAMResponse = await this.iamService.setPassword(
      this.iamServiceConfig.baseURL,
      `Bearer ${loginResponse.data}`,
      user.data.name,
      '',
      encodeURIComponent(payload.newPassword)
    );
    return changeResponse;
  }

  @get('/verification-records')
  @response(200, {
    description: 'Array of verification record instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(IAMVerificationRecord, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(IAMVerificationRecord) filter?: Filter<IAMVerificationRecord>,
  ): Promise<IAMVerificationRecord[]> {
    return this.iamVerifnRecRepo.find(filter);
  }
}
