import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DctorDbDataSource} from '../datasources';
import {Facility, FacilityRelations} from '../models';

export class FacilityRepository extends DefaultCrudRepository<
  Facility,
  typeof Facility.prototype.id,
  FacilityRelations
> {
  constructor(@inject('datasources.DctorDb') dataSource: DctorDbDataSource) {
    super(Facility, dataSource);
  }
}
