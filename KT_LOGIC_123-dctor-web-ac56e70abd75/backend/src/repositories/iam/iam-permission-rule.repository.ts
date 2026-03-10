import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DctorDbDataSource} from '../../datasources';
import {
  IAMPermissionRule,
  IAMPermissionRuleRelations,
} from '../../models';

export class IAMPermissionRuleRepository extends DefaultCrudRepository<
  IAMPermissionRule,
  typeof IAMPermissionRule.prototype.v0,
  IAMPermissionRuleRelations
> {
  constructor(
    @inject('datasources.DctorDb') dataSource: DctorDbDataSource,
  ) {
    super(IAMPermissionRule, dataSource);
  }
}
