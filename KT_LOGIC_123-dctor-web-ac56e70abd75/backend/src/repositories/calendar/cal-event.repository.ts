import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DctorDbDataSource} from '../../datasources';
import {Event, EventRelations} from '../../models';

export class EventRepository extends DefaultCrudRepository<
  Event,
  typeof Event.prototype.id,
  EventRelations
> {
  constructor(@inject('datasources.DctorDb') dataSource: DctorDbDataSource) {
    super(Event, dataSource);
  }
}
