import {model, Model, property} from '@loopback/repository';
import {BaseEntity} from '@dctor/core';

@model({
    settings: {
      idInjection: false,
      postgresql: {schema: 'dctor', table: 'event_attendee'},
      strict: 'filter',
    },
  })
  
export class EventAttendee extends BaseEntity('event_attendee') {

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'event_id',
      dataType: 'uuid',
      nullable: 'NO',
    },
  })
  eventId?: string;
  
  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'attendee_id',
      dataType: 'uuid',
      nullable: 'NO',
    },
  })
  attendeeId?: string;

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
    data: Array<EventAttendee>,
  ): string {
    return JSON.stringify(data);
  }

  public static deserialize(
    data: string,
  ): Array<EventAttendee> {
    return JSON.parse(data).map(
      (item: Partial<EventAttendee>) => new EventAttendee(item)
    );
  }

  constructor(data?: Partial<EventAttendee>) {
    super(data);
  }
}

export interface EventAttendeeRelations {
    // describe navigational properties here
  }
  
  export type EventAttendeeWithRelations = EventAttendee & EventAttendeeRelations;
  