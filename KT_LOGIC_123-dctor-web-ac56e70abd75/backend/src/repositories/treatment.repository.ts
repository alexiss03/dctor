import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DctorDbDataSource} from '../datasources';
import {Treatment, TreatmentRelations} from '../models';

export class TreatmentRepository extends DefaultCrudRepository<
  Treatment,
  typeof Treatment.prototype.id,
  TreatmentRelations
> {
  constructor(@inject('datasources.DctorDb') dataSource: DctorDbDataSource) {
    super(Treatment, dataSource);
  }
}
