import {model, Model, property} from '@loopback/repository';
import {BaseEntity} from '@dctor/core';

@model({})
export class Event_EventAttendee extends Model {

  @property({
    type: 'string',
    required: true,
    id: true,
    postgresql: {
      // dataType: 'uuid',
      dataType: 'character varying',
      dataLength: 64,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
      columnName: 'id',
    },
  })
  id: string;

  @property({
    type: 'string',
    required: false,
    postgresql: {
      dataType: 'character varying',
      dataLength: 64,
      nullable: 'YES',
      columnName: 'attendee_id',
    },
  })
  attendee_id?: string;

  @property({
    type: 'string',
    required: false,
    postgresql: {
      dataType: 'character varying (32)',
      columnName: 'status',
    },
    jsonSchema: {
        // Operations based on RFC-6902
        enum: ['pending', 'accepted', 'rejected'],
    },
  })
  status: string;
  
  public static serialize(
    data: Array<Event_EventAttendee>,
  ): string {
    return JSON.stringify(data);
  }

  public static deserialize(
    data: string,
  ): Array<Event_EventAttendee> {
    return JSON.parse(data).map(
      (item: Partial<Event_EventAttendee>) => new Event_EventAttendee(item)
    );
  }
}

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'dctor', table: 'event'},
    strict: 'filter',
  },
})
export class Event extends BaseEntity('event') {

  @property({
    type: 'date',
    required: true,
    default: () => new Date(),
    postgresql: {
      columnName: 'dtstamp',
      dataType: 'timestamp with time zone',
      nullable: 'NO',
    },
  })
  dtStamp?: Date;

  @property({
    type: 'date',
    required: false,
    default: () => new Date(),
    postgresql: {
      columnName: 'dtstart',
      dataType: 'timestamp with time zone',
      nullable: 'NO',
    },
  })
  dtStart?: Date;

  @property({
    type: 'date',
    required: false,
    default: () => new Date(),
    postgresql: {
      columnName: 'dtend',
      dataType: 'timestamp with time zone',
      nullable: 'NO',
    },
  })
  dtEnd?: Date;

//   @property({
//     type: 'string',
//     required: false,
//     postgresql: {
//       dataType: 'character varying (512)',
//       columnName: 'summary',
//     },
//   })
//   summary: string;

//   @property({
//     type: 'string',
//     required: false,
//     postgresql: {
//       dataType: 'character varying (1024)',
//       columnName: 'description',
//     },
//   })
//   description: string;

  @property({
    type: 'string',
    required: false,
    postgresql: {
      dataType: 'character varying (32)',
      columnName: 'status',
    },
    jsonSchema: {
        // Operations based on RFC-6902
        enum: ['new', 'incoming', 'ongoing', 'cancelled', 'completed'],
    },
  })
  status: string;

  @property({
    type: 'array',
    itemType: Event_EventAttendee,
    required: false,
    postgresql: {
      dataType: 'json',
      columnName: 'attendees',
    },
  })
  attendees?: Array<Event_EventAttendee>;

  @property({
    type: 'string',
    required: false,
    postgresql: {
      dataType: 'character varying (1024)',
      columnName: 'clinic_id',
    },
  })
  clinic_id?: string;

  @property({
    type: 'string',
    required: false,
    postgresql: {
      dataType: 'character varying (1024)',
      columnName: 'condition',
    },
  })
  condition: string;

  @property({
    type: 'string',
    required: false,
    postgresql: {
      dataType: 'character varying (1024)',
      columnName: 'notes',
    },
  })
  notes: string;

  constructor(data?: Partial<Event>) {
    super(data);
  }
}

export interface EventRelations {
  // describe navigational properties here
}

export type EventWithRelations = Event & EventRelations;
