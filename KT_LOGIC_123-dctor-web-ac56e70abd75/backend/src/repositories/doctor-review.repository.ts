import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DctorDbDataSource} from '../datasources';
import {DoctorReview, DoctorReviewRelations} from '../models';

export class DoctorReviewRepository extends DefaultCrudRepository<
  DoctorReview,
  typeof DoctorReview.prototype.id,
  DoctorReviewRelations
> {
  constructor(@inject('datasources.DctorDb') dataSource: DctorDbDataSource) {
    super(DoctorReview, dataSource);
  }
}
