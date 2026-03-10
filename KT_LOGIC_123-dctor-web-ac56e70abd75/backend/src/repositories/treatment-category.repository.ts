import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DctorDbDataSource} from '../datasources';
import {TreatmentCategory, TreatmentCategoryRelations} from '../models';

export class TreatmentCategoryRepository extends DefaultCrudRepository<
TreatmentCategory,
  typeof TreatmentCategory.prototype.id,
  TreatmentCategoryRelations
> {
  constructor(@inject('datasources.DctorDb') dataSource: DctorDbDataSource) {
    super(TreatmentCategory, dataSource);
  }
}
