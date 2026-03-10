import {Entity, Model, model, property} from '@loopback/repository';

@model({})
export class IAMUserRole extends Model {
  @property({
    type: 'string',
    required: true,
  })
  owner: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isEnabled: boolean;

  constructor(data?: Partial<IAMUserRole>) {
    super(data);
  }

}

export type SerializedIAMUserProperties = {
  [key: string]: string;
};

@model({})
export class IAMUserProperties extends Model {
  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  insurance?: string[];

  @property({
    type: 'number',
    required: true,
  })
  notification_reminder: number;

  @property({
    type: 'boolean',
    required: true,
  })
  push_notifications: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  email_notifications: boolean;

  constructor(data?: Partial<IAMUserProperties>) {
    super(data);
  }

  public static serialize(
    props: IAMUserProperties,
  ): SerializedIAMUserProperties {
    let result: SerializedIAMUserProperties = {
      insurance: JSON.stringify(props.insurance),
      notification_reminder: `${props.notification_reminder}`,
      push_notifications: `${props.push_notifications}`,
      email_notifications: `${props.email_notifications}`,
    };
    return result;
  }
  public static deserialize(
    props: SerializedIAMUserProperties,
  ): IAMUserProperties {
    let result: IAMUserProperties = new IAMUserProperties({
      insurance: JSON.parse(props.insurance),
      notification_reminder: +props.notification_reminder,
      push_notifications: Boolean(props.push_notifications),
      email_notifications: Boolean(props.email_notifications),
    });
    return result;
  }
}

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'iam_user'},
    strict: 'filter',
  },
})
export class IAMUser extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'id',
    },
  })
  id?: string;

  @property({
    type: 'string',
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'owner',
    },
  })
  owner: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'first_name',
    },
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'last_name',
    },
  })
  lastName: string;

  @property({
    type: 'date',
    required: true,
    jsonSchema: {
      format: 'date',
    },
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'birthday',
    },
  })
  birthday: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'gender',
    },
  })
  gender: string;

  // address: string[];

  @property({
    type: 'string',
    required: false,
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'avatar',
    },
  })
  avatar: string;

  @property({
    type: 'string',
    required: false,
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'bio',
    },
  })
  bio: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'email',
    },
  })
  email: string;

  @property({
    type: 'boolean',
    required: false,
    postgresql: {
      columnName: 'email_verified',
    },
  })
  emailVerified: boolean;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'password',
    },
  })
  password: string;

  @property({
    type: 'string',
    required: false,
    postgresql: {
      dataType: 'character varying (100)',
      columnName: 'phone',
    },
  })
  phone: string;

  @property({
    type: 'object',
    required: false,
    postgresql: {
      dataType: 'text',
      columnName: 'properties',
    },
  })
  properties: IAMUserProperties | SerializedIAMUserProperties;

  @property({
    type: 'array',
    itemType: IAMUserRole,
    required: false,
    postgresql: {
      dataType: 'text',
      columnName: 'roles',
    },
  })
  roles: Array<IAMUserRole>;

  constructor(data?: Partial<IAMUser>) {
    super(data);
  }
}

export interface IAMUserRelations {
  // describe navigational properties here
}

export type IAMUserWithRelations = IAMUser & IAMUserRelations;
