import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DctorDbDataSource} from '../../datasources';
import {
  IAMVerificationRecord,
  IAMVerificationRecordRelations,
} from '../../models';

export class IAMVerificationRecordRepository extends DefaultCrudRepository<
  IAMVerificationRecord,
  typeof IAMVerificationRecord.prototype.receiver,
  IAMVerificationRecordRelations
> {
  constructor(
    @inject('datasources.DctorDb') dataSource: DctorDbDataSource,
    @inject('dctor.config.verificationCodeTimeout')
    private verificationCodeTimeout: number,
  ) {
    super(IAMVerificationRecord, dataSource);
  }

  async verifyReceiver(
    dest: string,
    code: string,
  ): Promise<[boolean, IAMVerificationRecord | undefined]> {
    let verifnCode = await this.findOne({
      where: {receiver: dest, code, is_used: false},
      order: ['time DESC'],
    });
    if (!verifnCode) {
      return [false, undefined];
    }
    let currDate = new Date();
    if (
      (currDate.getTime() / 1000.0 - verifnCode.time) / 3600 <=
      this.verificationCodeTimeout * 60
    )
      return [true, verifnCode];
    return [false, verifnCode];
  }
}
