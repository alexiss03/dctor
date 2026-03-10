import Ajv, {_ as ajvUnderscore, KeywordCxt} from 'ajv';

import {inject} from '@loopback/core';
import {DefaultCrudRepository, Options} from '@loopback/repository';

import {CoreError, ValidationError} from '@dctor/core';

import {DctorDbDataSource} from '../../datasources';
import {
  EmailVerificationPayload,
  IAMUser,
  IAMUserRelations,
} from '../../models';

export class IAMUserRepository extends DefaultCrudRepository<
  IAMUser,
  typeof IAMUser.prototype.id,
  IAMUserRelations
> {
  constructor(
    @inject('datasources.DctorDb') dataSource: DctorDbDataSource,
    @inject('dctor.config.supportEmail')
    private supportEmail: string = '<support email>',
  ) {
    super(IAMUser, dataSource);
  }

  private async initAjvValidators(ajv: Ajv, options?: Options): Promise<void> {
    let self = this;
    ajv.addKeyword({
      keyword: 'unique',
      type: 'string',
      schemaType: 'string',
      async code(cxt: KeywordCxt) {
        const existingRecord = await self.findOne(
          cxt.schema.filterFn(cxt.data),
          options,
        );
        if (existingRecord) {
          cxt.fail(ajvUnderscore`false`);
        }
      },
    });
  }

  public async validateVerificationPayload(
    payload: EmailVerificationPayload,
    options: Options | undefined = undefined,
  ): Promise<void> {
    const existingRecord = await this.findOne(
      {
        where: {
          owner: 'dctor',
          email: payload.dest,
        },
        fields: {id: true, email: true},
      },
      options,
    );
    if (existingRecord && (!payload.method || payload.method == 'signup')) {
      let err: ValidationError = new Error('Email already exists');
      err.code = CoreError.VALIDATION_FAILED.key;
      throw err;
    }
    //     const _ajv = new Ajv({allErrors: true, $data: true});
    //     await this.initAjvValidators(_ajv, options);
    //     const schema = {
    //         $async: true,
    //         allOf: [
    //             {
    //                 properties: {
    //                     dest: {
    //                         unique: {
    //                           filterFn: (email: string) => ({
    //                             where: {
    //                                 email
    //                             },
    //                           }),
    //                         },
    //                     },
    //                 }
    //             }
    //         ]
    //     };
    //     const validate = _ajv.compile(schema);
    //     try {
    //         console.log('Will validate');
    //         let data = await validate(payload);
    //         console.log(data);
    //       } catch (result) {
    //         let err: ValidationError = new Error(
    //           `Something went wrong. Please try again. If problem persists, contact ${this.supportEmail}`,
    //         );
    //         err.code = CoreError.VALIDATION_FAILED.key;
    //         err.details = result.errors || [];
    //         throw err;
    //       }
  }
}
