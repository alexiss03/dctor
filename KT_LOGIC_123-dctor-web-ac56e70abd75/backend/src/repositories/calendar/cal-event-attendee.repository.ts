import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DctorDbDataSource} from '../../datasources';
import {EventAttendee, EventAttendeeRelations} from '../../models';

export class EventAttendeeRepository extends DefaultCrudRepository<
  EventAttendee,
  typeof EventAttendee.prototype.id,
  EventAttendeeRelations
> {
  constructor(@inject('datasources.DctorDb') dataSource: DctorDbDataSource) {
    super(EventAttendee, dataSource);
  }
}
