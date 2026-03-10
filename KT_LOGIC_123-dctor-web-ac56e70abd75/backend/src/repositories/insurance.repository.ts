import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DctorDbDataSource} from '@dctor/core';
import {Insurance, InsuranceRelations} from '../models';

export class InsuranceRepository extends DefaultCrudRepository<
  Insurance,
  typeof Insurance.prototype.id,
  InsuranceRelations
> {
  constructor(@inject('datasources.DctorDb') dataSource: DctorDbDataSource) {
    super(Insurance, dataSource);
  }
}
